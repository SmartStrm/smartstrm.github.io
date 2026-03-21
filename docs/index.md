---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "SmartStrm"
  text: "媒体库 STRM 生成工具"
  tagline: 和 Emby 优雅配合，媒体资源丝滑入库，支持 302 直链播放。
  image:
    src: /icon.svg
    alt: SmartStrm
  actions:
    - theme: brand
      text: 项目介绍
      link: guide/what-is
    - theme: alt
      text: 安装部署
      link: guide/deploy
    - theme: alt
      text: Docker Hub
      link: https://hub.docker.com/r/cp0204/smartstrm

features:
  - title: 多驱动支持
    icon: 📦
    details: 支持 OpenList、WebDAV、夸克、115、天翼、123 云盘等网络驱动。
    link: module/storage
  - title: 自动化任务
    icon: ⏰
    details: 基于 Crontab 的定时任务，支持增量生成、同步删除及本地存储监听。
    link: module/tasks
  - title: 联动触发
    icon: 🔗
    details: 配合 QAS、CloudSaver 转存即触发任务，支持 Emby 删除同步。
    link: settings/webhook
  - title: 302 直链
    icon: 🚀
    details: 一站式 Emby/Jellyfin/Plex 302 直链播放，享受最顺畅的播放体验。
    link: settings/proxy
---
