/* ============================================
   audio.js — BGM 播放控制
   职责：播放 + 淡入淡出切换
   对外暴露：init(), play(bgmPath)
   ============================================ */

// ── 可调参数 ──────────────────────────────
const FADE_MS = 1500;         // 淡入淡出时长
const FADE_STEP = 30;         // 每步间隔（ms）
const VOLUME_STEP = 0.03;     // 每步音量变化量

// ── 内部状态 ──────────────────────────────
let audioA = null;            // 当前播放
let audioB = null;            // 用于淡入
let currentBgm = null;        // 当前 BGM 路径
let fadeTimer = null;         // 淡入淡出定时器
let isUnlocked = false;       // 移动端 autoplay 是否已解锁
let globalMuted = false;      // 全局静音状态
const NORMAL_VOLUME = 0.8;    // 正常音量

/**
 * 初始化音频模块（预创建 Audio 元素）
 */
export function init() {
  audioA = new Audio();
  audioB = new Audio();

  // 两个都设为循环播放
  audioA.loop = true;
  audioB.loop = true;

  // 初始音量
  audioA.volume = 0.8;
  audioB.volume = 0;
}

/**
 * 播放指定 BGM，自动淡入淡出
 * @param {string} bgmPath - 音频文件路径
 */
export function play(bgmPath) {
  if (!bgmPath) return;

  // 同一个 BGM 不重复切
  if (currentBgm === bgmPath) return;
  currentBgm = bgmPath;

  // 取消正在进行的淡入淡出
  if (fadeTimer) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }

  // 如果 autoplay 还没解锁，存下路径，等解锁后播放
  if (!isUnlocked) {
    // 先加载音频
    audioA.src = bgmPath;
    audioA.load();
    return;
  }

  // 交换 A/B 角色：A 始终是当前播放的，B 用于淡入
  // 如果 audioA 没在播（首次播放），直接用 A
  if (audioA.paused && audioA.readyState === 0) {
    audioA.src = bgmPath;
    audioA.volume = 0;
    audioA.play().catch(() => {});
    fadeIn(audioA);
    return;
  }

  // 正常切换：B 加载新曲，交叉淡入淡出
  audioB.src = bgmPath;
  audioB.load();
  audioB.volume = 0;
  audioB.play().catch(() => {});

  crossfade(audioA, audioB, () => {
    // 淡入淡出完成后交换引用
    const tmp = audioA;
    audioA = audioB;
    audioB = tmp;
  });
}

/**
 * 停止 BGM（回到主界面时调用）
 */
export function stop() {
  if (fadeTimer) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }
  if (audioA) {
    audioA.pause();
    audioA.volume = 0;
    audioA.src = '';
  }
  if (audioB) {
    audioB.pause();
    audioB.volume = 0;
    audioB.src = '';
  }
  currentBgm = null;
}

/**
 * 设置全局静音
 */
export function setMuted(muted) {
  globalMuted = muted;
  if (audioA) audioA.volume = muted ? 0 : NORMAL_VOLUME;
  if (audioB) audioB.volume = muted ? 0 : NORMAL_VOLUME;
}

/**
 * 查询当前静音状态
 */
export function isMuted() { return globalMuted; }

/**
 * 解锁移动端 autoplay（需在用户首次触摸时调用）
 */
export function unlock() {
  if (isUnlocked) return;

  // 尝试播放一个静音片段来解锁 AudioContext
  const silent = new Audio();
  silent.volume = 0;
  silent.play()
    .then(() => {
      isUnlocked = true;
      silent.pause();
      silent.remove();
    })
    .catch(() => {
      // 部分浏览器仍会拒绝，静默失败
      silent.remove();
    });

  // 同时标记解锁（即使上面失败，后续用户操作也可以触发播放）
  isUnlocked = true;
}

// ── 内部函数 ──────────────────────────────

/**
 * 交叉淡入淡出
 */
function crossfade(fromAudio, toAudio, onComplete) {
  // 静音状态下不做淡入淡出，直接静默切换
  if (globalMuted) {
    fromAudio.volume = 0;
    fromAudio.pause();
    toAudio.volume = 0;
    if (onComplete) onComplete();
    return;
  }

  let fromVol = fromAudio.volume || NORMAL_VOLUME;
  let toVol = 0;

  fadeTimer = setInterval(() => {
    fromVol = Math.max(0, fromVol - VOLUME_STEP);
    toVol = Math.min(NORMAL_VOLUME, toVol + VOLUME_STEP);

    fromAudio.volume = fromVol;
    toAudio.volume = toVol;

    if (fromVol <= 0 && toVol >= NORMAL_VOLUME) {
      clearInterval(fadeTimer);
      fadeTimer = null;
      fromAudio.pause();
      fromAudio.volume = 0;
      toAudio.volume = NORMAL_VOLUME;
      if (onComplete) onComplete();
    }
  }, FADE_STEP);
}

/**
 * 单独淡入（首次播放用）
 */
function fadeIn(audio) {
  // 静音状态下不淡入
  if (globalMuted) {
    audio.volume = 0;
    return;
  }

  let vol = 0;
  fadeTimer = setInterval(() => {
    vol = Math.min(NORMAL_VOLUME, vol + VOLUME_STEP);
    audio.volume = vol;

    if (vol >= NORMAL_VOLUME) {
      clearInterval(fadeTimer);
      fadeTimer = null;
    }
  }, FADE_STEP);
}
