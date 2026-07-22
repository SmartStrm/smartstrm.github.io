# 使用 SmartStrm + Thunder-MT，普通白金会员（VIP）也可以在家流畅看高码率电影

> 原链接：https://club.fnnas.com/forum.php?mod=viewthread&tid=67721
>
> 作者：Agoni_JoWZ3（飞牛社区用户）

自从有了 AI，作为一个不会编程的伸手党，我的很多想法也可以得到实现。

———— *“天才程序员”的诞生*

在最新的 **SmartStrm** 更新中，SS 支持挂载 **迅雷云盘** 了，挂载选项有原画优先/速度优先可以选择，但是速度优先的情况下，画质被压缩的有点厉害，原画的话，因为迅雷云盘非 SVIP 单线程下载仅支持 3M/s，高于 24Mbps 码率的电影/电视剧播放起来很卡。通过高强度冲浪，我在 https://linux.do/t/topic/120270 找到了解决问题的方法。在 AI 的辅助下构建了“**Thunder-MT**”这个项目，他的作用是将 SS 获取的直链通过多线程缓存后再发送到播放端，达到流畅播放的作用。所以这个项目 **只能用于你部署的服务器在本地**，或者你的服务器 **上行带宽足够大** 的情况下才可以很好的运行。

安装 SS，飞牛用户直接在应用商店就可以下载安装，简单无脑。

通过 docker-compose 部署 **Thunder-MT**：

```yaml
services:
  thunder-mt:
    container_name: thunder-mt
    image: ghcr.io/sisheng36/thunder-mt:latest
    network_mode: host
    # host 网络模式下 ports 无效，服务直接监听宿主机 8010
    environment:
      - TZ=Asia/Shanghai
      - TRUNK=120M       # 单次 Range 返回量 / 缓冲窗口（最大缓存）
      - SPLIT=3M         # 并行下载分块大小
      - FIRST_CHUNK=2M   # 无 Range 请求首块大小(优化起播速度)
      - CONNS=3          # 并行 goroutine 数（线程）
      - HOST=0.0.0.0
      - PORT=8010
      - HEADERS={}       # 请求直链时附加的 HTTP 头，JSON 格式
      - ALLOW_HOSTS=127.0.0.1  # 允许代理的目标 host 白名单(逗号分隔),留空则不限
    volumes:
      - ./data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8010/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: 3m
```

部署完成后，在 SS 的储存管理中，修改迅雷云盘为 *原画优先*，在任务管理中，选择迅雷云盘的任务，点击任务管理“**编辑任务**”界面的“**插件**”（**不要** 直接点击“插件管理——STRM 内容替换”进行修改，这是全局应用插件，你挂载的其他储存会受到波及），打开“STRM 内容替换”，并修改其中的配置，为原有的 strm 链接之前加入新的请求头 `http://127.0.0.1:8010/stream?url=`，具体设置应考虑到你自己的设置，SS 是 hosts 模式或是通过应用商店安装的才可以填 127.0.0.1，不能直接照抄。

![STRM 内容替换配置](https://club.fnnas.com/data/attachment/forum/202607/15/101214iemgemtto7j7j3yg.png)

项目已经对神医、MediaInfoKepeer 插件的媒体信息提取做了优化，提取媒体信息时不会拉起多线程缓存。服务 http://ip:8010，可以看到最近通过此项目缓存加速的统计。此项目仅用于交流和学习。

## 后记

昨日忽然听闻 GLM 大幅封禁中转站，我在用的中转站也下架了 GLM 的模型，真是唏嘘不已（以后只好用 GPT 老爷爷修炼焚决）。

———— *陨落的天才*
