# maps.cc

共享位置信息的小程序。

3.21 实现动态加载 markers

3.22 增加login & 通过服务器获取 openid

3.23 从服务器获取最新位置并更新 marker 位置

3.24 修正translate marker 的问题。

3.25 多用户加载和搜索

3.26 解决非调试状态问题

# bug

(fixed) 只有调试模式能加载，非调试无法显示。

原因是下载头像地址是微信的，缓存到自己的服务器即可解决。
