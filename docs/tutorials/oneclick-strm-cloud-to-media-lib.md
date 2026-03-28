# 一键生成 STRM 文件，SmartStrm 让你的网盘秒变媒体库！

> 原链接：https://mp.weixin.qq.com/s/GhXHx-hqqOHoSUyJ3YnvwQ
>
> 作者：肖昶（微信公众号：纳思稻壳）

本项目大部分功能免费用，但 `CloudDrive2 文件变更通知实时触发任务` 和 `Emby Jellyfin 302 直链播放` 需要购买授权才可用。部署前查看免费功能是否满足需求。本项目需要影视软件支持 Strm。例如：绿联的影视中心，极空间的极影视，Emby，Jellyfin 等。`飞牛影视` 暂不支持。

## SmartStrm 是什么？

**SmartStrm** 是一个媒体库 STRM 文件生成工具。和 Emby 优雅配合，媒体资源丝滑入库，支持 302 直链播放，支持同步删除。配合 Quark-Auto-Save, CloudSaver, Emby 力求即存即看。

## ✨ 特性

- ⚙️ 自动生成 .strm 文件或软链接，供媒体服务器识别
- 🚀 支持 302（Pro 版本支持）直链播放，绕过本地带宽瓶颈
- 🔄 支持远程删除同步，保持本地与云端一致
- 🔔 支持 Emby API 自动刷新媒体库
- 🗂️ 支持字幕、海报、NFO 元数据自动整理
- 🌐 Web UI 管理任务，支持 Docker 一键部署

## 🐳 部署指南

### 方案一：Docker 单容器

```bash
# 一键启动（请把 admin123 改成你的密码）
docker run -d \
  --name smartstrm \
  --restart unless-stopped \
  --network host \
  -v $(pwd)/smartstrm/config:/app/config \  # 挂载配置目录
  -v $(pwd)/smartstrm/logs:/app/logs \      # 挂载日志目录，可选
  -v $(pwd)/smartstrm/strm:/strm \          # 挂载 STRM 生成目录
  -e PORT=8024 \                            # 管理端口，可选
  -e ADMIN_USERNAME=admin \                 # 管理用户名
  -e ADMIN_PASSWORD=admin123 \              # 管理用户密码
  -e LICENSE= \                             # 许可证字符串（如有）
  cp0204/smartstrm:latest
```

**参数说明**：
- `ADMIN_PASSWORD=admin123`：`admin123` 改成你的强密码
- `LICENSE`：pro 版本的许可证，有就填。没有保持不动
- `$(pwd)`：当前终端所在目录，例如现在终端在 `/home/it` 这里的 `$(pwd)` 就代表这个目录

### 方案二：Docker Compose

`docker-compose.yml` 文件：

```yaml
name: smartstrm
services:
  smartstrm:
    image: cp0204/smartstrm:latest
    container_name: smartstrm
    restart: unless-stopped
    network_mode: host
    volumes:
      - ./config:/app/config        # 挂载配置目录
      - ./logs:/app/logs            # 挂载日志目录，可选
      - ./strm:/strm                # 挂载 STRM 生成目录
    environment:
      - PORT=8024                   # 管理端口，可选
      - ADMIN_USERNAME=admin        # 管理用户名
      - ADMIN_PASSWORD=admin123     # 管理用户密码
      - LICENSE=                    # 许可证字符串（如有）
```

**参数说明**：
- `ADMIN_PASSWORD=admin123`：`admin123` 改成你的强密码
- `LICENSE`：pro 版本的许可证，有就填。没有保持不动

## 📖 使用

### 基本步骤

1. **访问管理后台**
   - 访问 `http://NASIP:8024` 打开管理后台

2. **登录**
   - 使用你设置的用户名和密码登录进入管理后台
   - 如未修改用户名和密码，默认为：`admin/admin123`

3. **添加存储**
   - 驱动支持以下服务和网盘，可以根据自己需求选择

4. **添加任务**
   - 创建任务以定时生成 STRM 文件

5. **确认生成 strm**
   - 打开部署映射的设备目录，例如：`docker 映射目录/smartstrm/strm/电影`
   - 现在就可以使用支持 strm 的播放器进行播放，无需把整个影视文件下载到本地再进行播放

### 其它功能

- **存储浏览**：可以查看网盘的内容
- **系统设置**：可以进行 `STRM 设置`、`重命名设置`、`Webhook` 等设置

## 总结

SmartStrm 支持 Emby/Jellyfin 播放、302 直链代理、任务管理、Webhook 联动等功能。它强调"即存即播"，支持增量同步、远程删除、媒体库刷新。但有些功能需要付费使用。

**如果你追求**：
- 自动化、联动性强、功能全面 → 推荐使用本项目
- 命名规范、剧集整理、手动控制 → 更推荐 OpenList-strm

---

**项目地址**：[GitHub - Cp0204/SmartStrm](https://github.com/Cp0204/SmartStrm)