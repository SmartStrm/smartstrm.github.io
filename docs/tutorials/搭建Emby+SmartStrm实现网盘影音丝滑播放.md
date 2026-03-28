# 搭建Emby+SmartStrm实现网盘影音丝滑播放

> 原链接：https://mp.weixin.qq.com/s/cGc19triWkT5v_EjOvt0ig
>
> 作者：Leander（微信公众号：Leander的神秘日常）

本文在下载好媒体库内容的情况下，从零开始搭建 Emby、生成 Strm 并通过 Nginx 对 Emby 搭建反向代理方便访问。

## 安装 Emby

访问 https://emby.media/linux-server.html，然后复制对应系统版本的 deb 链接，在服务器中通过 wget 下载，然后执行：

```bash
dpkg -i emby-server-deb_4.9.3.0_amd64.deb # 版本号为 4.9.3.0 时的例子
```

会自动配置 Emby 服务，完成后访问 `IP:8096` 完成配置。

一直下一步直到配置完成即可。

## 安装 SmartStrm

### 总体思路

SmartStrm 本质是一个 Web 服务 + 任务引擎：

- **Web 管理端**：默认 **8024**（可改），用来配置存储、任务、Webhook 等。
- **生成 `.strm` 文件**：输出到你挂载的目录，之后给 Emby 读。
- **日志与配置**：建议都落盘挂载出来，否则容器一删全没。

### 0）环境配置

#### 0.1 确认系统和权限

```bash
lsb_release -a
whoami
```

#### 0.2 选一个"干净的工作目录结构"

按官方推荐的挂载结构来：config / logs / strm 分开。

```bash
sudo mkdir -p /opt/media-stack/smartstrm/{config,logs,strm}
sudo chown -R $USER:$USER /opt/media-stack
```

解释：
- `/opt` 通常用于放服务型应用
- `strm` 目录就是未来 Emby 只扫它的"索引库"（只存文本 `.strm`，很轻）
- `config/logs` 挂出来，容器删了也不丢配置/日志

### 1）安装 Docker（Ubuntu 24.04）

如果你已经装过 Docker，可以直接跳到第 2 步；否则：

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
docker version
docker compose version
```

把当前用户加入 docker 组（否则每次都要 sudo）：

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 2）写 compose 文件

在 `/opt/media-stack/smartstrm/docker-compose.yml`：

```yaml
name: smartstrm
services:
  smartstrm:
    image: cp0204/smartstrm:latest
    container_name: smartstrm
    restart: unless-stopped
    network_mode: host
    volumes:
      - /opt/media-stack/smartstrm/config:/app/config
      - /opt/media-stack/smartstrm/logs:/app/logs
      - /opt/media-stack/smartstrm/strm:/strm
    environment:
      - PORT=8024
      - ADMIN_USERNAME=admin
      - ADMIN_PASSWORD=ChangeMe_To_A_StrongPassword
```

解释：
- `network_mode: host`：容器直接用宿主机网络栈，等于服务"裸跑"在 VPS 上的 8024 端口
- `volumes`：严格对齐官方挂载路径 `/app/config` `/app/logs` `/strm`
- `PORT/ADMIN_USERNAME/ADMIN_PASSWORD`：官方明确支持的环境变量

### 3）启动 SmartStrm

```bash
cd /opt/media-stack/smartstrm
docker compose up -d
docker ps
docker logs -n 80 smartstrm
```

### 4）连上 Web 管理端并完成"首次登录"

浏览器打开 `http://你的VPS公网IP:8024`，用你在 compose 里写的 `ADMIN_USERNAME / ADMIN_PASSWORD` 登录。

> **管理端口 8024 不建议长期裸露在公网**

### 5）更新策略（官方给的"一键更新"）

SmartStrm README 里推荐用 watchtower 对指定容器做更新：

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower -cR smartstrm
```

## 配置存储+生成 Strm

### 准备工作

使用 123 云盘的 OpenAPI 需要购买开发者权益包 20 元一个月。

开发者权益包开通后会把 `client_id` 和 `client secret` 以站内信形式发送给我们，妥善保存，后面会用到。

另外，想要 302 就 **必须购买 SmartStrm Pro**，但是价格明显不是很高，支持一下开发者我觉得也是理所应当。

购买以后许可证会自动发送到你的邮箱里，然后在 **系统设置** → **关于** 填入许可证即可。

### 创建存储

打开 **SmartStrm**，创建存储，驱动选 123 开放平台。

把之前收到的 `client_id` 和 `client secret` 输入。

### 打开 302 代理

这个功能命名上有点谜语人，经过查阅该项目的 `README.md` 发现这就是一个直链访问的功能。

### 生成 strm

进入 **存储浏览** → **添加任务**，扫描路径输入云盘路径即可。

> 非常建议每个目录都创建，即使 SmartStrm 会自动扫描并生成子目录内的文件 strm，单线程速度也太慢了，我正创建多个任务以尝试多线程工作。

另外，如果在任务页面点击编辑并修改任务名和路径，它就会自动创建一个新任务，可以用这个方法创建一些设置相似的任务。

可以稍等一会生成完毕再添加 Emby 扫库。

## 配置媒体库

因为我们用的是 strm 中转，所以扫库非常快，飞一般的速度。

## 在 Infuse 上播放

### 通过 Emby Connect 账号添加

在 https://emby.media/community/index.php?/register/ 注册账号。

### 通过服务器信息添加

需要注意的是，地址前面还要加上协议，例如 `http://IP:8097`。

## 播放检查 302 功能

内容没问题，直接播放看看。进度条可以随便拖，同时服务器上行不大，就说明 302 可以正常访问了。

折腾了半个多月终于弄好了。。。完结撒花！

网页版支持调用播放器播放。

## 为 Emby 做反向代理方便访问，并通过 UFW 阻止 8096、8097 端口访问

### 配置计划

```
IP:8097 --> emby.mydomain.com
```

### 配置 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name emby.mydomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name emby.mydomain.com;

    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    client_max_body_size 20G;

    location / {
        proxy_pass http://127.0.0.1:8097;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_buffering off;
    }
}
```

检查配置文件语法正确性并重启 Nginx：

```bash
nginx -t
systemctl reload nginx
```

### 配置 DNS 解析

域名解析托管交由 Cloudflare，其他平台配置方法类似。

### 通过 ufw 屏蔽外部直接通过端口访问

```bash
ufw enable
ufw allow 22
ufw allow 443
ufw allow 8024
ufw deny 8096
ufw deny 8097
```

以此类推，按照自己的需求设置即可，allow 是允许，deny 是拒绝。