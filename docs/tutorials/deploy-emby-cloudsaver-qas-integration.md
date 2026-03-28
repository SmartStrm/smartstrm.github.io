# SmartStrm 一站式 Emby 302 夸克直链播放

> 原链接：https://linux.do/t/topic/924963
>
> 作者：Jochen（LINUX DO）

项目地址：[GitHub - Cp0204/SmartStrm](https://github.com/Cp0204/SmartStrm)

夸克网盘的 88VIP 服务对个人用户非常方便，资源丰富，论坛上也有许多大佬分享优质内容。然而，目前挂载夸克的方式通常需要通过本地服务器，完全达不到 88VIP 的速度，尤其是在外网（公网或组网）观看时，体验还要受到宽带上行速度的限制，影响观看体验。相比之下，**@Cp0204** 大佬的 SmartStrm 可以实现 302 夸克直链播放，即服务器只负责转发（重定向）到夸克网盘的真实资源链接，而不是自己传输数据，不仅提供流畅的观看体验，还减轻了本地服务器和宽带的压力，下面以 fnOS 为例主要介绍下 SmartStrm 和 Emby 的安装和配置。

## 一、环境与目标

- 环境：飞牛 FNOS（Docker 环境）、Emby
- 目标：部署 SmartStrm/Emby → 配 302 代理、STRM 规则、存储与任务 → Emby 播放

## 二、目录准备（示例路径）

- SmartStrm 目录：`/vol1/1000/docker/SmartStrm`（首次启动自动生成 `config/ logs/ strm/`）
- Emby 配置：`/vol1/1000/docker/emby/config`
- 关键映射：`/vol1/1000/docker/SmartStrm/strm` → Emby 容器内 `/strm`

## 三、部署 Docker

### 1）SmartStrm（host 网络，端口默认 8024）

```yaml
name: smartstrm
services:
  smartstrm:
    image: cp0204/smartstrm:latest
    container_name: smartstrm
    restart: always
    network_mode: host
    volumes:
      - ./config:/app/config
      - ./logs:/app/logs
      - ./strm:/strm
    environment:
      - PORT=8024
      - ADMIN_USERNAME=自定义账号
      - ADMIN_PASSWORD=自定义密码
      # - LICENSE=
```

### 2）Emby（映射 SmartStrm 的 `strm` 到 `/strm`）

需要把 SmartStrm 的 strm 映射到 emby：

```yaml
services:
  emby:
    image: amilys/embyserver:latest
    container_name: emby
    restart: always
    ports:
      - "8096:8096"
    volumes:
      - /vol1/1000/docker/emby/config:/config
      - /vol1/1000/docker/SmartStrm/strm:/strm
    environment:
      - TZ=Asia/Shanghai
      - UID=0
      - GID=0
      - GIDLIST=0
    devices:
      - /dev/dri:/dev/dri
```

### 3）启动与访问

- 飞牛可视化点击部署
- SmartStrm：`http://宿主机IP:8024`
- Emby：`http://宿主机IP:8096`

## 四、SmartStrm 设置

### 1）开启 302 代理

- 系统设置 → 302 代理
- 服务端口：`8097`
- 媒体服务器地址：`http://192.168.x.x:8096` 这里填 emby 的地址
- 需要 emby 外部播放器按钮可打开

### 2）配置 STRM 规则

这里**默认即可**：

- 系统设置 → STRM 设置
- 媒体后缀：`mp4,mkv,mov,avi`
- 大小阈值：`>= 20 MB`
- 复制到本地：`nfo,ass,srt,jpg,png`
- 生成根目录：`/strm`
- 勾选"对 STRM 进行 URL 编码"
- SmartStrm 地址：`http://宿主机IP:8024`

### 3）添加存储（夸克）

- 存储管理 → 添加存储
- 驱动：夸克网盘
- Cookie：浏览器登录后 F12 复制整段 Cookie 粘贴
- STRM 模式：智能回落（Pro）

## 五、创建任务并生成 STRM

### 1）任务管理 → +添加任务

- 存储：选择 quark
- 路径：选择需要同步的文件夹（如 `/来自：分享/电影`、`/来自：分享/电视剧` 等）
- 定时：`0 0 * * *`（每天 00:00），或手动"运行"

### 2）生成位置

- 容器内：`/strm/任务名`
- 宿主机对应：`/vol1/1000/docker/SmartStrm/strm/任务名`

## 六、配置 Emby 媒体库

- Emby 后台 → 媒体库 → 添加
- 类型（电影/电视剧/音乐）
- 文件夹路径：容器内 `/strm/任务名`
- 保存并扫描刮削

**排查**：如库为空，确认已生成 `.strm`、路径映射一致、大小阈值不致过滤。

## 七、播放验证

- Emby 需要打开代理后的地址：`http://宿主机IP:8097`
- 我是把 emby 添加到 alist-tvbox 后，用影视 app 观看的，虽然少了很多 emby 的功能，但是可以免费跳过片头片尾
- 4K 拖动进度条秒播
- 查看视频链接，是 SmartStrm 的

## 八、高级操作

### 1. Quark-Auto-Save 自动转存资源并 Emby 入库

Quark-Auto-Save 是一个强大的自动化工具，可以实现资源的自动转存和 Emby 入库，大大简化了资源管理流程，追番神器！

#### SmartStrm 插件配置

- webhook：`http://192.168.x.x:8024/webhook/d74dc...`
- strmtask：`国外动画,电视剧集,国漫等`（对应 SmartStrm 的任务名称）
- xlist_path_fix：`不用 alist 或者 openlist 这里不用填`

#### Emby 插件配置

- url：`http://192.168.x.x:8096`
- token：`88e7b11df00c47bd91...`（Emby API Token）

### 2. Cloud Saver 手动转存资源并 Emby 入库（手动推送）

适用场景：临时/单次保存分享资源，保存后立即触发 SmartStrm 生成 STRM，并立刻让 Emby 入库，无需等待自动任务。

#### 1）扩展 → 新建自定义推送（Webhook）

- Cloud Saver 侧边栏 → 扩展 → "+ 新建自定义推送"
- 接口地址（SmartStrm Webhook）：`http://192.168.x.x:8024/webhook/你的WebhookToken`
- 请求类型：POST
- 请求体格式：JSON
- 触发延迟时间（秒）：1
- 字段（新增三项）：
  - event：`cs_strm`
  - savepath：`/{savePath}/{shareTitle}`
  - strmtask：`电影,电视剧,国漫,国外动画`
- 保存后启用该推送卡片。

#### 2）在资源卡片发起"保存后推送"

- 进入 Cloud Saver 资源列表，点选要保存的条目。
- 在弹出的"选择保存目录"窗口中：
  - 选择网盘保存路径（如：`/根目录/来自：分享/电影`）。
  - 右下角选择"保存后执行推送 → 夸克网盘"（自定义名称）。
  - 点击"保存"开始转存并等待推送执行。