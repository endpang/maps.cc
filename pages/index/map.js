// map.js
const app = getApp()

Page({
  /**
  data: {
    markers: [{
      iconPath: "/res/108.png",
      id: 0,
      latitude: 39.953,
      longitude: 116.378,
      width: 50,
      height: 50
    }],
    map:true,
    
  },
   */
  data: {
    map: {
      lat: 0,
      lng: 0,
      markers: [],
      hasMarkers: false//解决方案  
    }
  },  
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.postlog(["ready"])
    if (app.globalData.openid){
      //this.postlog(["openid", app.globalData.openid]) 
    }else{

      wx.login({
        success: function (r) {
          var code = r.code;//登录凭证
          this.postlog(["code",code])
          if (code) {
            //2、调用获取用户信息接口
            wx.getUserInfo({
              success: function (res) {
                console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
                //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                wx.request({
                  url: 'https://maps.cc/wx/test.php',//自己的服务接口地址
                  method: 'post',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: { encryptedData: res.encryptedData, iv: res.iv, code: code, avatarUrl: res.userInfo.avatarUrl},
                  success: function (data) {
                    console.log(data)
                    this.postlog(data)
                    //4.解密成功后 获取自己服务器返回的结果
                    if (data.data.status == 1) {
                      var userInfo_ = data.data.userInfo;
                      app.globalData.openid = data.data.userInfo.openid
                      console.log(app.globalData.userInfo, app.globalData.openid)
                    } else {
                      console.log('解密失败')
                      this.postlog(["解密失败"])
                    }

                  }.bind(this),
                  fail: function () {
                    console.log('系统错误')
                    this.postlog(["系统错误"])
                  }
                })
              }.bind(this),
              fail: function () {
                console.log('获取用户信息失败')
                this.postlog(["获取用户信息失败"])
              }
            })

          } else {
            console.log('获取用户登录态失败！' + r.errMsg)
            this.postlog(["获取用户登录态失败！"])
          }
        }.bind(this),
        fail: function () {
          console.log('登陆失败')
          this.postlog(["登陆失败"])
        }
      })
 
    }
    this.postlog(["openid",app.globalData.openid])

    wx.request({
      url: 'https://maps.cc/wx/friend.php',//自己的服务接口地址
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {id:app.globalData.openid},
      success: function (data) {
        console.log(data)
        this.postlog(["frienddata", data])
        //4.解密成功后 获取自己服务器返回的结果
        if (data.data.status == 1) {
          this.postlog(["count", data.data.count])
          console.log("count",data.data.count)

          if (data.data.count > 0){
            data.data.friend.forEach(function (v, i, r) {
              console.log("arr",v);
              wx.downloadFile({
                url: v.iconPath,
                type: 'audio',
                success: function (res) {
                  console.log("id", v.marid)
                  console.log("res", res.tempFilePath)
                  this.data.map.markers.push({
                    id: v.marid,
                    latitude: v.latitude,
                    longitude: v.longitude,
                    iconPath: res.tempFilePath,
                    name: v.name,
                    desc: v.desc,
                    width: 50,
                    height: 50
                  })
                  this.postlog(["push",v.marid, v])

                }.bind(this),
                fail: function (e) {
                  console.log("download error", e)
                  this.postlog(["error", e])
                }.bind(this)
              })
            }.bind(this))
          }
          setTimeout(function () {
            this.postlog(["markers",this.data.map.markers])
            console.log("outmar", this.data.map.markers)
            this.setData({
              'map.markers':this.data.map.markers,
              'map.hasMarkers': true//解决方案  
            })
          }.bind(this),8000)

        } else {
          console.log('解密失败')
        }

      }.bind(this),
      fail: function () {
        console.log('系统错误')
      }
    })
 
    this.mapCtx = wx.createMapContext('myMap')
    //this.getCenterLocation
    setTimeout(function () {
      //要延时执行的代码
      this.mapCtx.moveToLocation()
      
    }.bind(this), 200) 

    setTimeout(function () {
      //要延时执行的代码
      setInterval(function () {
        this.mapCtx.moveToLocation()
      }.bind(this), 1000) //循环时间 这里是1秒  

      setInterval(function(){
        //console.log("map", this.mapCtx)
        /**/
        wx.getLocation({
          type: 'gcj02',
          success: function (res) {
            res["openid"] = app.globalData.openid
            wx.request({
              url: 'https://maps.cc/wx/get.php',//自己的服务接口地址
              method: 'get',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: res,
              success: function (data) {
                //4.解密成功后 获取自己服务器返回的结果
                if (data.data.status == 1) {
                  console.log(data)
                  for (var i = 0; i < data.data.count; i++) {
                    console.log(data.data.friend[i].latitude, data.data.friend[i].longitude)
                    this.mapCtx.translateMarker({
                      markerId: data.data.friend[i].id,
                      autoRotate: false,
                      //duration: 1000,
                      destination: {
                        latitude: data.data.friend[i].latitude,
                        longitude: data.data.friend[i].longitude,
                      },
                      animationEnd() {
                        console.log('animation end')
                      },
                      fail: function (e) {
                        console.log(e)
                      }
                    }) 
                  }

                } else {
                  console.log('解密失败')
                }

              }.bind(this),
              fail: function () {
                console.log('系统错误')
              }
            })
          }.bind(this)
        })
        //*/
        
      }.bind(this), 2000)
    }.bind(this), 10000)
     
    
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })

    
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 0,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 39.953,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },
  postlog:function(log_arr){
    wx.request({
      url: 'https://maps.cc/wx/log.php',//自己的服务接口地址
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: log_arr,
      success: function (data) {
        console.log('log 发送成功')
      }.bind(this),
      fail: function () {
        console.log('系统错误')
      }
    })

  }
})