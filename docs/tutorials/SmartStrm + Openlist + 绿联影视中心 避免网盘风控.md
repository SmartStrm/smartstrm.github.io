# SmartStrm + Openlist + 绿联影视中心 避免网盘风控

> 原链接：https://club.ugnas.com/forum.php?mod=viewthread&tid=2037
>
> 作者：茂茂阿丶

## 1. 详细介绍

### SmartStrm 是什么？

一个媒体库 STRM 文件生成工具。可以和绿联影视中心优雅配合，媒体资源丝滑入库，支持 302 直链播放，支持同步删除远端文件。可以配合 Quark-Auto-Save/CloudSaver, OpenList, Emby 力求即存即看。

### 如何实现，为什么要这么做？

STRM 是一个网络资源的快捷方式，它使得无须在本地存储媒体文件，让绿联影视中心播放时再直接从网络上请求媒体资源，因扫描媒体库只识别文件名，而不用读取媒体文件内容，所以入库极快。支持 STRM 文件的还有 Emby, Jellyfin, Kodi 等流媒体播放器。

**什么是"风控"？**

网盘服务器风控是网盘服务商针对服务器安全性和稳定性风险进行管理和控制的方式。它的目标是保护服务器免受恶意攻击、未经授权的访问和其他潜在风险，为了减少服务器会发生的故障，确保自家的服务器能够正常运行，网盘服务商有一系列的措施和策略用来保护自家的服务器。

### 特性

- 支持 OpenList、WebDAV、夸克网盘、115网盘、天翼云盘、123云盘 等网络驱动
- **任务管理**
  - 基于 Crontab 的定时任务
  - 单个任务独立日志
  - 任务工具箱：内容替换、一键清理
- **STRM 生成**
  - 目录时间检查
  - 增量/同步生成：可清理远端已删文件
  - 指定生成的媒体后缀、文件大小阈值
  - 指定复制的文件后缀
  - 本地存储实时监听生成
- **Webhook**
  - 联动 QAS、CloudSaver 转存即触发任务
  - 配合油猴脚本，网页转存即触发任务
  - Emby 中删除媒体，同步删除远端文件
  - CloudDrive2 文件变更通知实时触发任务 (Pro)
- **插件系统**
  - STRM内容替换、非法文件名修正 等插件，支持任务级配置
  - 飞牛影视刷新 插件 (Pro)
- **管理页面**
  - 存储浏览、批量重命名
  - 任务日志查看
- **一站式 Emby Jellyfin Plex 302 直链播放 (Pro)**

> 本教程需要熟练使用 Docker，并理解项目跟容器之间的关系，如有 Docker 相关问题，最好先自行百度。

## 2. 安装指南

在 Docker 目录创建 SmartStrm 文件夹。

### Docker Compose 部署

```yaml
version: "3"
services:
  smartstrm:
    image: cp0204/smartstrm:latest
    container_name: smartstrm
    restart: unless-stopped
    network_mode: host
    volumes:
      - ./config:/app/config
      - ./logs:/app/logs
      - ./strm:/strm
    environment:
      - PORT=8024
      - ADMIN_USERNAME=admin #你的登录名
      - ADMIN_PASSWORD=admin_password #你的登录密码
```

## 3. 使用

部署好了以后在浏览器地址输入：`https://<DDNS域名>:8024` 可访问 SmartStrm 服务。

输入 docker-compose 中配置的用户名跟密码后进入详情页。

> SmartStrm 存储管理里支持夸克网盘、115网盘、123网盘以及天翼网盘，且对直链获取有一些针对性优化，如果像作者一样需要用到 TaoSync 进行定时备份文件到网盘上，或者有不支持的网盘，比如作者的迅雷云盘也可使用 Openlist 进行挂载。（建议没有特殊需求的话，一个工具即可解决，避免耦合）

下面使用夸克网盘进行演示，驱动选择夸克网盘，填入 Cookie，其他按默认的填写就可以了。

**Cookie 获取方式参考**：[夸克网盘 / TV / Open 获取Cookie](https://doc.oplist.org/guide/drivers/quark)

点击完成后就可以在列表中看到夸克网盘的具体情况。

点击 **任务管理** - **添加任务** - 输入任务名称 - 使用存储选择添加的夸克网盘 - 扫描路径选择你夸克网盘的多媒体文件夹 - 编辑执行时间（`0 3 * * *`）

这个执行时间看个人需要，不建议太频繁调取（作者设置的每天凌晨 3 点跑一次）。

点击运行按钮后，可查看日志。

### 关联 Openlist

如有其他网盘需求，可以关联 Openlist。

点击 **存储管理** - **添加存储**（OpenList 可以在绿联的应用中心下载，详细教程官方知识库有教程：[OpenList功能介绍与使用教程](https://support.ugnas.com/knowledgecenter/?ori=1#/detail/eyJjb2RlIjoiMSYmNjgifQ==)）

**Token 获取**：OpenList 管理后台 - 设置 - 其他 - 令牌

需要先在 Openlist 里面绑定自己的网盘。

点击 **存储浏览** 检查 openlist 是否挂载成功，如显示网盘目录即代表挂载成功，点击右上角新建任务，创建任务。

编辑任务名称、执行时间，这边定时任务时间作者设置的 30 分钟执行一次：`*/30 * * * *`（时间看个人而定）。

点击保存，返回任务管理，可以点击运行按钮手动运行。

返回文件管理里面的 Docker 里面的 SmartStrm 里面的 strm 文件夹，确认是否创建成功。

如果创建成功，下面可以在 **影视中心** - **设置** - **媒体库** - **新建媒体库** - **应用**。

等待扫描完成即可在媒体库看到对应的刮削了。

目前绿联影视中心定时扫描只支持每天运行一次（后期应该会改）。

## 4. 进阶使用

### 302 直链播放 (Pro)

这个应该是你们需要的，我看了一下价格还算合适，有需要的可以试一下。302 代理可以搭配 Emby 或者 Jellyfin，官方应用中心有 Jellyfin 的安装，点击安装即可。

- 官方 Jellyfin 文档：[Jellyfin快速入门指南](https://support.ugnas.com/knowledgecenter/#/detail/eyJpZCI6MTg0MCwidHlwZSI6InRhZzAwMiIsImxhbmd1YWdlIjoiemgtQ04iLCJjbGllbnRUeXBlIjoiUEMiLCJhcnRpY2xlSW5mb0lkIjo1OTIsImFydGljbGVWZXJzaW9uIjoiIiwicGF0aENvZGUiOiIifQ==)
- 官方 Emby 文档：[在绿联 NAS 上搭建 Emby 流媒体服务](https://support.ugnas.com/knowledgecenter/#/detail/eyJjb2RlIjoiMiYmMzYxIn0=)

作者用 Emby 举例：

### Docker Compose 安装部署 Emby

```yaml
services:
  emby:
    image: amilys/embyserver:latest
    container_name: emby
    restart: always
    ports:
      - "8096:8096"
    volumes:
      - ./config:/config
      - /volume3/Docker/SmartStrm/strm:/strm   #这个是你的strm的刮削地址
    environment:
      - TZ=Asia/Shanghai
      - UID=0
      - GID=0
      - GIDLIST=0
    devices:
      - /dev/dri:/dev/dri
```

点击 `http://宿主机IP:8096` 访问 Emby，选择语言，创建用户。

### SmartStrm 设置

**1）开启 302 代理**

- 系统设置 → 302 代理
- 服务端口：8097
- 媒体服务器地址：`http://192.168.x.x:8096` 这里填 emby 的地址
- 需要Emby外部播放器按钮可打开

**2）Emby 设置**

- Emby 后台 → 媒体库 → 添加
- 类型（电影/电视剧/音乐）
- 文件夹路径：容器内 `/strm/任务名`
- 保存并扫描刮削

保存完成后就下一步下一步就 OK 了。

下面配置客户端播放，作者用的爆米花实现（爆米花打钱！）。

> 302 也不是所有人都需要的，看个人需求。

**12.29 更新**：绿联影视中心也是支持 302 的！！！不用去搞 emby 了好像。

---

**项目地址**：[Cp0204 / SmartStrm](https://github.com/Cp0204/SmartStrm)

其他高阶玩法看作者文档。