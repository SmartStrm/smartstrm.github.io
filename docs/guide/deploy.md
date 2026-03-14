# 安装部署

SmartStrm 主要通过 Docker 镜像分发，支持 Linux 与所有常见的 NAS 系统（群晖、fnOS、Unraid、绿联、极空间等）。

## 部署命令

推荐使用 Compose 部署方式，方便后续更新与路径管理。

::: code-group

```yaml{9-11,15-16} [docker-compose.yaml]
name: smartstrm
services:
  smartstrm:
    image: cp0204/smartstrm:latest
    container_name: smartstrm
    restart: unless-stopped
    network_mode: host
    volumes:
      - /yourpath/smartstrm/config:/app/config # 挂载配置目录
      - /yourpath/smartstrm/logs:/app/logs # 挂载日志目录，可选
      - /yourpath/smartstrm/strm:/strm # 挂载 STRM 生成目录
      # 以上 /yourpath 改为你实际存放配置的路径
    environment:
      - PORT=8024 # 管理端口，可选
      - ADMIN_USERNAME=admin # 管理用户名
      - ADMIN_PASSWORD=admin123 # 管理用户密码
```

```bash{5-7,10-11} [docker run]
docker run -d \
  --name smartstrm \
  --restart unless-stopped \
  --network host \
  -v /yourpath/smartstrm/config:/app/config \  # 挂载配置目录
  -v /yourpath/smartstrm/logs:/app/logs \  # 挂载日志目录，可选
  -v /yourpath/smartstrm/strm:/strm \  # 挂载 STRM 生成目录
  # 以上 /yourpath 改为你实际存放配置的路径
  -e PORT=8024 \  # 管理端口，可选
  -e ADMIN_USERNAME=admin \  # 管理用户名
  -e ADMIN_PASSWORD=admin123 \  # 管理用户密码
  cp0204/smartstrm:latest
```

:::

> [!TIP] 部署建议
>
> 你应该留意以上**着重标记的行**，修改为你自己的配置。
>
> 网络模式建议按默认 `host` ，以便于在容器内自定义修改 302 代理端口。
>
> **如果将 `8024` 端口暴露在公网，请务必修改默认的管理用户名和密码，同时建议配置安全入口。**

部署完成后，通过 `http://yourip:8024` 访问管理后台。

## 更新命令

```bash
# smartstrm 容器一键更新命令
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower -cR smartstrm
```

## 环境变量

| 变量名              | 默认值     | 描述             |
| ------------------- | ---------- | ---------------- |
| `PORT`              | `8024`     | 管理端口         |
| `ADMIN_USERNAME`    | `admin`    | 管理用户名       |
| `ADMIN_PASSWORD`    | `admin123` | 管理用户密码     |
| `MAINLOG_MAX_DAYS`  | `7`        | 容器日志保存天数 |
| `TASKLOG_MAX_LINES` | `1000`     | 任务日志保存行数 |
| `ENABLE_IPV6`       | `true`     | 启用 IPv6 支持   |
| `LOGIN_ENTRY`       | `login`    | 安全登录入口     |

## 其他版本

### 飞牛应用

SmartStrm 已上架 fnOS，你可以在直接在应用中心搜索安装。

#### 应用数据

应用数据默认存放在 `应用文件/SmartStrm` 中，等同于： `/安装存储空间/@appshare/SmartStrm` ，卸载应用不会自动删除数据。

你可以在安装向导或中心的“应用设置”中修改 `STRM保存目录` 的路径，并赋予读写权限。

#### 应用更新

由于飞牛审核上架周期较长，通常会比 Docker 镜像滞后 1~2 个版本。你可以通过此脚本替换核心程序进行更新：

```bash
# 飞牛应用更新 SmartStrm 核心程序脚本
bash <(sudo wget -qO- https://wget.la/https://github.com/Cp0204/SmartStrm/raw/refs/heads/main/tools/fnos_update_smartstrm.sh)
```

你也可以在 [Releases](https://github.com/Cp0204/SmartStrm/releases) 下载最新 fpk 手动安装（需先卸载再重装）。
