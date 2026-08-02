<script setup>
// 静态长页首页：与文档站统一风格，复用 VitePress 默认导航栏与主题切换，
// 配色使用 --vp-c-* 变量自动适配日 / 夜模式。
// 保留三大核心价值（零压力 / 不等待 / 不转圈）的 SVG 原理动画，
// 去掉全屏幻灯片的锁滚动 / 转场 / 圆点导航 / 页码等装饰机制。
import { onMounted, onBeforeUnmount, ref } from 'vue'

// 返回顶部按钮显隐
const toTop = ref(false)
const onScroll = () => {
  toTop.value = window.scrollY > 400;

  // 给 VPNavBar 添加 home 类，使其应用原生透明
  const navBar = document.querySelector('.VPNavBar.top')
  if (navBar) {
    navBar.classList.add('home')
  }
  // 隐藏回顶导航栏
  const localNav = document.querySelector('.VPLocalNav.empty.fixed')
  if (localNav) {
    localNav.style.display = 'none'
  }
}
const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

// 302 流程图：滚动进入视口时为节点 SVG 注入 .in 触发首轮动画（dot/canvas 的
// infinite 动画本就自驱，这里仅做一次轻量进场效果，省去 IntersectionObserver 的删减
// 即动画始终在场，无需 JS 也可用，此处保留极简实现）。
let cleanup = () => { }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  const root = document.querySelector('.ss-home')
  if (!root) return

  // 进度条 / 卡片进场：当区块进入视口补一个 .reveal 类，触发 CSS 入场过渡。
  const revealEls = Array.from(root.querySelectorAll('[data-reveal]'))
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal')
          io.unobserve(e.target)
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 })
    revealEls.forEach((el) => io.observe(el))
    cleanup = () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  } else {
    revealEls.forEach((el) => el.classList.add('reveal'))
    cleanup = () => window.removeEventListener('scroll', onScroll)
  }
})

onBeforeUnmount(() => { cleanup(); window.removeEventListener('scroll', onScroll) })
</script>

<template>
  <div class="ss-home">
    <!-- Hero -->
    <section class="ss-section ss-hero">
      <div class="ss-inner">
        <div class="ss-hero-tag">智能 STRM 媒体库管理系统</div>
        <h1 class="ss-h1">Smart<span class="accent">Strm</span></h1>
        <div class="ss-hero-line"></div>
        <p class="ss-hero-desc">
          打通云盘与私有媒体库的<strong class="accent">最后一公里</strong><br />
          影音免下载入库 · 302 直链播放
        </p>
        <div class="ss-badge-row">
          <!-- 云盘 -->
          <div class="ss-badge-group ss-badge-cloud-group">
            <span class="ss-badge ss-badge-cloud">夸克</span>
            <span class="ss-badge ss-badge-cloud">天翼</span>
            <span class="ss-badge ss-badge-cloud">115</span>
            <span class="ss-badge ss-badge-cloud">123</span>
            <span class="ss-badge ss-badge-cloud">迅雷</span>
            <span class="ss-badge ss-badge-cloud">光鸭</span>
          </div>
          <!-- 媒体库 -->
          <div class="ss-badge-group ss-badge-server-group">
            <span class="ss-badge ss-badge-server">Emby</span>
            <span class="ss-badge ss-badge-server">Jellyfin</span>
            <span class="ss-badge ss-badge-server">Plex</span>
            <span class="ss-badge ss-badge-server">飞牛影视</span>
          </div>
        </div>
        <div class="ss-hero-btns">
          <a href="/guide/deploy" class="ss-btn">快速部署 →</a>
          <a href="/guide/what-is" class="ss-btn ss-btn-ghost">项目文档 →</a>
        </div>
      </div>
    </section>

    <!-- The Problem -->
    <section class="ss-section">
      <div class="ss-inner">
        <div class="ss-tag">痛点</div>
        <h2 class="ss-h2">硬盘<span class="danger">告急</span></h2>
        <p class="ss-sub">4K 蓝光资源让 NAS 存储捉襟见肘<br />云盘资源丰富，却无法直接在私有媒体库中使用</p>
        <div class="ss-problem-grid" data-reveal>
          <div class="ss-problem-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-danger-1)" stroke-width="1.5">
              <rect x="2" y="6" width="20" height="12" rx="3" />
              <line x1="6" y1="10" x2="6" y2="14" />
              <line x1="10" y1="10" x2="10" y2="14" />
              <line x1="14" y1="10" x2="14" y2="14" />
              <line x1="18" y1="10" x2="18" y2="14" />
            </svg>
            <h4>存储成本高</h4>
            <p>一块 2TB 硬盘动辄千元，面对不断增长的 4K 影库难以持续扩容</p>
          </div>
          <div class="ss-problem-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-danger-1)" stroke-width="1.5">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </svg>
            <h4>入库效率低</h4>
            <p>手动下载、转移、归类，一部电影从发现到入库耗时漫长</p>
          </div>
          <div class="ss-problem-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-danger-1)" stroke-width="1.5">
              <path d="M4 14a6 6 0 0 1 12 0" />
              <path d="M18 14a4 4 0 0 0-8" />
              <line x1="12" y1="18" x2="12" y2="22" />
            </svg>
            <h4>带宽有瓶颈</h4>
            <p>多端同时播放，NAS 上传带宽成为瓶颈，卡顿缓冲体验差</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 什么是 .strm -->
    <section class="ss-section">
      <div class="ss-inner">
        <div class="ss-tag">工作原理</div>
        <h2 class="ss-h2">什么是 <span class="accent">.strm</span> ?</h2>
        <p class="ss-sub">STRM 文件是一个纯文本快捷方式，告诉媒体服务器真正的视频在哪里</p>
        <div class="ss-code-editor" data-reveal>
          <div class="ss-code-titlebar">
            <span class="ss-code-dot r"></span><span class="ss-code-dot y"></span><span class="ss-code-dot g"></span>
            <span class="ss-code-filename">流浪地球3.strm</span>
          </div>
          <div class="ss-code-body">
            <div class="ss-code-line"><span class="ln">1</span><span class="ss-code-content"><span class="comment"># 我不是视频文件，我只是一个 URL 指引</span></span></div>
            <div class="ss-code-line"><span class="ln">2</span><span class="ss-code-content"><span class="url"><span class="url-proto">https://</span><span class="url-domain">cdn.115.com</span><span class="url-path">/path/direct/</span><span class="url-file">流浪地球3.mkv</span></span></span></div>
          </div>
        </div>
        <div class="ss-strm-explain" data-reveal>
          <div class="ss-explain-item">
            <h4 class="name accent-success">SmartStrm 的工作</h4>
            <p>扫描云盘目录，自动生成规范目录结构的 <span class="mono">.strm</span> 文件</p>
          </div>
          <div class="ss-explain-item">
            <h4 class="name accent-accent">媒体服务器的角色</h4>
            <p>读取 <span class="mono">.strm</span>，像普通影音文件一样入库展示</p>
          </div>
          <div class="ss-explain-item">
            <h4 class="name accent-warn">302 重定向加持</h4>
            <p>把播放地址替换为直链，播放器直接从云盘 CDN 获取视频流</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 硬盘零压力 -->
    <section class="ss-section">
      <div class="ss-inner">
        <div class="ss-tag">核心价值 · 01</div>
        <h2 class="ss-h2">硬盘<span class="accent">零压力</span></h2>
        <p class="ss-sub">不搬运视频流，只记录播放地址<br />一块小硬盘也能管理整个云盘影库</p>
        <div class="ss-sz-showcase" data-reveal>
          <div class="ss-sz-card ss-sz-source">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-danger-1)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" style="opacity:.55">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="3" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="21" />
              <line x1="3" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="21" y2="12" />
            </svg>
            <div class="sz-val">30GB</div>
            <div class="sz-lbl">蓝光原盘</div>
            <div class="sz-sub">4K HDR · 杜比全景声 · H.265</div>
            <div class="sz-lines"><span></span><span></span><span></span></div>
          </div>
          <div class="ss-sz-arrow">
            <svg width="80" height="48" viewBox="0 0 80 48" fill="none">
              <line x1="0" y1="24" x2="54" y2="24" stroke="var(--vp-c-brand-1)" stroke-width="1.5" stroke-dasharray="6 5">
                <animate attributeName="stroke-dashoffset" from="11" to="0" dur=".6s" repeatCount="indefinite" />
              </line>
              <polygon points="52,16 74,24 52,32" fill="var(--vp-c-brand-1)" opacity=".8" />
            </svg>
            <span class="ss-sz-arrow-label">生成</span>
          </div>
          <div class="ss-sz-card ss-sz-target">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.4" style="margin-bottom:.3rem">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <div class="sz-fmt">1KB</div>
            <div class="sz-sz">.strm</div>
          </div>
        </div>
        <p class="ss-stat">30,000,000 KB → 1 KB · 本地存储压力减轻 <strong class="accent-accent">3000 万倍</strong></p>
      </div>
    </section>

    <!-- 入库不等待 -->
    <section class="ss-section">
      <div class="ss-inner">
        <div class="ss-tag">核心价值 · 02</div>
        <h2 class="ss-h2">入库<span class="accent">不等待</span></h2>
        <p class="ss-sub">无需下载视频文件到本地，直接从云盘生成入库<br />对比传统下载方式：</p>
        <div class="ss-compare" data-reveal>
          <div class="ss-compare-col">
            <span class="ss-vs-label ss-vs-old">传统方式</span>
            <h3 class="ss-compare-title danger">下载 → 存盘 → 入库</h3>
            <div class="ss-timeline">
              <div class="ss-tl-row"><span class="ss-tl-label">下载视频</span>
                <div class="ss-tl-bar-track">
                  <div class="ss-tl-bar-fill slow" style="--delay:0s"></div>
                </div>
              </div>
              <div class="ss-tl-row"><span class="ss-tl-label">拷贝归档</span>
                <div class="ss-tl-bar-track">
                  <div class="ss-tl-bar-fill slow" style="--delay:3s"></div>
                </div>
              </div>
              <div class="ss-tl-row"><span class="ss-tl-label">扫描入库</span>
                <div class="ss-tl-bar-track">
                  <div class="ss-tl-bar-fill slow" style="--delay:6s"></div>
                </div>
              </div>
            </div>
            <span class="ss-tl-time danger">数小时 ~ 数天</span>
          </div>
          <div class="ss-compare-col">
            <span class="ss-vs-label ss-vs-new">SmartStrm</span>
            <h3 class="ss-compare-title success">生成 .strm → 入库</h3>
            <div class="ss-strm-demo">
              <div class="ss-sd-canvas">
                <div class="ss-sd-node ss-sd-source">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>云盘 30GB
                </div>
                <div class="ss-sd-arrow" aria-hidden="true">生成 ↓</div>
                <div class="ss-sd-node ss-sd-file">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>.strm 1KB
                </div>
                <div class="ss-sd-arrow" aria-hidden="true">.strm 入库 ↓</div>
                <div class="ss-sd-node ss-sd-emby">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>Emby 已入库
                </div>
              </div>
            </div>
            <span class="ss-tl-time success">即时完成</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 播放不转圈 -->
    <section class="ss-section">
      <div class="ss-inner">
        <div class="ss-tag">核心价值 · 03</div>
        <h2 class="ss-h2">播放<span class="success">不转圈</span></h2>
        <p class="ss-sub">切换查看 SmartStrm 代理如何改变数据流向</p>

        <div class="ss-flow-outer" data-reveal>
          <input type="radio" name="ssflow" id="ssf-trad" checked />
          <input type="radio" name="ssflow" id="ssf-smart" />

          <div class="ss-flow-tabs">
            <label for="ssf-trad" class="fl-trad">Emby 默认流程</label>
            <label for="ssf-smart" class="fl-smart">SmartStrm 代理</label>
          </div>

          <div class="ss-flow-canvas">
            <svg viewBox="258 4 644 392" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- PLAYER NODE -->
              <g>
                <rect x="360" y="330" width="200" height="46" rx="14" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-border)" stroke-width="1.2" />
                <text x="460" y="351" text-anchor="middle" fill="var(--vp-c-text-1)" font-family="var(--vp-font-family-mono)" font-size="14" font-weight="700">Player 客户端</text>
                <text x="460" y="367" text-anchor="middle" fill="var(--vp-c-text-3)" font-family="var(--vp-font-family-mono)" font-size="8">兼容官方和第三方</text>
              </g>
              <!-- CLOUD NODE -->
              <g>
                <rect x="760" y="24" width="120" height="52" rx="14" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-border)" stroke-width="1.2" />
                <text x="820" y="48" text-anchor="middle" fill="var(--vp-c-text-1)" font-family="var(--vp-font-family-mono)" font-size="14" font-weight="700">云盘</text>
                <text x="820" y="64" text-anchor="middle" fill="var(--vp-c-text-3)" font-family="var(--vp-font-family-mono)" font-size="8">CDN 直链</text>
              </g>
              <!-- EMBY NODE -->
              <g class="node-emby-wrap">
                <rect class="node-emby-body" x="480" y="195" width="120" height="46" rx="13" fill="rgba(255,77,106,.05)" stroke="rgba(255,77,106,.3)" stroke-width="1.2" />
                <text class="node-emby-title" x="540" y="215" text-anchor="middle" fill="var(--vp-c-danger-1)" font-family="var(--vp-font-family-mono)" font-size="14" font-weight="700">Emby</text>
                <text class="node-emby-sub" x="540" y="231" text-anchor="middle" fill="var(--vp-c-danger-1)" opacity=".55" font-family="var(--vp-font-family-mono)" font-size="7.5">媒体服务器</text>
              </g>
              <!-- SMARTSTRM NODE -->
              <g class="node-ss-wrap">
                <rect class="node-ss-body" x="280" y="195" width="130" height="46" rx="13" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-border)" stroke-width="1" />
                <text class="node-ss-title" x="345" y="215" text-anchor="middle" fill="var(--vp-c-text-3)" font-family="var(--vp-font-family-mono)" font-size="14" font-weight="700">SmartStrm</text>
                <text class="node-ss-sub" x="345" y="231" text-anchor="middle" fill="var(--vp-c-text-3)" font-family="var(--vp-font-family-mono)" font-size="7.5">302 代理 · 8097</text>
              </g>

              <!-- TRADITIONAL LAYER -->
              <g class="layer-trad">
                <path d="M460 330 L540 241" stroke="currentColor" stroke-width="1.4" class="dash-anim" opacity=".45" />
                <path d="M600 218 Q690 190, 760 76" stroke="currentColor" stroke-width="1.4" class="dash-anim" opacity=".45" />
                <path d="M760 76 Q690 190, 600 218" stroke="currentColor" stroke-width="3.5" opacity=".4" class="bar-pulse" />
                <path d="M540 241 L460 330" stroke="currentColor" stroke-width="3.5" opacity=".4" class="bar-pulse" />
                <path d="M410 218 L480 218" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3" opacity=".35" />
                <circle r="3" fill="currentColor" class="fdot" style="offset-path:path('M460 330 L540 241');--dur:1s;--delay:0s" />
                <circle r="3" fill="currentColor" class="fdot" style="offset-path:path('M600 218 Q690 190, 760 76');--dur:1.1s;--delay:.3s" />
                <circle r="4" fill="currentColor" class="fdot" style="offset-path:path('M760 76 Q690 190, 600 218');--dur:1.2s;--delay:.6s" />
                <circle r="4" fill="currentColor" class="fdot" style="offset-path:path('M540 241 L460 330');--dur:1s;--delay:1s" />
                <g class="step-badge s-trad" transform="translate(460,270)">
                  <circle cx="10" cy="10" r="10" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-opacity=".3" stroke-width=".7" />
                  <text x="10" y="14" text-anchor="middle" fill="currentColor" opacity=".85" font-family="var(--vp-font-family-mono)" font-size="9" font-weight="600">1</text>
                </g>
                <g class="step-badge s-trad" transform="translate(438,190)">
                  <circle cx="10" cy="10" r="10" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-opacity=".3" stroke-width=".7" />
                  <text x="10" y="14" text-anchor="middle" fill="currentColor" opacity=".85" font-family="var(--vp-font-family-mono)" font-size="9" font-weight="600">2</text>
                </g>
                <g class="step-badge s-trad" transform="translate(700,170)">
                  <circle cx="10" cy="10" r="10" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-opacity=".3" stroke-width=".7" />
                  <text x="10" y="14" text-anchor="middle" fill="currentColor" opacity=".85" font-family="var(--vp-font-family-mono)" font-size="9" font-weight="600">3</text>
                </g>
                <g class="trad-annot">
                  <rect x="659" y="200" width="130" height="26" rx="13" fill="currentColor" fill-opacity=".06" stroke="currentColor" stroke-opacity=".2" stroke-width=".7"></rect>
                  <text x="725" y="216" text-anchor="middle" fill="currentColor" opacity=".8" font-family="var(--vp-font-family-mono)" font-size="10" font-weight="600">NAS 中转视频流</text>
                </g>
              </g>

              <!-- SMARTSTRM LAYER -->
              <g class="layer-smart">
                <path d="M460 330 L345 241" stroke="currentColor" stroke-width="1.8" class="dash-anim" opacity=".55" />
                <path d="M410 218 L480 218" stroke="currentColor" stroke-width="1.4" class="dash-anim" opacity=".5" />
                <g class="glow-302">
                  <path d="M480 330 Q620 260, 760 76" stroke="currentColor" stroke-width="4.5" opacity=".45" class="direct-pulse" fill="none" />
                </g>
                <!-- 数据流向：Player ↔ Cloud 双向 -->
                <circle r="3.5" fill="currentColor" class="fdot" style="offset-path:path('M460 330 L345 241');--dur:.9s;--delay:0s" />
                <circle r="3" fill="currentColor" class="fdot" style="offset-path:path('M410 218 L480 218');--dur:.8s;--delay:.2s" />
                <circle r="5" fill="currentColor" class="fdot" style="offset-path:path('M480 330 Q620 260, 760 76');--dur:1.3s;--delay:.4s" />
                <circle r="4" fill="currentColor" opacity=".6" class="fdot" style="offset-path:path('M480 330 Q620 260, 760 76');--dur:1.3s;--delay:.9s" />
                <circle r="5" fill="currentColor" class="fdot" style="offset-path:path('M760 76 Q620 260, 480 330');--dur:1.3s;--delay:.65s" />
                <circle r="4" fill="currentColor" opacity=".6" class="fdot" style="offset-path:path('M760 76 Q620 260, 480 330');--dur:1.3s;--delay:1.15s" />
                <g class="step-badge s-smart" transform="translate(360,280)">
                  <circle cx="10" cy="10" r="10" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-opacity=".35" stroke-width=".7" />
                  <text x="10" y="14" text-anchor="middle" fill="currentColor" font-family="var(--vp-font-family-mono)" font-size="9" font-weight="600">1</text>
                </g>
                <g class="step-badge s-smart" transform="translate(438,190)">
                  <circle cx="10" cy="10" r="10" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-opacity=".35" stroke-width=".7" />
                  <text x="10" y="14" text-anchor="middle" fill="currentColor" font-family="var(--vp-font-family-mono)" font-size="9" font-weight="600">2</text>
                </g>
                <g class="step-badge s-smart" transform="translate(600,260)">
                  <circle cx="10" cy="10" r="10" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-opacity=".35" stroke-width=".7" />
                  <text x="10" y="14" text-anchor="middle" fill="currentColor" font-family="var(--vp-font-family-mono)" font-size="9" font-weight="600">3</text>
                </g>
                <g class="smart-annot">
                  <rect x="580" y="290" width="140" height="26" rx="13" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".25" stroke-width=".7"></rect>
                  <text x="650" y="306" text-anchor="middle" fill="currentColor" font-family="var(--vp-font-family-mono)" font-size="10" font-weight="600">直连网盘获取视频流</text>
                </g>
              </g>
            </svg>
          </div>

          <div class="ss-flow-legend" data-reveal>
            <div class="fl-item fl-trad">
              <div class="fl-dot" style="background:var(--vp-c-danger-1)"></div>NAS 中转视频流，受限于上行带宽
            </div>
            <div class="fl-item fl-smart">
              <div class="fl-dot" style="background:var(--ss-green)"></div>播放时直连云盘，NAS 无负担
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能周到 -->
    <section class="ss-section">
      <div class="ss-inner">
        <h2 class="ss-h2">为什么选择 <span class="accent">SmartStrm</span></h2>
        <p class="ss-sub">覆盖云盘影音接入私有媒体库的链路功能</p>
        <div class="ss-feat-grid" data-reveal>
          <div class="ss-feat-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <h4>存储管理</h4>
            <p>多驱动聚合，灵活支持夸克、天翼、115、123、迅雷、光鸭等主流网盘</p>
          </div>
          <div class="ss-feat-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h4>任务管理</h4>
            <p>灵活 Cron 定时，增量/全量生成，任务级插件实现高度自定义</p>
          </div>
          <div class="ss-feat-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <h4>存储浏览</h4>
            <p>内置文件浏览器，支持 TMDB 识别与目录批量重命名</p>
          </div>
          <div class="ss-feat-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <h4>插件管理</h4>
            <p>文件名修复、内容替换、提取视频封面等多项扩展能力</p>
          </div>
          <div class="ss-feat-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h4>Webhook 联动</h4>
            <p>转存自动触发生成任务，Emby 删除同步删除远端文件，</p>
          </div>
          <div class="ss-feat-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5">
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10" />
            </svg>
            <h4>302 直链代理</h4>
            <p>Emby / Jellyfin / Plex / 飞牛影视 302 重定向播放</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="ss-section ss-cta">
      <div class="ss-inner" style="position:relative;z-index:2">
        <div class="ss-cta-mark">
          <img src="/icon.svg" alt="SmartStrm" class="ss-cta-logo" />
        </div>
        <h2 class="ss-cta-title">开始使用</h2>
        <p class="ss-sub ss-cta-sub">Docker 一键部署 · 三分钟完成配置<br />为你的 NAS 解锁云盘影音库</p>
        <div class="ss-cta-btns">
          <a href="/guide/deploy" class="ss-btn">快速部署 →</a>
          <a href="/guide/what-is" class="ss-btn ss-btn-ghost">继续了解 →</a>
        </div>
        <p class="ss-stat ss-cta-foot">Self-Hosted · Free Generator</p>
      </div>
    </section>

    <!-- 返回顶部 -->
    <button type="button" class="ss-to-top" :class="{ show: toTop }" aria-label="返回顶部" title="返回顶部" @click="scrollTop">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  </div>
</template>

<style>
/* 静态长页：颜色与排版全部使用 VitePress 默认变量，自动适配日 / 夜模式。
   样式限定在 .ss-home 下，避免影响文档站其余页面。 */
.ss-home {
  --ss-a: var(--vp-c-brand-1);
  --ss-a2: var(--vp-c-brand-2);
  --ss-a-soft: var(--vp-c-brand-soft);
  --ss-red: var(--vp-c-danger-1);
  --ss-green: var(--vp-c-success-1);
  --ss-amber: var(--vp-c-warning-1);
  --ss-text: var(--vp-c-text-1);
  --ss-text-2: var(--vp-c-text-2);
  --ss-text-3: var(--vp-c-text-3);
  --ss-border: var(--vp-c-border);
  --ss-bg: var(--vp-c-bg-soft);
  --ss-divider: var(--vp-c-divider);
  --ss-font: var(--vp-font-family-base);
  --ss-mono: var(--vp-font-family-mono);
  font-family: var(--ss-font);
  color: var(--ss-text)
}

.ss-home * {
  margin: 0;
  padding: 0;
  box-sizing: border-box
}

.ss-home ::selection {
  background: var(--ss-a);
  color: #fff
}

.ss-home .ss-section {
  padding: clamp(3rem, 8vw, 6rem) clamp(1.2rem, 4vw, 2rem);
  border-bottom: 1px solid var(--ss-divider)
}

.ss-home .ss-section:last-child {
  border-bottom: none
}

.ss-home .ss-inner {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center
}

.ss-home .ss-tag {
  font-family: var(--ss-mono);
  font-size: clamp(.65rem, 1vw, .78rem);
  opacity: 0.5;
  color: var(--ss-a);
  letter-spacing: .08em;
  margin-bottom: .9rem
}

.ss-home .ss-h1 {
  font-size: clamp(2.8rem, 7vw, 6rem);
  font-weight: 800;
  line-height: .96;
  letter-spacing: -.045em;
  color: var(--ss-text)
}

.ss-home .ss-h1 .accent {
  background: linear-gradient(135deg, var(--ss-a), var(--ss-a2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text
}

.ss-home .ss-h2 {
  font-size: clamp(1.9rem, 4.6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -.03em;
  color: var(--ss-text);
  margin-bottom: .8rem
}

.ss-home .ss-h2 .accent {
  color: var(--ss-a)
}

.ss-home .ss-h2 .success {
  color: var(--ss-green)
}

.ss-home .ss-h2 .danger {
  color: var(--ss-red)
}

.ss-home .accent {
  color: var(--ss-a)
}

.ss-home .accent-success {
  color: var(--ss-green)
}

.ss-home .accent-accent {
  color: var(--ss-a)
}

.ss-home .accent-warn {
  color: var(--ss-amber)
}

/* ── Problem grid (The Problem) ── */
.ss-home .ss-problem-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(.8rem, 1.5vw, 1.4rem);
  max-width: 740px;
  margin: 1.5rem auto 1.2rem;
  text-align: left
}

.ss-home .ss-problem-item {
  padding: clamp(.9rem, 1.5vw, 1.3rem);
  border-radius: 14px;
  background: var(--ss-bg);
  border: 1px solid var(--ss-border);
  transition: border-color .3s
}

.ss-home .ss-problem-item:hover {
  border-color: color-mix(in srgb, var(--ss-red) 20%, transparent)
}

.ss-home .ss-problem-item h4 {
  font-size: .82rem;
  font-weight: 700;
  margin: .4rem 0 .25rem;
  color: var(--ss-text);
  line-height: 1.3;
  white-space: nowrap
}

.ss-home .ss-problem-item p {
  font-size: .72rem;
  color: var(--ss-text-2);
  line-height: 1.55
}

@media (max-width: 600px) {
  .ss-home .ss-problem-grid {
    grid-template-columns: 1fr
  }

  .ss-home .ss-problem-item h4 {
    white-space: normal
  }
}

.ss-home .ss-sub {
  font-size: clamp(.9rem, 1.4vw, 1.12rem);
  color: var(--ss-text-2);
  line-height: 1.7;
  max-width: 620px;
  margin: 0 auto
}

.ss-home .ss-btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  font-family: var(--ss-font);
  font-weight: 700;
  font-size: clamp(.88rem, 1.15vw, 1rem);
  padding: .8rem 2rem;
  background: var(--ss-a);
  color: #fff;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: transform .3s, box-shadow .3s;
  text-decoration: none
}

.ss-home .ss-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px var(--ss-a-soft)
}

.ss-home .ss-btn-ghost {
  background: transparent;
  color: var(--ss-text);
  border: 1.5px solid var(--ss-border)
}

.ss-home .ss-btn-ghost:hover {
  border-color: var(--ss-a);
  color: var(--ss-a)
}

/* ── Hero ── */
.ss-home .ss-hero {
  padding-top: clamp(4rem, 10vw, 7rem);
  padding-bottom: clamp(4rem, 10vw, 7rem)
}

.ss-home .ss-hero-tag {
  font-family: var(--ss-mono);
  font-size: clamp(.62rem, 1vw, .78rem);
  font-weight: 500;
  color: var(--ss-a);
  text-transform: uppercase;
  letter-spacing: .2em;
  margin-bottom: 1.2rem
}

.ss-home .ss-hero-line {
  width: 64px;
  height: 3px;
  background: linear-gradient(90deg, var(--ss-a), var(--ss-a2));
  margin: 1.4rem auto;
  border-radius: 2px
}

.ss-home .ss-hero-desc {
  font-size: clamp(1rem, 1.6vw, 1.24rem);
  color: var(--ss-text-2);
  line-height: 1.75;
  max-width: 540px;
  margin: 0 auto
}

.ss-home .ss-hero-desc strong {
  color: var(--ss-text)
}

.ss-home .ss-badge-row {
  display: flex;
  gap: .45rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.6rem
}

/* spacing between badge groups */
.ss-home .ss-badge-group {
  display: flex;
  gap: .15rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: .6rem;
}

@media (max-width: 600px) {
  .ss-home .ss-badge-group {
    flex-basis: 100%;
    justify-content: center;
    margin-bottom: .4rem;
  }
}

.ss-home .ss-badge {
  display: inline-block;
  font-family: var(--ss-mono);
  font-size: .64rem;
  padding: .05rem .55rem;
  border-radius: 999px
}

.ss-home .ss-badge-cloud {
  background: color-mix(in srgb, var(--ss-a) 8%, transparent);
  color: var(--ss-a);
  border: 1px solid color-mix(in srgb, var(--ss-a) 18%, transparent)
}

.ss-home .ss-badge-server {
  background: color-mix(in srgb, var(--ss-green) 8%, transparent);
  color: var(--ss-green);
  border: 1px solid color-mix(in srgb, var(--ss-green) 18%, transparent)
}

.ss-home .ss-hero-btns {
  margin-top: 2.2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap
}

/* ── Code editor ── */
.ss-home .ss-code-editor {
  background: var(--vp-c-bg-alt);
  border-radius: 14px;
  overflow: hidden;
  text-align: left;
  border: 1px solid var(--ss-border);
  margin: 1.6rem auto 1.4rem;
  max-width: 680px
}

.ss-home .ss-code-titlebar {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .55rem .9rem;
  background: var(--ss-bg);
  border-bottom: 1px solid var(--ss-divider)
}

.ss-home .ss-code-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%
}

.ss-home .ss-code-dot.r {
  background: #ff5f57
}

.ss-home .ss-code-dot.y {
  background: #febc2e
}

.ss-home .ss-code-dot.g {
  background: #28c840
}

.ss-home .ss-code-filename {
  font-family: var(--ss-mono);
  font-size: .68rem;
  font-weight: 600;
  color: var(--ss-text-2);
  margin-left: .5rem
}

.ss-home .ss-code-body {
  padding: 1.1rem 1.2rem;
  font-family: var(--ss-mono);
  font-size: clamp(.7rem, 1vw, .82rem);
  line-height: 1.7
}

.ss-home .ss-code-body .ss-code-line {
  position: relative;
  padding-left: 2rem;
  min-height: 1.7em;
  white-space: pre-wrap;
  break-inside: avoid;
  word-break: break-all;
  color: var(--ss-text-2)
}

.ss-home .ss-code-body .ss-code-line .ln {
  position: absolute;
  left: 0;
  top: 0;
  width: 1.2rem;
  text-align: right;
  color: var(--ss-text-3);
  opacity: .6;
  user-select: none
}

.ss-home .ss-code-body .ss-code-line .comment {
  color: var(--ss-text-3);
  font-style: italic
}

.ss-home .ss-code-body .url-proto {
  color: #7ee787
}

.ss-home .ss-code-body .url-domain {
  color: #d2a8ff
}

.ss-home .ss-code-body .url-path {
  color: var(--ss-a)
}

.ss-home .ss-code-body .url-file {
  color: #ffa657
}

.ss-home .ss-strm-explain {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .8rem;
  text-align: left;
  max-width: 680px;
  margin: 0 auto
}

.ss-home .ss-explain-item {
  padding: .9rem;
  border-radius: 12px;
  background: var(--ss-bg);
  border: 1px solid var(--ss-border)
}

.ss-home .ss-explain-item .name {
  font-size: .8rem;
  font-weight: 700;
  margin-bottom: .3rem
}

.ss-home .ss-explain-item p {
  font-size: .7rem;
  color: var(--ss-text-2);
  line-height: 1.55
}

.ss-home .ss-explain-item .mono {
  font-family: var(--ss-mono);
  color: var(--ss-a);
  font-size: .72rem
}

/* ── Size showcase (零压力) ── */
.ss-home .ss-sz-showcase {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  margin: 2rem 0 1rem
}

.ss-home .ss-sz-card {
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative
}

.ss-home .ss-sz-source {
  width: clamp(200px, 28vw, 320px);
  height: clamp(240px, 32vw, 360px);
  background: color-mix(in srgb, var(--ss-red) 6%, transparent);
  border: 2px solid color-mix(in srgb, var(--ss-red) 30%, transparent);
  box-shadow: 0 0 60px color-mix(in srgb, var(--ss-red) 8%, transparent);
  animation: ssPulse 3s ease-in-out infinite
}

@keyframes ssPulse {

  0%,
  100% {
    box-shadow: 0 0 60px color-mix(in srgb, var(--ss-red) 8%, transparent)
  }

  50% {
    box-shadow: 0 0 80px color-mix(in srgb, var(--ss-red) 16%, transparent)
  }
}

.ss-home .ss-sz-source .sz-val {
  font-family: var(--ss-mono);
  font-weight: 500;
  font-size: clamp(3.4rem, 7vw, 5.5rem);
  color: var(--ss-red);
  line-height: 1
}

.ss-home .ss-sz-source .sz-lbl {
  font-size: clamp(.82rem, 1.1vw, 1rem);
  color: var(--ss-text-2);
  margin-top: .5rem
}

.ss-home .ss-sz-source .sz-sub {
  font-family: var(--ss-mono);
  font-size: .68rem;
  color: var(--ss-text-3);
  margin-top: .25rem
}

.ss-home .ss-sz-source .sz-lines {
  position: absolute;
  bottom: 22px;
  left: 22px;
  right: 22px;
  display: flex;
  flex-direction: column;
  gap: 7px
}

.ss-home .ss-sz-source .sz-lines span {
  display: block;
  height: 5px;
  border-radius: 3px;
  background: var(--ss-divider)
}

.ss-home .ss-sz-source .sz-lines span:nth-child(2) {
  width: 70%
}

.ss-home .ss-sz-source .sz-lines span:nth-child(3) {
  width: 50%
}

.ss-home .ss-sz-arrow {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 48px
}

.ss-home .ss-sz-arrow svg {
  filter: drop-shadow(0 0 8px var(--ss-a-soft))
}

.ss-home .ss-sz-arrow-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: .6rem;
  white-space: nowrap;
  font-family: var(--ss-mono);
  font-size: .62rem;
  color: var(--ss-a);
  opacity: .7
}

.ss-home .ss-sz-target {
  width: clamp(80px, 14vw, 100px);
  height: clamp(120px, 16vw, 140px);
  border: 1.5px solid color-mix(in srgb, var(--ss-a) 25%, transparent);
  background: color-mix(in srgb, var(--ss-a) 4%, transparent)
}

.ss-home .ss-sz-target .sz-fmt {
  font-family: var(--ss-mono);
  font-size: clamp(1rem, 1.5vw, 1.3rem);
  font-weight: 500;
  color: var(--ss-a);
  margin-bottom: .3rem
}

.ss-home .ss-sz-target .sz-sz {
  font-family: var(--ss-mono);
  font-size: clamp(.68rem, .9vw, .8rem);
  color: var(--ss-text-2)
}

.ss-home .ss-stat {
  font-family: var(--ss-mono);
  font-size: clamp(.7rem, 1vw, .82rem);
  color: var(--ss-text-2);
  margin-top: 1.4rem;
  letter-spacing: .03em
}

.ss-home .ss-stat strong {
  color: var(--ss-a)
}

/* ── Compare (入库不等待) ── */
.ss-home .ss-compare {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: clamp(2rem, 6vw, 5rem);
  margin-top: 1.6rem
}

.ss-home .ss-compare-col {
  flex: 1;
  max-width: 380px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center
}

.ss-home .ss-vs-label {
  font-family: var(--ss-mono);
  font-size: .62rem;
  text-transform: uppercase;
  letter-spacing: .15em;
  padding: .3rem .8rem;
  border-radius: 999px;
  margin-bottom: 1.1rem;
  display: inline-block
}

.ss-home .ss-vs-old {
  background: color-mix(in srgb, var(--ss-red) 8%, transparent);
  color: var(--ss-red);
  border: 1px solid color-mix(in srgb, var(--ss-red) 20%, transparent)
}

.ss-home .ss-vs-new {
  background: color-mix(in srgb, var(--ss-green) 8%, transparent);
  color: var(--ss-green);
  border: 1px solid color-mix(in srgb, var(--ss-green) 18%, transparent)
}

.ss-home .ss-compare-title {
  font-size: .88rem;
  font-weight: 700;
  margin-bottom: .4rem
}

.ss-home .ss-compare-title.danger {
  color: var(--ss-red)
}

.ss-home .ss-compare-title.success {
  color: var(--ss-green)
}

.ss-home .ss-timeline {
  flex: 1;
  width: 100%;
  min-height: 150px;
  margin: 1rem 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: .8rem
}

.ss-home .ss-tl-row {
  display: flex;
  align-items: center;
  gap: .7rem
}

.ss-home .ss-tl-label {
  order: 1;
  flex-shrink: 0;
  font-family: var(--ss-mono);
  font-size: clamp(.58rem, .8vw, .7rem);
  color: var(--ss-text-2);
  text-align: left;
  white-space: nowrap
}

.ss-home .ss-tl-bar-track {
  order: 2;
  flex: 1;
  height: 18px;
  border-radius: 9px;
  background: var(--ss-divider);
  overflow: hidden
}

.ss-home .ss-tl-bar-fill {
  height: 100%;
  border-radius: 9px;
  width: 0;
  transition: width 3s cubic-bezier(.25, 0, .1, 1);
  transition-delay: var(--delay, 0s)
}

.ss-home [data-reveal].reveal .ss-tl-bar-fill {
  width: 100%
}

.ss-home .ss-tl-bar-fill.slow {
  background: linear-gradient(90deg, var(--ss-red), color-mix(in srgb, var(--ss-red) 70%, #000))
}

.ss-home .ss-tl-time {
  display: block;
  font-family: var(--ss-mono);
  font-size: .72rem;
  font-weight: 700;
  margin-top: auto;
  padding-top: .4rem
}

.ss-home .ss-tl-time.danger {
  color: var(--ss-red)
}

.ss-home .ss-tl-time.success {
  color: var(--ss-green)
}

.ss-home .ss-strm-demo {
  position: relative;
  flex: 1;
  width: 100%;
  margin: 1rem 0 0;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center
}

.ss-home .ss-strm-demo .ss-sd-canvas {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .35rem
}

.ss-home .ss-sd-node {
  display: flex;
  align-items: center;
  gap: .35rem;
  padding: .3rem .6rem;
  border-radius: 8px;
  font-size: clamp(.55rem, .8vw, .68rem);
  font-weight: 600;
  white-space: nowrap
}

.ss-home .ss-sd-source {
  background: color-mix(in srgb, var(--ss-red) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--ss-red) 18%, transparent);
  color: var(--ss-red)
}

.ss-home .ss-sd-file {
  background: color-mix(in srgb, var(--ss-a) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--ss-a) 22%, transparent);
  color: var(--ss-a)
}

.ss-home .ss-sd-emby {
  background: var(--ss-bg);
  border: 1px solid var(--ss-border);
  color: var(--ss-text-2)
}

.ss-home .ss-sd-arrow {
  display: flex;
  font-family: var(--ss-mono);
  font-size: clamp(.5rem, .8vw, .62rem);
  color: var(--ss-a);
  opacity: .75;
  line-height: 1
}

/* ── 302 flow ── */
.ss-home .ss-flow-outer {
  max-width: 820px;
  margin: 1.6rem auto 0;
  position: relative
}

.ss-home .ss-flow-outer>input[type=radio] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0
}

.ss-home .ss-flow-tabs {
  display: flex;
  gap: 3px;
  justify-content: center;
  margin-bottom: 1rem;
  background: var(--ss-bg);
  border-radius: 999px;
  padding: 4px;
  border: 1px solid var(--ss-border);
  width: fit-content;
  margin-left: auto;
  margin-right: auto
}

.ss-home .ss-flow-tabs label {
  font-family: var(--ss-mono);
  font-size: clamp(.6rem, .85vw, .72rem);
  font-weight: 500;
  padding: .45rem 1.3rem;
  border-radius: 999px;
  cursor: pointer;
  color: var(--ss-text-2);
  transition: all .35s;
  user-select: none;
  letter-spacing: .02em
}

.ss-home .ss-flow-tabs label:hover {
  color: var(--ss-text)
}

.ss-home #ssf-trad:checked~.ss-flow-tabs .fl-trad {
  background: color-mix(in srgb, var(--ss-red) 12%, transparent);
  color: var(--ss-red)
}

.ss-home #ssf-smart:checked~.ss-flow-tabs .fl-smart {
  background: color-mix(in srgb, var(--ss-green) 12%, transparent);
  color: var(--ss-green)
}

.ss-home .ss-flow-canvas {
  position: relative;
  width: 100%;
  aspect-ratio: 1.64/1;
  max-height: 420px;
  margin: 0 auto;
  border-radius: 16px;
  background: var(--ss-bg);
  border: 1px solid var(--ss-border);
  overflow: hidden
}

.ss-home .ss-flow-canvas svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%
}

.ss-home .layer-trad,
.ss-home .layer-smart {
  transition: opacity .55s ease
}

.ss-home .layer-trad,
.ss-home .layer-smart {
  opacity: 0
}

/* SmartStrm 302 层用品牌成功色（与“不转圈”一致的深绿，浅色模式下清晰可读） */
.ss-home .ss-flow-canvas .layer-smart {
  color: var(--ss-green)
}

/* 传统流程层用偏暗一档的红（避免浅色模式下过艳），与 danger 语义一致 */
.ss-home .ss-flow-canvas .layer-trad {
  color: var(--ss-red)
}

.ss-home #ssf-trad:checked~.ss-flow-canvas .layer-trad {
  opacity: 1
}

.ss-home #ssf-smart:checked~.ss-flow-canvas .layer-smart {
  opacity: 1
}

.ss-home #ssf-trad:checked~.ss-flow-canvas .node-ss-body,
.ss-home #ssf-trad:checked~.ss-flow-canvas .node-ss-title,
.ss-home #ssf-trad:checked~.ss-flow-canvas .node-ss-sub {
  opacity: .45
}

.ss-home #ssf-trad:checked~.ss-flow-canvas .node-emby-body {
  fill: rgba(255, 77, 106, .05);
  stroke: rgba(255, 77, 106, .3)
}

.ss-home #ssf-trad:checked~.ss-flow-canvas .node-emby-title {
  fill: var(--ss-red)
}

.ss-home #ssf-trad:checked~.ss-flow-canvas .node-emby-sub {
  fill: var(--ss-red);
  opacity: .55
}

.ss-home #ssf-smart:checked~.ss-flow-canvas .node-emby-wrap {
  opacity: .55
}

.ss-home #ssf-smart:checked~.ss-flow-canvas .node-ss-body {
  fill: color-mix(in srgb, var(--ss-green) 6%, transparent);
  stroke: color-mix(in srgb, var(--ss-green) 35%, transparent);
  stroke-width: 1.2
}

.ss-home #ssf-smart:checked~.ss-flow-canvas .node-ss-title {
  fill: var(--ss-green)
}

.ss-home #ssf-smart:checked~.ss-flow-canvas .node-ss-sub {
  fill: var(--ss-green);
  opacity: .55
}

.ss-home #ssf-smart:checked~.ss-flow-canvas .node-emby-body {
  fill: var(--ss-bg);
  stroke: var(--ss-divider);
  stroke-dasharray: 4 3
}

.ss-home #ssf-smart:checked~.ss-flow-canvas .node-emby-title,
.ss-home #ssf-smart:checked~.ss-flow-canvas .node-emby-sub {
  fill: var(--ss-text-3)
}

@keyframes dashGo {
  to {
    stroke-dashoffset: -20
  }
}

.ss-home .dash-anim {
  stroke-dasharray: 8 6;
  animation: dashGo .8s linear infinite
}

@keyframes flowDot {
  0% {
    offset-distance: 0%;
    opacity: 0
  }

  8% {
    opacity: 1
  }

  82% {
    opacity: 1
  }

  100% {
    offset-distance: 100%;
    opacity: 0
  }
}

.ss-home .fdot {
  animation: flowDot var(--dur, 1.8s) var(--ease, linear) infinite;
  animation-delay: var(--delay, 0s)
}

@keyframes barPulse {

  0%,
  100% {
    opacity: .2
  }

  50% {
    opacity: .6
  }
}

.ss-home .bar-pulse {
  animation: barPulse 1.4s ease-in-out infinite
}

@keyframes directPulse {

  0%,
  100% {
    stroke-width: 3.5;
    opacity: .3
  }

  50% {
    stroke-width: 5;
    opacity: .65
  }
}

.ss-home .direct-pulse {
  animation: directPulse 1.2s ease-in-out infinite
}

@keyframes glow302 {

  0%,
  100% {
    opacity: .6
  }

  50% {
    opacity: 1
  }
}

.ss-home .glow-302 {
  animation: glow302 2s ease-in-out infinite
}

.ss-home .ss-flow-legend {
  display: flex;
  gap: clamp(1.2rem, 3vw, 2.5rem);
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap
}

.ss-home .fl-item {
  font-family: var(--ss-mono);
  font-size: .64rem;
  display: flex;
  align-items: center;
  gap: .4rem;
  color: var(--ss-text-2)
}

.ss-home .fl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0
}

/* 图例随流程图切换：仅显示当前对应模式的一条 */
.ss-home .ss-flow-legend .fl-item {
  display: none
}

.ss-home #ssf-trad:checked~.ss-flow-legend .fl-trad {
  display: flex
}

.ss-home #ssf-smart:checked~.ss-flow-legend .fl-smart {
  display: flex
}

/* ── Feature grid ── */
.ss-home .ss-feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(.6rem, 1.2vw, 1rem);
  max-width: 820px;
  margin: 1.6rem auto 0;
  text-align: left
}

.ss-home .ss-feat-card {
  padding: clamp(.85rem, 1.5vw, 1.2rem);
  border-radius: 14px;
  background: var(--ss-bg);
  border: 1px solid var(--ss-border);
  transition: border-color .3s, transform .3s, box-shadow .3s;
  cursor: default
}

.ss-home .ss-feat-card:hover {
  border-color: color-mix(in srgb, var(--ss-a) 25%, transparent);
  transform: translateY(-3px);
  box-shadow: 0 8px 30px var(--ss-a-soft)
}

.ss-home .ss-feat-card svg {
  margin-bottom: .5rem;
  opacity: .75
}

.ss-home .ss-feat-card h4 {
  font-size: clamp(.78rem, 1.1vw, .9rem);
  font-weight: 700;
  margin-bottom: .25rem;
  color: var(--ss-text)
}

.ss-home .ss-feat-card p {
  font-size: clamp(.62rem, .9vw, .72rem);
  color: var(--ss-text-2);
  line-height: 1.55
}

/* ── CTA ── */
.ss-home .ss-cta {
  background: radial-gradient(ellipse at 50% 50%, var(--ss-a-soft), transparent 65%);
  padding-bottom: clamp(3rem, 8vw, 6rem)
}

.ss-home .ss-cta-mark {
  margin-bottom: 1.4rem;
  display: flex;
  justify-content: center
}

.ss-home .ss-cta-logo {
  width: 128px;
  height: 128px
}

.ss-home .ss-cta-title {
  font-family: var(--vp-font-family-base);
  font-weight: 700;
  font-size: clamp(1.8rem, 5vw, 3.4rem);
  line-height: 1.2;
  color: var(--ss-text);
  letter-spacing: -.02em;
  white-space: nowrap;
  margin-bottom: 1rem
}

.ss-home .ss-cta-sub {
  font-size: clamp(.9rem, 1.4vw, 1.1rem);
  line-height: 1.75;
  margin-top: 0
}

.ss-home .ss-cta-btns {
  margin-top: 1.8rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap
}

.ss-home .ss-cta-foot {
  margin-top: 1.8rem;
  opacity: .55
}

/* ── Reveal on scroll ── */
.ss-home [data-reveal] {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity .6s cubic-bezier(.16, 1, .3, 1), transform .6s cubic-bezier(.16, 1, .3, 1)
}

.ss-home [data-reveal].reveal {
  opacity: 1;
  transform: translateY(0)
}

/* ── Back to top ── */
.ss-home .ss-to-top {
  position: fixed;
  right: clamp(1rem, 3vw, 2rem);
  bottom: clamp(1rem, 3vw, 2rem);
  z-index: 60;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--ss-border);
  background: var(--vp-c-bg);
  color: var(--ss-text);
  cursor: pointer;
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, .08);
  transition: opacity .3s, transform .3s, border-color .2s, color .2s
}

.ss-home .ss-to-top.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto
}

.ss-home .ss-to-top:hover {
  color: var(--ss-a);
  border-color: var(--ss-a)
}

/* ── Responsive ── */
@media (max-width: 800px) {

  .ss-home .ss-strm-explain,
  .ss-home .ss-feat-grid {
    grid-template-columns: repeat(2, 1fr)
  }

  .ss-home .ss-sz-showcase {
    flex-direction: column;
    gap: .5rem
  }

  /* 窄屏：提取由横向箭头改为向下，label 进入正常流式排版 */
  .ss-home .ss-sz-arrow {
    flex-direction: column;
    gap: .25rem;
  }

  .ss-home .ss-sz-arrow svg {
    transform: rotate(90deg)
  }

  .ss-home .ss-sz-arrow-label {
    position: static;
    transform: none;
    margin: 0
  }

  /* 窄屏：源卡片收矮，规格行允许换行且不与底部线条重叠 */
  .ss-home .ss-sz-source {
    width: clamp(180px, 60vw, 280px);
    height: auto;
    min-height: 150px;
    padding: 1.4rem 1rem
  }

  .ss-home .ss-sz-source .sz-sub {
    white-space: normal;
    text-align: center;
    line-height: 1.4
  }

  .ss-home .ss-sz-source .sz-lines {
    display: none
  }

  .ss-home .ss-compare {
    /* flex-direction: column; */
    align-items: center
  }

  .ss-home .ss-flow-tabs {
    flex-wrap: wrap
  }
}

@media (max-width: 480px) {

  .ss-home .ss-strm-explain,
  .ss-home .ss-feat-grid {
    grid-template-columns: 1fr
  }
}

@media (prefers-reduced-motion: reduce) {
  .ss-home * {
    animation: none !important;
    transition-duration: .01ms !important
  }

  .ss-home [data-reveal] {
    opacity: 1;
    transform: none
  }
}
</style>