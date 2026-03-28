# SmartStrm + Emby + OpenList + Emby 联动删除，零成本 NAS 播放完全指南

> 原链接：https://post.smzdm.com/p/amon9plz/
>
> 作者：寒梅别有韵（什么值得买用户）

## SmartStrm + Emby + OpenList + Emby 联动删除直链播放

> 适用人群：有夸克/123 网盘，却没有大上传带宽，但想拥有"秒播"私人影院的朋友
> 硬件要求：任意能跑 Docker 的机器（飞牛，群晖，CasaOS）

本文将为您介绍一种新思路：**Cp0204 大佬的 SmartStrm 项目**。

[GitHub - Cp0204/SmartStrm](https://github.com/Cp0204/SmartStrm)

它能让您的 Emby 媒体库实现 **夸克网盘和 alist 302 直链播放**。这意味着您的服务器只负责一个简单的"重定向"操作，数据流完全由网盘和您的播放设备之间传输，从而彻底解放您的本地服务器和带宽压力，实现极致流畅的观影体验。

用一句话说就是：

> "让网盘'吐'流量，服务器指路人——本地 0 上行，下行满带宽。"

下面，我们将以 DPanel 环境为例，详细介绍如何配置 SmartStrm 与 Emby。

## 一、准备清单

**原理**：SmartStrm 定时扫描您的夸克网盘和 openlist 文件服务器，并为每个媒体文件（如 .mp4 .mkv）生成一个 `.strm` 文件。但是像是字幕（ass,srt）刮削的数据（nfo）就是会自己下载下到 emby，你用支持 `.strm` 播放此文件时，SmartStrm 会接收请求，并 **重定向** 夸克网盘的真实下载地址。

**环境要求**（我使用的是白嫖的 aws 服务器并且安装 CasaOS，可以自己搭建别的，比如飞牛）：

- DPanel（推荐安装，小白上手快）
- Emby 媒体服务器
- openlist（只用夸克可以不用）
- Cp0204/SmartStrm 项目

## 二、统一目录与 docker-compose 模板

首先，我们需要规划好文件路径并安装 Docker 容器。

推荐使用 DPanel:

```bash
curl -sSL https://dpanel.cc/quick.sh -o quick.sh && bash quick.sh
```

**目录准备**：为了方便管理，建议统一规划目录结构。

```
/yourpath
├── smartstrm
│   ├── config
│   └── logs
└── strm  ▶ 给 Emby 和 smartstrm 同时读的目录
    └── openlist
    └── emby
        ├── config
        └── cache
```

**关键映射**：将 SmartStrm 的 `strm` 目录映射到 Emby 容器内的 `/strm` 路径。这是 Emby 读取 `.strm` 文件的关键。

### Docker Compose 模板

```yaml
version: "3"

services:
  smartstrm:
    image: cp0204/smartstrm:latest
    container_name: smartstrm
    restart: unless-stopped
    network_mode: host
    volumes:
      - ./smartstrm/config:/app/config
      - ./smartstrm/logs:/app/logs
      - ./smartstrm/strm:/strm
    environment:
      - PORT=8024
      - ADMIN_USERNAME=admin
      - ADMIN_PASSWORD=admin123
      - LICENSE=  # 购买 Pro 后填密钥

  emby:
    image: emby/embyserver:latest
    container_name: emby
    restart: unless-stopped
    ports:
      - "8096:8096"
    volumes:
      - ./emby/config:/config
      - ./emby/cache:/cache
      - ./smartstrm/strm:/strm  # 关键映射
```

网络选 host 就可以，环境变量新增三个参数分别是账户名密码以及 Pro 版本的 key。

## 三、SmartStrm 后台配置

浏览器打开 `http://IP:8024`，进入 SmartStrm 后台进行配置。

### 1. 升级 Pro（想 302 必开）

点"免费版"图标 → 开通 Pro → 回 Docker 把 LICENSE 填上 → 重启容器。

### 2. 打开 302 代理

系统设置 ▶ 302 代理：
- 服务端口：8097
- 媒体服务器地址：`http://<公网IP>:8096`

> **重要**：Emby 播放器需要通过代理端口 **8097** 访问，而不是直接访问 8096。

如果你是大内网环境可以试试虚拟组网或者是 **IPV6+DDNS**。

### 3. STRM 规则

大佬项目默认配置的就够用。

### 4. 添加夸克网盘和 openlist 存储

进入 **"存储管理" -> "添加存储"**。

**夸克**：
- 驱动：选择 **夸克**
- Cookie：登录夸克网盘后，按 `F12` 打开开发者工具，找到并复制完整的 **Cookie** 字段内容

> 引用下 openlist 的获取夸克 Cookie 的方法，一定要保护好，这东西相当于夸克的登录密码了。按 F12 打开"调试"，选中"网络"，随意在左侧选择请求，找到携带 `Cookie` 参数的就可以。

**OpenList**：
- 驱动：选择 **OpenList / alist**
- 地址：填你的 OpenList 后台地址
- Token：可在 OpenList 管理后台-设置-其他-令牌获取

## 四、生成 STRM & 入库

### 1. 生成 strm 任务

进入 **"存储浏览" -> "添加任务"**。

完成同步后，SmartStrm 会在 `/strm` 目录下生成对应的 `.strm` 文件。

### 2. 配置 Emby 媒体库

进入 Emby 后台，添加新的媒体库。

- 类型：选择 `电影` 或 `电视`
- 文件夹路径：选择容器内路径，例如 `/strm/网盘动漫`

保存并扫描媒体库，Emby 会自动识别生成的 `.strm` 文件并进行刮削。如果库为空，请检查 `.strm` 文件是否已生成，以及路径映射是否正确。

## 五、播放验证

- 秒拖进度条
- 看服务器上行 ≈ 0
- SmartStrm 日志出现 "strm 302" = 成功

为了验证 302 直链播放是否成功，请确保您的播放器（如：yamby）或客户端是通过 **代理地址** `http://宿主机IP:8097` 访问 Emby 服务器。

您可以尝试拖动进度条，如果是秒播且视频链接是 SmartStrm 的地址，观察日志是否命中，然后看上行有没有跑就行了。

## 六、Emby 联动删除

这是我认为这个软件最与众不同的一个地方，你可以直接从 emby 中删除你的 strm 文件，SmartStrm 检测到就会同步删除文件。我本来是用 jellyfin 的，被这个功能吸引转 emby 了（大佬说 jellyfin 不行）。

其实本质就是通过 **Webhook 通知** 来告知 **SmartStrm** emby 是否删除文件。

设置起来也很简单：
1. 复制系统设置里面 **Webhook 地址**
2. 打开 Emby 删除同步设置
3. 粘贴到 emby 的通知里面

按照步骤来就行，发送测试通知试下，如果成功就算完成。