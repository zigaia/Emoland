/* ============================================
   app.js — 应用总控
   职责：初始化 + 串联模块 + 监听用户输入
   ============================================ */

import { getPresetScenes, DIALOG_SCENE, getAllScenes, getRankedScenes } from './scene.js';
import { init as initRenderer, setScene, resize } from './renderer.js';
import { init as initAudio, play, stop as stopAudio, unlock as unlockAudio } from './audio.js';

// ── DOM 元素 ──────────────────────────────
const canvas        = document.getElementById('emoland-canvas');
const input         = document.getElementById('scene-input');
const sendBtn       = document.getElementById('send-btn');
const backBtn       = document.getElementById('back-btn');
const centerText    = document.getElementById('center-text');
const presetBar     = document.getElementById('preset-bar');
const dialogVideo   = document.getElementById('dialog-video');
const muteBtn       = document.getElementById('mute-btn');
const favBtn        = document.getElementById('fav-btn');
const loadingOverlay = document.getElementById('loading-overlay');

// 当前所在场景（收藏时需要知道收藏的是哪个场景）
let currentSceneId = null;

// 滑动切换场景
let sceneHistory = [];      // 场景 ID 历史栈（右滑返回）
let rankedScenes = [];      // 当前输入匹配到的场景排行
let rankedIndex = 0;        // 当前在 rankedScenes 中的位置

// 收藏列表（从 localStorage 读写）
const FAV_KEY = 'emoland_favs';
function loadFavs()   { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; } }
function saveFavs(ids) { localStorage.setItem(FAV_KEY, JSON.stringify(ids)); }

// ── 启动流程 ──────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initRenderer(canvas);
  initAudio();
  buildPresetBar();
  goDialog();
  bindEvents();

  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
    loadingOverlay.addEventListener('transitionend', () => {
      loadingOverlay.remove();
    }, { once: true });
  }, 600);

  const sceneNames = getAllScenes().map(s => s.emoji + s.name);
  console.log('🏝️ Emoland v0.2 — ' + sceneNames.length + ' 个场景已就绪');
  console.log('预设：', getPresetScenes().map(s => s.preset).join(' / '));
  console.log('全部：', sceneNames.join(' | '));
});

// ── 预设按钮构建 ──────────────────────────

function buildPresetBar() {
  const presets = getPresetScenes();
  for (const scene of presets) {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.textContent = scene.preset;
    btn.addEventListener('click', () => {
      rankedScenes = [];
      rankedIndex = 0;
      enterScene(scene);
    });
    presetBar.appendChild(btn);
  }
}

// ── 事件绑定 ──────────────────────────────

function bindEvents() {
  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
  backBtn.addEventListener('click', goDialog);
  muteBtn.addEventListener('click', toggleMute);
  favBtn.addEventListener('click', toggleFav);

  window.addEventListener('resize', () => resize());

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => resize());
    window.visualViewport.addEventListener('scroll', () => resize());
  }

  // 首次交互解锁音频
  document.addEventListener('click', unlockOnce, { once: true });
  document.addEventListener('touchstart', unlockOnce, { once: true });
  document.addEventListener('keydown', unlockOnce, { once: true });

  // 阻止页面滚动（输入框除外）
  document.addEventListener('touchmove', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
  }, { passive: false });

  // 滑动切换场景（左滑下一匹配 / 右滑上一场景）
  bindSwipe();
}

// ── 主界面 ⇄ 场景 切换 ──────────────────────

function goDialog() {
  currentSceneId = null;
  sceneHistory = [];
  rankedScenes = [];
  rankedIndex = 0;
  setScene(DIALOG_SCENE);
  stopAudio();
  dialogVideo.classList.remove('hidden');
  dialogVideo.play().catch(() => {});
  centerText.classList.remove('hidden');
  presetBar.classList.remove('hidden');
  favBtn.classList.remove('visible');
  backBtn.classList.remove('visible');
  input.placeholder = '今天，你想去哪里';
}

/**
 * 进入场景
 * @param {Object} scene
 * @param {Object} [opts]
 * @param {boolean} [opts.skipHistory] - true 时不推入历史栈（右滑返回时使用）
 */
function enterScene(scene, { skipHistory = false } = {}) {
  currentSceneId = scene.id;
  setScene(scene);
  play(scene.bgm);
  dialogVideo.classList.add('hidden');
  dialogVideo.pause();
  centerText.classList.add('hidden');
  presetBar.classList.add('hidden');
  favBtn.classList.add('visible');
  backBtn.classList.add('visible');
  updateFavUI();
  input.placeholder = '试试其他场景...';
  showToast(scene.emoji + ' ' + scene.name);

  if (!skipHistory) {
    sceneHistory.push(scene.id);
  }
}

// ── 核心逻辑 ──────────────────────────────

function handleSend() {
  const text = input.value;
  if (!text.trim()) return;

  // 获取按匹配分数排序的场景列表
  rankedScenes = getRankedScenes(text);

  if (!rankedScenes.length) {
    input.value = '';
    input.blur();
    return;
  }

  // 如果排名第一的场景就是当前场景，自动跳到下一个（避免用户以为指令失灵）
  let pickIndex = 0;
  if (rankedScenes[0].id === currentSceneId && rankedScenes.length > 1) {
    pickIndex = 1;
  }

  rankedIndex = pickIndex;
  const scene = rankedScenes[pickIndex];
  if (scene && scene.id !== 'dialog') {
    enterScene(scene);
  }

  input.value = '';
  input.blur();
}

// ── 滑动切换场景 ──────────────────────────

function bindSwipe() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  canvas.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    // 忽略从底部输入栏区域发起的滑动
    if (touchStartY > window.innerHeight - 80) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const dt = Date.now() - touchStartTime;

    // 阈值：水平位移 ≥ 60px，水平方向主导（≥1.5倍垂直），时长 < 500ms
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5 || dt > 500) return;

    if (dx < 0) {
      swipeLeft();
    } else {
      swipeRight();
    }
  });
}

/**
 * 左滑 → 切换到下一个匹配场景
 */
function swipeLeft() {
  if (!currentSceneId || rankedIndex + 1 >= rankedScenes.length) return;

  rankedIndex++;
  const nextScene = rankedScenes[rankedIndex];
  enterScene(nextScene);
}

/**
 * 右滑 → 返回上一个场景 / 回到主界面
 */
function swipeRight() {
  if (!currentSceneId) return;

  if (sceneHistory.length > 1) {
    // 弹出当前场景，回到上一个
    sceneHistory.pop();
    const prevId = sceneHistory[sceneHistory.length - 1];
    const prevScene = getAllScenes().find(s => s.id === prevId);
    if (prevScene) {
      enterScene(prevScene, { skipHistory: true });
    }
  } else if (sceneHistory.length === 1) {
    // 已是最初场景，回到主界面
    goDialog();
  }
}

// ── 辅助功能 ──────────────────────────────

function unlockOnce() {
  unlockAudio();
}

function toggleMute() {
  const isMuted = dialogVideo.muted;
  dialogVideo.muted = !isMuted;
  if (isMuted) {
    muteBtn.classList.remove('muted');
  } else {
    muteBtn.classList.add('muted');
  }
}

// ── 收藏逻辑 ──────────────────────────────

function updateFavUI() {
  const favs = loadFavs();
  const isFav = favs.includes(currentSceneId);
  if (isFav) {
    favBtn.classList.add('favorited');
  } else {
    favBtn.classList.remove('favorited');
  }
}

function toggleFav() {
  if (!currentSceneId) return;

  const favs = loadFavs();
  const idx = favs.indexOf(currentSceneId);
  const isFav = idx !== -1;

  // 触发弹跳动效
  favBtn.classList.remove('popping');
  void favBtn.offsetWidth;               // 强制回流，重置动画
  favBtn.classList.add('popping');

  // 收藏时触发扩散光晕
  if (!isFav) {
    favBtn.classList.remove('ringing');
    void favBtn.offsetWidth;
    favBtn.classList.add('ringing');
  }

  if (isFav) {
    // 取消收藏
    favs.splice(idx, 1);
    saveFavs(favs);
    favBtn.classList.remove('favorited');
  } else {
    // 收藏
    favs.push(currentSceneId);
    saveFavs(favs);
    favBtn.classList.add('favorited');
  }
}

// ── 辅助功能 ──────────────────────────────

function showToast(text) {
  let toast = document.getElementById('scene-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'scene-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = text;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}
