/* ============================================
   renderer.js — Canvas 渲染引擎
   粒子体系：sparkle / firefly / glowbug / rain / snow
             petal / leaf / dandelion / sea-sparkle
             meteor / mist
   ============================================ */

// ── 可调参数 ──────────────────────────────
const FADE_DURATION = 800;  // 场景切换淡入淡出时长（ms）

// ── 内部状态 ──────────────────────────────
let canvas, ctx;
let currentScene = null;
let particles = [];
let bgImage = null;         // 当前底图 Image 对象
let nextBgImage = null;     // 切换中的下一张底图
let bgOpacity = 1;          // 当前底图透明度
let nextBgOpacity = 0;      // 下一张底图透明度
let isFading = false;
let fadeStartTime = 0;
let animFrameId = null;
let lastTime = 0;

// ── 公开 API ──────────────────────────────

/**
 * 初始化渲染器
 * @param {HTMLCanvasElement} canvasEl
 */
export function init(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
  resize();
  // 启动动画循环
  lastTime = performance.now();
  loop(lastTime);
}

/**
 * 窗口大小变化时调用，重新适配 Canvas 尺寸
 */
export function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  // 设置 Canvas 缓冲区大小 = 显示大小（1x 分辨率，像素风友好）
  canvas.width = w;
  canvas.height = h;
}

/**
 * 切换场景
 * @param {Object} scene - 来自 scene.js 的场景配置对象
 */
export function setScene(scene) {
  if (!scene) return;

  // 如果是同一个场景，不重复切换
  if (currentScene && currentScene.id === scene.id && !isFading) return;

  currentScene = scene;

  // 加载新底图
  const img = new Image();
  img.src = scene.background;
  img.onload = () => {
    // 启动底图淡入淡出
    nextBgImage = img;
    nextBgOpacity = 0;
    isFading = true;
    fadeStartTime = performance.now();
  };
  img.onerror = () => {
    console.warn('底图加载失败：' + scene.background);
    // 即使加载失败也更新粒子
    respawnParticles();
  };

  // 立刻更新粒子（不等图片加载）
  respawnParticles();
}

// ── 动画循环 ──────────────────────────────

function loop(timestamp) {
  animFrameId = requestAnimationFrame(loop);

  const dt = Math.min(timestamp - lastTime, 50); // 防止切后台后 dt 过大
  lastTime = timestamp;

  update(timestamp, dt);
  draw();
}

function update(timestamp, dt) {
  // 处理底图淡入淡出
  if (isFading) {
    const elapsed = timestamp - fadeStartTime;
    const progress = Math.min(elapsed / FADE_DURATION, 1);
    // easeInOutQuad — 先慢后快再慢
    const t = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    bgOpacity = 1 - t;
    nextBgOpacity = t;

    if (progress >= 1) {
      // 淡入淡出完成，交换
      bgImage = nextBgImage;
      bgOpacity = 1;
      nextBgImage = null;
      nextBgOpacity = 0;
      isFading = false;
    }
  }

  // 更新粒子位置
  const scene = currentScene;
  if (!scene) return;

  for (const p of particles) {
    if (p.type === 'rain') {
      // 雨滴：快速下落 + 轻微斜飘
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      if (p.y > canvas.height + 10) {
        p.y = -10 - Math.random() * 60;
        p.x = Math.random() * (canvas.width + 40) - 20;
      }
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.x < -20) p.x = canvas.width + 20;
    } else if (p.type === 'meteor') {
      // 流星：45° 向左下快速划过
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.age += dt / 1000;
      // 生命周期结束或飞出屏幕 → 随机间隔后重生
      if (p.age > p.life || p.x < -60 || p.y > canvas.height + 60) {
        p.x = canvas.width * 0.45 + Math.random() * canvas.width * 0.6;
        p.y = Math.random() * canvas.height * 0.3;
        p.age = 0;
        p.life = 0.6 + Math.random() * 1.2;
      }
    } else if (p.type === 'snow' || p.type === 'petal' || p.type === 'leaf') {
      // 飘落类粒子：缓慢下落 + 水平飘摇
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.phase = (p.phase + p.phaseSpeed * (dt / 16)) % (Math.PI * 2);
      // 飘落类额外：正弦摆动
      p.sway = Math.sin(p.phase) * p.swayAmp;
      if (p.y > canvas.height + 30) {
        p.y = -30;
        p.x = Math.random() * (canvas.width + 60) - 30;
      }
      if (p.x > canvas.width + 40) p.x = -40;
      if (p.x < -40) p.x = canvas.width + 40;
    } else if (p.type === 'sea-sparkle') {
      // 海面光点：微小浮动 + 闪烁，保持在画面下半
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.phase = (p.phase + p.phaseSpeed * (dt / 16)) % (Math.PI * 2);
      // 超出下半海面区域 → 重新生成
      if (p.y < canvas.height * 0.35 || p.y > canvas.height + 20 || p.x < -20 || p.x > canvas.width + 20) {
        p.y = canvas.height * 0.42 + Math.random() * canvas.height * 0.58;
        p.x = Math.random() * canvas.width;
      }
    } else if (p.type === 'mist') {
      // 雾气：缓慢飘移 + 边界回绕
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.phase = (p.phase + p.phaseSpeed * (dt / 16)) % (Math.PI * 2);
      if (p.x < -p.radius) p.x = canvas.width + p.radius;
      if (p.x > canvas.width + p.radius) p.x = -p.radius;
      if (p.y < -p.radius) p.y = canvas.height + p.radius;
      if (p.y > canvas.height + p.radius) p.y = -p.radius;
    } else if (p.type === 'glowbug') {
      // 萤火虫：极慢浮动 + 边界回绕
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.phase = (p.phase + p.phaseSpeed * (dt / 16)) % (Math.PI * 2);
      p.glowPhase = (p.glowPhase + p.glowSpeed * (dt / 16)) % (Math.PI * 2);
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;
    } else if (p.type === 'dandelion') {
      // 蒲公英：左→右飘飞 + 正弦摇摆
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.phase = (p.phase + p.phaseSpeed * (dt / 16)) % (Math.PI * 2);
      p.sway = Math.sin(p.phase) * p.swayAmp;
      p.rotation += p.rotSpeed * (dt / 16);
      // 飞过右边界 → 从左边界重新出现
      if (p.x > canvas.width + 40) {
        p.x = -40;
        p.y = Math.random() * canvas.height;
      }
      if (p.y > canvas.height + 30) p.y = -30;
      if (p.y < -30) p.y = canvas.height + 30;
    } else {
      // 光点 / 萤火虫：漂浮运动
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.phase = (p.phase + p.phaseSpeed * (dt / 16)) % (Math.PI * 2);

      // 边界回绕
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 主界面模式：不画底图，Canvas 透明，露出底下视频
  const isDialog = currentScene && currentScene.id === 'dialog';
  if (isDialog) return;  // 清空后直接返回，视频透出

  // 画当前底图（cover 模式填充）
  drawBgImage(bgImage, bgOpacity);

  // 画正在淡入的下一张底图
  if (isFading && nextBgImage) {
    drawBgImage(nextBgImage, nextBgOpacity);
  }

  // 画粒子
  for (const p of particles) {
    drawParticle(p);
  }
}

/**
 * 按 object-fit: cover 方式绘制底图
 */
function drawBgImage(img, opacity) {
  if (!img || opacity <= 0) return;

  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;

  if (iw === 0 || ih === 0) return;

  const imgRatio = iw / ih;
  const canvasRatio = cw / ch;

  let sx, sy, sw, sh;

  if (imgRatio > canvasRatio) {
    // 图片比屏幕宽 → 高度撑满，左右裁剪
    sh = ih;
    sw = ih * canvasRatio;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    // 图片比屏幕窄 → 宽度撑满，上下裁剪
    sw = iw;
    sh = iw / canvasRatio;
    sx = 0;
    sy = (ih - sh) / 2;
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  // 关闭平滑渲染，保留像素风锐利边缘
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  ctx.restore();
}

// ── 粒子系统 ──────────────────────────────

/**
 * 根据当前场景重新生成粒子
 */
function respawnParticles() {
  particles = [];
  const scene = currentScene;
  if (!scene || !scene.particle) return;  // 主界面等无粒子场景

  const cfg = scene.particle;
  for (let i = 0; i < cfg.count; i++) {
    particles.push(createParticle(cfg));
  }
}

/**
 * 创建一个粒子
 */
function createParticle(cfg) {
  if (cfg.type === 'rain') {
    return {
      x: Math.random() * (canvas.width + 40) - 20,
      y: Math.random() * canvas.height - canvas.height,
      vx: cfg.speed * (-0.3 + Math.random() * 0.6),
      vy: cfg.speed * (0.7 + Math.random() * 0.6),
      length: 6 + Math.random() * 14,
      width: 0.6 + Math.random() * 1.0,
      color: cfg.color,
      type: 'rain',
    };
  }

  if (cfg.type === 'snow') {
    const speed = cfg.speed * (0.5 + Math.random() * 1.0);
    return {
      x: Math.random() * (canvas.width + 60) - 30,
      y: Math.random() * canvas.height - canvas.height,
      vx: speed * (-0.6 + Math.random() * 1.2),
      vy: speed * (0.4 + Math.random() * 0.6),
      radius: 1.5 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.01 + Math.random() * 0.03,
      swayAmp: 0,
      color: cfg.color,
      type: 'snow',
    };
  }

  if (cfg.type === 'petal') {
    // 花瓣：像素小方块，缓慢飘落 + 左右摇摆
    const speed = cfg.speed * (0.5 + Math.random() * 1.0);
    return {
      x: Math.random() * (canvas.width + 60) - 30,
      y: Math.random() * canvas.height - canvas.height,
      vx: speed * (-0.5 + Math.random() * 1.0),
      vy: speed * (0.3 + Math.random() * 0.5),
      size: 2.2 + Math.random() * 3.3,              // 花瓣大小 +10%
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.015 + Math.random() * 0.04,
      swayAmp: 1.5 + Math.random() * 2.5,         // 水平摇摆幅度
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,     // 缓慢自转
      color: cfg.color,
      type: 'petal',
    };
  }

  if (cfg.type === 'leaf') {
    // 落叶：像素菱形/椭圆，飘落 + 摇摆 + 旋转
    const speed = cfg.speed * (0.5 + Math.random() * 1.0);
    const colors = cfg.colors || [cfg.color];
    return {
      x: Math.random() * (canvas.width + 60) - 30,
      y: Math.random() * canvas.height - canvas.height,
      vx: speed * (-0.8 + Math.random() * 1.6),
      vy: speed * (0.3 + Math.random() * 0.6),
      size: 3.3 + Math.random() * 4.4,              // 落叶 +10%
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.02 + Math.random() * 0.05,
      swayAmp: 2 + Math.random() * 3,             // 摇摆更大
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],  // 多色随机
      type: 'leaf',
    };
  }

  // ── 海面闪烁光点 ──────────────────────
  if (cfg.type === 'sea-sparkle') {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height * 0.42 + Math.random() * canvas.height * 0.58,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.12),
      radius: 1 + Math.random() * 2.5,
      elongation: 1.8 + Math.random() * 3.5,  // 水平拉伸
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.04 + Math.random() * 0.1, // 快速闪烁
      color: cfg.color,
      type: 'sea-sparkle',
    };
  }

  // ── 流星 ──────────────────────────────
  if (cfg.type === 'meteor') {
    const spd = cfg.speed;
    return {
      x: canvas.width * 0.45 + Math.random() * canvas.width * 0.6,
      y: Math.random() * canvas.height * 0.35,
      vx: -spd * 0.88,
      vy: spd * 0.88,
      length: 35 + Math.random() * 55,
      width: 1.2 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0,
      color: cfg.color,
      type: 'meteor',
      life: 0.6 + Math.random() * 1.2,
      age: Math.random() * 1.5,  // 错开初始出现时间
    };
  }

  // ── 雾气 ──────────────────────────────
  if (cfg.type === 'mist') {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0.2 + Math.random() * 0.5,               // 左→右定向飘移
      vy: (Math.random() - 0.5) * 0.15,             // 轻微上下浮动
      radius: 25 + Math.random() * 80,               // 雾团大小差异更大
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.004 + Math.random() * 0.022,
      color: cfg.color,
      type: 'mist',
      opacityBase: 0.03 + Math.random() * 0.22,      // 浓淡对比更强
    };
  }

  // ── 萤火虫（固定光点，忽明忽暗） ────
  if (cfg.type === 'glowbug') {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,            // 几乎不动
      vy: (Math.random() - 0.5) * 0.1,
      radius: 1 + Math.random() * 1.75,             // 缩小 50%
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.03 + Math.random() * 0.07,
      glowPhase: Math.random() * Math.PI * 2,
      glowSpeed: 0.02 + Math.random() * 0.05,
      color: cfg.color,
      type: 'glowbug',
    };
  }

  // ── 蒲公英（白色绒羽飘飞） ──────────
  if (cfg.type === 'dandelion') {
    const speed = cfg.speed * (0.4 + Math.random() * 1.0);
    return {
      x: Math.random() * canvas.width - canvas.width * 0.3,
      y: Math.random() * canvas.height,
      vx: speed * (0.6 + Math.random() * 0.6),      // 左→右飘
      vy: speed * (Math.random() - 0.5) * 0.6,       // 轻微上下
      size: 2.5 + Math.random() * 4,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.01 + Math.random() * 0.03,
      swayAmp: 1 + Math.random() * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      color: cfg.color,
      type: 'dandelion',
    };
  }

  // 光点 / 萤火虫
  const angle = Math.random() * Math.PI * 2;
  const speed = cfg.speed * (0.4 + Math.random() * 1.2);

  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: Math.cos(angle) * speed * 0.4,
    vy: -Math.abs(Math.sin(angle)) * speed - 0.1,
    radius: cfg.type === 'firefly'
      ? 1.5 + Math.random() * 2.5
      : 1 + Math.random() * 2,
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: cfg.type === 'firefly'
      ? 0.02 + Math.random() * 0.06
      : 0.03 + Math.random() * 0.04,
    color: cfg.color,
    type: cfg.type,
  };
}

/**
 * 绘制单个粒子
 */
function drawParticle(p) {
  if (p.type === 'rain')        { drawRainParticle(p); return; }
  if (p.type === 'snow')        { drawSnowParticle(p); return; }
  if (p.type === 'petal')       { drawPetalParticle(p); return; }
  if (p.type === 'leaf')        { drawLeafParticle(p); return; }
  if (p.type === 'sea-sparkle') { drawSeaSparkleParticle(p); return; }
  if (p.type === 'meteor')      { drawMeteorParticle(p); return; }
  if (p.type === 'mist')        { drawMistParticle(p); return; }
  if (p.type === 'glowbug')     { drawGlowbugParticle(p); return; }
  if (p.type === 'dandelion')   { drawDandelionParticle(p); return; }
  drawGlowParticle(p);
}

/**
 * 雨滴粒子：半透明竖线 + 微光
 */
function drawRainParticle(p) {
  ctx.save();
  ctx.globalAlpha = 0.25 + Math.random() * 0.25; // 随机透明度模拟雨幕层次
  ctx.strokeStyle = p.color;
  ctx.lineWidth = p.width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x - p.vx * 3, p.y + p.length); // 倾斜方向与风向一致
  ctx.stroke();
  ctx.restore();
}

/**
 * 花瓣粒子：椭圆花瓣形 + 高光，飘落 + 摇摆 + 旋转
 */
function drawPetalParticle(p) {
  ctx.save();
  ctx.translate(p.x + p.sway, p.y);
  ctx.rotate(p.rotation);
  const alpha = 0.55 + 0.45 * ((Math.sin(p.phase * 1.5) + 1) / 2);
  ctx.imageSmoothingEnabled = false;
  const s = p.size;

  // 花瓣主体：纵向椭圆
  ctx.globalAlpha = alpha;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.45, s * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  // 中心高光：更小更亮的椭圆
  ctx.globalAlpha = alpha * 0.55;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, -s * 0.08, s * 0.2, s * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 雪花粒子：六角冰晶感，带微光晕
 */
function drawSnowParticle(p) {
  ctx.save();
  const alpha = 0.5 + 0.5 * ((Math.sin(p.phase) + 1) / 2);
  const r = p.radius;
  const x = p.x;
  const y = p.y;

  // 外层柔光晕
  const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
  glowGrad.addColorStop(0, p.color);
  glowGrad.addColorStop(1, 'transparent');
  ctx.globalAlpha = alpha * 0.35;
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 六角冰晶臂
  ctx.globalAlpha = alpha * 0.7;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.5;
  ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + p.phase * 0.3;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * r * 0.3, y + Math.sin(angle) * r * 0.3);
    ctx.lineTo(x + Math.cos(angle) * r * 1.6, y + Math.sin(angle) * r * 1.6);
    ctx.stroke();
  }

  // 冰晶核心
  ctx.globalAlpha = alpha;
  const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 0.8);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(1, p.color);
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 落叶粒子：像素菱形，飘落 + 摇摆 + 旋转
 */
function drawLeafParticle(p) {
  ctx.save();
  ctx.translate(p.x + p.sway, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = 0.55 + 0.45 * ((Math.sin(p.phase * 1.3) + 1) / 2);
  ctx.fillStyle = p.color;
  ctx.imageSmoothingEnabled = false;
  // 菱形落叶
  const s = p.size;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.5, 0);
  ctx.lineTo(0, s * 0.6);
  ctx.lineTo(-s * 0.5, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * 海面反光粒子：水平拉伸的闪烁光点，模拟水面波光粼粼
 */
function drawSeaSparkleParticle(p) {
  ctx.save();

  // 快速闪烁：利用 phase 产生 0-1 脉冲
  const twinkle = 0.25 + 0.75 * ((Math.sin(p.phase * 1.8) + 1) / 2);
  const alpha = twinkle * 0.5;

  // 外层光晕（水平拉伸）
  const glowRX = p.radius * p.elongation;
  const glowRY = p.radius * 1.2;
  ctx.globalAlpha = alpha * 0.35;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, glowRX, glowRY, 0, 0, Math.PI * 2);
  ctx.fill();

  // 核心亮点
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, p.radius * 0.7, p.radius * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 流星粒子：向左下方 45° 的明亮拖尾
 */
function drawMeteorParticle(p) {
  if (p.age > p.life) return;

  // 生命进度 0→1，后期渐隐
  const progress = p.age / p.life;
  const fade = progress < 0.3
    ? progress / 0.3
    : 1 - (progress - 0.3) / 0.7;

  ctx.save();
  ctx.globalAlpha = fade;

  // 拖尾方向：反方向（右上）
  const tailX = p.x - p.vx * 1.2;
  const tailY = p.y - p.vy * 1.2;

  // 外层光晕（粗而淡）
  const gradient = ctx.createLinearGradient(p.x, p.y, tailX, tailY);
  gradient.addColorStop(0, p.color);
  gradient.addColorStop(1, 'transparent');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = p.width * 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(tailX - p.vx * p.length * 0.15, tailY - p.vy * p.length * 0.15);
  ctx.stroke();

  // 核心轨迹（细而亮）
  const core = ctx.createLinearGradient(p.x, p.y, tailX, tailY);
  core.addColorStop(0, '#ffffff');
  core.addColorStop(0.6, p.color);
  core.addColorStop(1, 'transparent');
  ctx.strokeStyle = core;
  ctx.lineWidth = p.width;
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(tailX - p.vx * p.length * 0.1, tailY - p.vy * p.length * 0.1);
  ctx.stroke();

  // 头部亮点
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.width * 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 雾气粒子：大尺寸半透明柔和雾团，浓淡变化
 */
function drawMistParticle(p) {
  ctx.save();

  // 浓淡变化
  const opacityVar = 0.5 + 0.5 * Math.sin(p.phase);
  const alpha = p.opacityBase * (0.6 + 0.4 * opacityVar);

  // 大尺寸径向渐变雾团
  const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
  gradient.addColorStop(0, p.color);
  gradient.addColorStop(0.4, p.color);
  gradient.addColorStop(1, 'transparent');

  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 光点 / 萤火虫 / 雪花粒子：发光圆
 */
function drawGlowParticle(p) {
  ctx.save();

  const opacityBase = 0.4 + 0.6 * ((Math.sin(p.phase) + 1) / 2);

  // 外层光晕（大而淡）
  const glowRadius = p.radius * 3;
  const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
  glow.addColorStop(0, p.color);
  glow.addColorStop(1, 'transparent');
  ctx.globalAlpha = opacityBase * 0.3;
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // 内层亮点（小而亮）
  const coreRadius = p.radius;
  const core = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, coreRadius);
  core.addColorStop(0, '#ffffff');
  core.addColorStop(0.3, p.color);
  core.addColorStop(1, 'transparent');
  ctx.globalAlpha = opacityBase;
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(p.x, p.y, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 萤火虫（固定光点）：强烈脉动光晕，忽明忽暗
 */
function drawGlowbugParticle(p) {
  ctx.save();

  // 主脉冲：0→1→0 的强对比闪烁
  const pulse = (Math.sin(p.phase) + 1) / 2;
  // 光晕相位略有偏移，产生层次感
  const glowPulse = (Math.sin(p.glowPhase) + 1) / 2;

  // 外层大光晕（随脉冲呼吸）
  const glowRadius = p.radius * 6 * (0.4 + 0.6 * glowPulse);
  const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
  glow.addColorStop(0, p.color);
  glow.addColorStop(1, 'transparent');
  ctx.globalAlpha = pulse * 0.45;
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // 中层光晕
  const midRadius = p.radius * 2.5 * (0.5 + 0.5 * pulse);
  const mid = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, midRadius);
  mid.addColorStop(0, '#ffffff');
  mid.addColorStop(0.3, p.color);
  mid.addColorStop(1, 'transparent');
  ctx.globalAlpha = pulse * 0.7;
  ctx.fillStyle = mid;
  ctx.beginPath();
  ctx.arc(p.x, p.y, midRadius, 0, Math.PI * 2);
  ctx.fill();

  // 核心亮点（亮时很强，暗时几乎消失）
  ctx.globalAlpha = pulse > 0.3 ? pulse : 0;
  const core = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 0.8);
  core.addColorStop(0, '#ffffff');
  core.addColorStop(1, p.color);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 蒲公英种子：白色绒球，轻飘飞过
 */
function drawDandelionParticle(p) {
  ctx.save();
  ctx.translate(p.x + p.sway, p.y);
  ctx.rotate(p.rotation);

  const alpha = 0.5 + 0.5 * ((Math.sin(p.phase * 0.8) + 1) / 2);
  const s = p.size;

  // 绒毛：放射状细线 + 末端分叉
  ctx.globalAlpha = alpha * 0.5;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.4;
  ctx.lineCap = 'round';
  const filamentCount = 8;
  for (let i = 0; i < filamentCount; i++) {
    const angle = (Math.PI * 2 / filamentCount) * i + p.rotation * 0.3;
    const len = s * (0.6 + 0.4 * ((i % 3) / 3));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
    ctx.stroke();
    // 绒毛末端小分叉
    const tipX = Math.cos(angle) * len;
    const tipY = Math.sin(angle) * len;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + Math.cos(angle + 0.4) * s * 0.25, tipY + Math.sin(angle + 0.4) * s * 0.25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + Math.cos(angle - 0.4) * s * 0.25, tipY + Math.sin(angle - 0.4) * s * 0.25);
    ctx.stroke();
  }

  // 核心绒点
  ctx.globalAlpha = alpha * 0.8;
  const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.5);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
