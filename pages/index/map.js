// map.js
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
    


    wx.downloadFile({
      url: 'https://maps.cc/345.png',
      type: 'audio',
      success: function (res) {
        this.setData({
          'map.markers': [{
            latitude: 39.953,
            longitude: 116.378,
            iconPath: res.tempFilePath,
            name: "公司",
            desc: "天音通信",
            width: 50,
            height: 50
          }],
          'map.hasMarkers': true//解决方案  
        })
        console.log(res)
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