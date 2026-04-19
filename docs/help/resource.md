# 资源与技巧

这里提供一些与项目使用非直接相关，但可能对你整体使用有帮助的工具与技巧。

## 精选工具

- [Quark-Auto-Save](https://github.com/Cp0204/quark-auto-save)

  夸克网盘签到、自动转存、命名整理、发推送提醒和刷新媒体库一条龙。

- [CloudSaver](https://github.com/jiangrui1994/cloudsaver)

  一个基于 Vue 3 + Express 的网盘资源搜索与转存工具。

- [StrmTool](https://github.com/jinlin-teck/StrmTool)

  支持 Emby/Jellyfin 的插件，用于优化 strm 文件的媒体信息管理和播放体验。

## 文档资料

- [Terminus 终点站 WIKI](https://embywiki.911997.xyz/docs/usage/play-in-browser/)

  一个 Emby 公益服，并非让你注册它，其 WIKI “在各种设备上使用” 具有参考价值。

- [Emby公益不完全指北](https://wiki.freeembyguide.eu.org/docs/use/recommand.html)

  其“客户端推荐”具有参考价值，帮助你选择适合自己的 Emby 客户端。

- [Emby 媒体命名最佳实践](https://emby.media/support/articles/Movie-Naming.html)

- [Infuse 媒体命名最佳实践](https://support.firecore.com/hc/zh-cn/articles/215090947-%E5%85%83%E6%95%B0%E6%8D%AE-101)

- [Windows 文件系统命名约定](https://learn.microsoft.com/zh-cn/windows/win32/fileio/naming-a-file#naming-conventions)

## 简明技巧

### 夸克网盘移动端 URL 抓包

> 20260212 起，受夸克API改动影响，仅填 Cookie 无法获取302直链，具体表现为“回落到NAS代理，仅转码直链播放失败，日志报错 [plf_invalid]”
>
> 继续使用直链需要抓取移动端抓包，相关讨论：[#57](https://github.com/Cp0204/SmartStrm/issues/57), [OpenList#2115](https://github.com/OpenListTeam/OpenList/issues/2115)

iOS 安装证书可以抓，安卓没 root 抓不了，可以在电脑上使用模拟器抓包，以下是简要教程：

**准备工作**：电脑，下载 [MuMu模拟器](https://mumu.163.com/)、[proxypin-android.apk](https://github.com/wanghongenpin/proxypin/releases)、[夸克.apk](https://www.wandoujia.com/apps/7457948/history_v954)

**实施步骤：**
1. 启动 MuMu模拟器：
   - **右上角菜单->设备设置->其他->Root 权限** 打开
   - **磁盘->磁盘共享 展开->可写系统盘** 打开
2. 把 ProxyPin 、夸克 的 apk 拖入模拟器安装
3. ProxyPin 打开 **右上角菜单->HTTPS代理->启用HTTPS代理、安装根证书->一键自动安装到系统**，重启模拟器
4. 打开 ProxyPin 启动抓包，挂后台，打开 **夸克->登录后->随便点几个网盘文件夹**，回到 ProxyPin 查看抓到的请求
5. 在抓包列表找到 `drive-m.../file` 的请求，**长按请求->复制URL** （不要进入详情复制，否则参数不正确）
6. 将 URL 填入 **夸克网盘** 存储的参数中（v0.4.2+ 支持）

### 115 网盘风控说明

> 2026年2月左右，115开放平台大面积对用户（即使是VIP）实施严格的风控。当接口返回提示："已达到当前访问上限，请稍后再试"，这是被风控的表现。

**下面是佚名网友的经验分享：**

目前经过测算115open的永v用户大约是每天15000个访问动作就会每日访问上限，普通vip用户应该1万以内，qps速率应该限制在5以内。

所以你要清楚自己使用115open授权应用的习惯，知道哪些应用使用了115open。
访问动作包括（播放、整理重命名、下载视频文件和字幕图片元数据文件、提取媒体信息、扫片头片尾、截图等）每个文件操作一下就等同于一个访问。

所以如果你每天都大量整理资源就应该把这些访问数合理分配使用，不要去浪费在没有意义的动作上面。

1. 感觉永远不会看的剧就不需要提前提取媒体信息和提取片头片尾。
2. 不要把图片和nfo信息刮削进网盘存放，用emby刮到本地反而是多线程快的多。
3. Infuse打开一个剧集详情页就会同时给5集剧集做文件信息加载访问，所以不要浪费在这。

### 解决 Emby 识别媒体问题

如因 Emby 无法识别出媒体封面和信息，可能是因为网络环境无法访问 TMDB API 导致，需要给 Emby 设置 HTTP 代理。Docker 部署在容器环境变量中添加如下两条：

```ini
HTTP_PROXY=http://172.17.0.1:10081
HTTPS_PROXY=http://172.17.0.1:10081
# 以上 IP:PORT 改为你自己的代理地址，并设置为黑/白名单
```

### 飞牛 Docker 镜像没提示升级的更新方法

飞牛的镜像仓库有缓存，所以需要强制拉取，使用此方法无须命令行操作，只需点击几下即可。

1. 打开 **飞牛 WebUI->Docker->Compose**，停止项目
2. 在右侧的 **`···` 中->清理**，但不要删除 Compose ！
3. 在 **本地镜像** 中删除对应镜像
4. 重新回到 **Compose** 启动项目，将会重新拉取最新镜像和构建

