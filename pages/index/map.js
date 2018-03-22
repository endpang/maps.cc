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
    if (app.globalData.openid){

    }else{

      wx.login({
        success: function (r) {
          var code = r.code;//登录凭证
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
                  data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                  success: function (data) {
                    console.log(data)
                    //4.解密成功后 获取自己服务器返回的结果
                    if (data.data.status == 1) {
                      var userInfo_ = data.data.userInfo;
                      app.globalData.openid = data.data.userInfo.openid
                      console.log(app.globalData.userInfo, app.globalData.openid)
                    } else {
                      console.log('解密失败')
                    }

                  },
                  fail: function () {
                    console.log('系统错误')
                  }
                })
              },
              fail: function () {
                console.log('获取用户信息失败')
              }
            })

          } else {
            console.log('获取用户登录态失败！' + r.errMsg)
          }
        },
        fail: function () {
          console.log('登陆失败')
        }
      })

    }
  
    //地图初始化
    wx.downloadFile({
      url: 'https://maps.cc/345.png',
      type: 'audio',
      success: function (res) {
        this.setData({
          'map.markers': [{
            id: 0,
            latitude: 39.953,
            longitude: 116.378,
            //iconPath: res.tempFilePath,
            name: "公司",
            desc: "天音通信",
            width: 50,
            height: 50
          }],
          'map.hasMarkers': true//解决方案  
        })
        //console.log(res)
      }.bind(this)
    })
    this.mapCtx = wx.createMapContext('myMap')
    //this.getCenterLocation
    setTimeout(function () {
      //要延时执行的代码
      this.mapCtx.moveToLocation()
      
    }.bind(this), 200)
    setTimeout(function () {
      //要延时执行的代码
      this.getCenterLocation()

    }.bind(this), 1000)
    setTimeout(function () {
      //要延时执行的代码
      setInterval(function () {
        this.mapCtx.moveToLocation()
      }.bind(this), 1000) //循环时间 这里是1秒   
      setInterval(function(){
        wx.getLocation({
          type: 'gcj02',
          success: function (res) {
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
                  //console.log(data)
                  for (var i = 0; i < data.data.count; i++) {
                    console.log(data.data.friend[i].id)
                    this.mapCtx.translateMarker({
                      markerId: 0,
                      autoRotate: false,
                      duration: 1000,
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
        
      }.bind(this), 10000)
    }.bind(this), 2000)
     
    
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
  }
})