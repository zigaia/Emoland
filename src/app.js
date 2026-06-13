/* ============================================
   app.js — 应用总控
   职责：初始化 + 串联模块 + 监听用户输入
   ============================================ */

import { getPresetScenes, DIALOG_SCENE, getAllScenes, getDiverseRanking } from './scene.js';
import { init as initRenderer, setScene, resize, preload } from './renderer.js';
import { init as initAudio, play, stop as stopAudio, unlock as unlockAudio, setMuted, isMuted } from './audio.js';

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

// 当前所在场景
let currentSceneId = null;

// 滑动切换场景
let sceneHistory = [];       // 场景 ID 历史栈（右/下滑返回）
let diverseDeck = [];        // 多样性排序后的完整场景列表（可无限左滑）
let deckIndex = 0;           // 当前在 diverseDeck 中的位置

// 收藏
const FAV_KEY = 'emoland_favs';
function loadFavs()   { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; } }
function saveFavs(ids) { localStorage.setItem(FAV_KEY, JSON.stringify(ids)); }

// ── 启动流程 ──────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initRenderer(canvas);
  initAudio();
  // 初始静音状态同步（对话框视频默认 muted，音频也跟随）
  setMuted(true);
  // 预加载所有场景底图（后续切换瞬间完成）
  preload(getAllScenes());
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
  console.log('🏝️ Emoland v0.3 — ' + sceneNames.length + ' 个场景已就绪');
  console.log('预设：', getPresetScenes().map(s => s.preset).join(' / '));
  console.log('全部：', sceneNames.join(' | '));
});

// ── 预设按钮 ──────────────────────────────

function buildPresetBar() {
  const presets = getPresetScenes();
  for (const scene of presets) {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.textContent = scene.preset;
    btn.addEventListener('click', () => {
      // 全部场景填入滑动画板，预设场景排在第一位
      const all = getAllScenes();
      const idx = all.findIndex(s => s.id === scene.id);
      if (idx > 0) {
        // 当前场景放首位，其余保持原顺序
        diverseDeck = [all[idx], ...all.slice(0, idx), ...all.slice(idx + 1)];
      } else {
        diverseDeck = all;
      }
      deckIndex = 0;
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

  // 滑动切换场景
  bindSwipe();
}

// ── 主界面 ⇄ 场景 ──────────────────────────

function goDialog() {
  currentSceneId = null;
  sceneHistory = [];
  diverseDeck = [];
  deckIndex = 0;
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

// ── 核心：用户输入 → 多样性匹配 ────────────

function handleSend() {
  const text = input.value;
  if (!text.trim()) return;

  // 多样性排序（同系列靠后）+ 补全全部场景 → 完整列表
  diverseDeck = getDiverseRanking(text, currentSceneId);

  if (!diverseDeck.length) {
    input.value = '';
    input.blur();
    return;
  }

  // 跳过当前场景（如果排名第一就是当前场景）
  let pickIndex = 0;
  if (diverseDeck[0].id === currentSceneId && diverseDeck.length > 1) {
    pickIndex = 1;
  }

  deckIndex = pickIndex;
  const scene = diverseDeck[pickIndex];
  if (scene && scene.id !== 'dialog') {
    enterScene(scene);
  }

  input.value = '';
  input.blur();
}

// ── 四向滑动 ──────────────────────────────

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

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // 阈值：位移 ≥ 60px，时长 < 600ms
    if (Math.max(absDx, absDy) < 60 || dt > 600) return;

    // 判断主导方向（水平 vs 垂直）
    if (absDx >= absDy) {
      // 水平主导 →
      if (dx < 0) swipeNext();   // 左滑 = 下一个
      else        swipeBack();   // 右滑 = 上一个
    } else {
      // 垂直主导 ↓
      if (dy < 0) swipeNext();   // 上滑 = 下一个
      else        swipeBack();   // 下滑 = 上一个
    }
  });
}

/**
 * 左滑 / 上滑 → 下一个场景（可无限循环）
 */
function swipeNext() {
  if (!currentSceneId || !diverseDeck.length) return;

  // 循环：到头后回到第一个
  deckIndex = (deckIndex + 1) % diverseDeck.length;
  const nextScene = diverseDeck[deckIndex];
  enterScene(nextScene);
}

/**
 * 右滑 / 下滑 → 返回上一个场景 / 回到主界面
 */
function swipeBack() {
  if (!currentSceneId) return;

  if (sceneHistory.length > 1) {
    sceneHistory.pop();
    const prevId = sceneHistory[sceneHistory.length - 1];
    const prevScene = getAllScenes().find(s => s.id === prevId);
    if (prevScene) {
      // 同步 deckIndex
      const pos = diverseDeck.findIndex(s => s.id === prevId);
      if (pos !== -1) deckIndex = pos;
      enterScene(prevScene, { skipHistory: true });
    }
  } else if (sceneHistory.length === 1) {
    goDialog();
  }
}

// ── 辅助功能 ──────────────────────────────

function unlockOnce() { unlockAudio(); }

function toggleMute() {
  // 全局静音切换：同时控制对话视频 + 场景 BGM
  const wasMuted = dialogVideo.muted && isMuted();
  const nowMuted = !wasMuted;

  dialogVideo.muted = nowMuted;
  setMuted(nowMuted);

  if (nowMuted) {
    muteBtn.classList.add('muted');
  } else {
    muteBtn.classList.remove('muted');
  }
}

// ── 收藏 ──────────────────────────────────

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

  favBtn.classList.remove('popping');
  void favBtn.offsetWidth;
  favBtn.classList.add('popping');

  if (!isFav) {
    favBtn.classList.remove('ringing');
    void favBtn.offsetWidth;
    favBtn.classList.add('ringing');
  }

  if (isFav) {
    favs.splice(idx, 1);
    saveFavs(favs);
    favBtn.classList.remove('favorited');
  } else {
    favs.push(currentSceneId);
    saveFavs(favs);
    favBtn.classList.add('favorited');
  }
}

// ── Toast ─────────────────────────────────

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
