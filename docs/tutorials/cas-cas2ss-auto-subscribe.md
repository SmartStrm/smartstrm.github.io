# CAS + cas2ss + SmartStrm, 天翼云盘订阅追剧新姿势

> 原链接：https://club.fnnas.com/forum.php?mod=viewthread&tid=61826
>
> 作者：Agoni_JoWZ3（飞牛社区用户）

最近天翼云盘资源分享频道改用 .cas 文件资源分享，可愁死我了，正好，最新的 SmartStrm 支持 `.cas` 秒传文件的直链解析：

- 通过家庭共享秒传临时文件获取直链，自动清理临时文件（含回收站）
- 直链已缓存优化，有效期内二次请求将直接返回直链，而非重复秒传
- 理论上媒体库视频编码可以正常获取，和正常入库视频格式 strm 无异
- 需注意大批量入库时频繁扫视频编码，有可能会挤爆家庭云
- 为确保能顺利秒传，家庭云应留相应大小的空间

对于空间少的朋友来说，每个 cas 文件只有 200B 左右，只需留下足够的家庭空间就行了。下面介绍自动订阅追剧的方法。

## 准备工作：安装 SmartStrm

安装 SmartStrm，可以通过飞牛应用商店安装，参考 [官网](https://smartstrm.github.io/)。

安装完成后登录，挂载天翼云盘，选中需要生成的媒体文件夹，创建 STRM 任务。

在设置里将媒体文件后缀加上 `cas`：

```
系统设置 → STRM 设置 → 媒体后缀
```

点击 Webhook 选项，获取 Webhook 链接备用。

## docker-compose 部署 cas2ss + cloud189-auto-save

```yaml
services:
  cas2ss:
    image: sisheng36/cas2ss:latest
    container_name: cas2ss
    network_mode: bridge
    restart: always
    environment:
      - PROJECT_API=http://192.168.31.3:3000      # 你的CAS地址
      - API_KEY=Wrn3yv4dedVgOluw2wYmdKChAhYQ9HfP  # 你的CAS中生成的api-key
      - TARGET_WEBHOOK=http://192.168.31.3:8024/webhook/96c1d4ba7d436192  # 你的SS中的webhook地址
      - POLL_INTERVAL=5                            # 监听CAS的频率，每5s监听一次
      - STRM_TASKS=电影1,电影2,动漫1,动漫2,国产剧1,外语剧1,纪录片1,更新中1  # SS中用于生成strm的任务名，多个用","隔开
      - FILTER_STATUS=processing                   # 默认仅监听追剧中的项目，不要修改
      - TZ=Asia/Shanghai
    volumes:
      - ./cas2ss:/app/data
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  cloud189:
    image: xia1307/cloud189-auto-save:latest
    container_name: cloud189-auto-save
    network_mode: bridge
    restart: always
    ports:
      - "3000:3000"
    volumes:
      - ./data:/home/data
    environment:
      - PUID=0
      - PGID=0
```

## 配置步骤

1. **构建并启动**：`docker compose up -d`，访问 cloud189-auto-save 并登录天翼云盘
2. 将之前 SmartStrm 设置的媒体文件夹加入到常用目录，创建任务并打上五角星（自动追更标记）
3. 在系统设置中生成 API Key，保存后生效
4. 关闭 docker-compose，修改 cas2ss 的环境参数（API 地址、API Key、Webhook 等），重新构建

> **路径命名规则**：路径中包含 `电影`、`Movie` 等关键词时，发现订阅更新 30 秒后发送同步生成 strm 的消息；如果 30 秒内有新任务，发送时间将重新计算。其他路径为 120 秒。

## 使用方式

- **网页端**：直接粘贴天翼云盘分享链接生成转存任务，SmartStrm 自动生成 strm
- **Telegram Bot**：申请一个 TG Bot，在 TG 上操作，更加优雅

之后由 Emby 监控 strm 文件夹，优雅地追剧。

## 总结

天翼云盘还算良心的速度，搭配 cas 极小的空间占用，配合 SmartStrm 最新的播放时自动还原 cas 源文件并提取直链的功能（非 Pro 功能），媒体库又能进一步扩充了。因为是网盘生成的 STRM，可以搭配 SmartStrm 的 302 重定向功能（Pro 功能），支持 **Emby、Jellyfin、Plex、飞牛影视** 在外也可以追剧。
