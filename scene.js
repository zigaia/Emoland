/* ============================================
   scene.js — 场景定义 + 三层关键词匹配
   粒子体系：sparkle / firefly / rain / snow / petal / leaf
   ============================================ */

const SCENES = [

  // ── 主界面 ──
  {
    id: 'dialog',
    name: 'Emoland',
    emoji: '🏝️',
    background: 'assets/images/ui-dialog.png',
    particle: null,
    bgm: null,
    preset: null,
    keywords: [],
  },

  // ═══════════════════════════════════════════
  // 🌲 森林系列
  // ═══════════════════════════════════════════

  {
    id: 'forest-spring-day',
    name: '森林 · 春晨',
    emoji: '🌸',
    series: '森林',
    background: 'assets/images/forest-spring-day.png',
    particle: { type: 'petal', color: '#ffd0e8', count: 35, speed: 0.5 },
    bgm: 'assets/audio/forest-spring-day.mp3',
    preset: '🌲森林清晨',
    keywords: [
      '森林', '春天', '春季', '清晨', '早晨', '春晨', '晨光',
      '樱花', '新绿', '鸟鸣', '生机', '花瓣',
      '开心', '快乐', '高兴', '希望', '元气', '活力', '新生', '美好',
      '晨跑', '呼吸', '开始', '早安',
    ],
  },
  {
    id: 'forest-spring-night',
    name: '森林 · 春夜',
    emoji: '🌙',
    series: '森林',
    background: 'assets/images/forest-spring-night.png',
    particle: { type: 'petal', color: '#f0d0e8', count: 25, speed: 0.4 },
    bgm: 'assets/audio/forest-spring-night.mp3',
    preset: null,
    keywords: [
      '森林', '春天', '春季', '夜晚', '晚上', '春夜', '夜樱',
      '樱花', '花瓣', '暗香', '月色',
      '浪漫', '心动', '甜蜜', '初恋', '温柔', '约会', '恋爱',
      '牵手', '漫步', '看花',
    ],
  },
  {
    id: 'forest-summer-day',
    name: '森林 · 夏昼',
    emoji: '☀️',
    series: '森林',
    background: 'assets/images/forest-summer-day.jpg',
    particle: { type: 'sparkle', color: '#fffbe6', count: 40, speed: 0.35 },
    bgm: 'assets/audio/forest-summer-day.mp3',
    preset: null,
    keywords: [
      '森林', '夏天', '夏季', '白天', '夏日', '盛夏', '绿意',
      '阳光', '蝉鸣', '树荫', '翠绿',
      '开心', '活力', '元气', '热情', '自由',
      '散步', '乘凉', '午睡',
    ],
  },
  {
    id: 'forest-summer-night',
    name: '森林 · 夏夜',
    emoji: '🌌',
    series: '森林',
    background: 'assets/images/forest-summer-night.jpg',
    particle: { type: 'firefly', color: '#ffeaa7', count: 35, speed: 0.3 },
    bgm: 'assets/audio/forest-summer-day.mp3',   // 共享夏昼 BGM
    preset: null,
    keywords: [
      '森林', '夏天', '夏季', '夜晚', '晚上', '夏夜',
      '萤火虫', '星空', '凉风', '虫鸣',
      '浪漫', '悠闲', '惬意', '怀旧', '童年',
      '乘凉', '看星星', '散步', '聊天',
    ],
  },
  {
    id: 'forest-summer-rain',
    name: '森林 · 夏雨',
    emoji: '🌧️',
    series: '森林',
    background: 'assets/images/forest-summer-rain.png',
    particle: { type: 'rain', color: '#c8d6e5', count: 70, speed: 4.5 },
    bgm: 'assets/audio/forest-summer-rain.mp3',
    preset: '🌧️听雨',
    keywords: [
      '下雨', '雨', '雨天', '夏雨', '雨声', '听雨', '暴雨', '细雨',
      '森林', '树林', '绿', '湿润', '水珠',
      '悲伤', '难过', '想哭', '忧郁', '闷', '闷闷不乐', '沮丧',
      '治愈', '安静', '沉淀', '放空', '释放',
      '发呆', '看书', '宅', '窗边', '失眠', '睡不着',
    ],
  },
  {
    id: 'forest-autumn-dust',
    name: '森林 · 秋日',
    emoji: '🍂',
    series: '森林',
    background: 'assets/images/forest-autumn-dust.png',
    particle: { type: 'leaf', colors: ['#ffcc66', '#ff9933', '#e67300', '#ffcc00'], count: 30, speed: 0.6 },
    bgm: 'assets/audio/forest-autumn-dust.mp3',
    preset: null,
    keywords: [
      '森林', '秋天', '秋季', '白天', '午后', '秋日', '金秋',
      '落叶', '缤纷', '金黄色', '尘埃', '光斑', '枫叶',
      '温暖', '怀旧', '慵懒', '惬意', '舒适', '满足',
      '忙碌', '疲惫', '累', '需要休息', '休息', '放松',
      '散步', '晒太阳', '拍照', '野餐', '喝咖啡',
    ],
  },
  {
    id: 'forest-autumn-night',
    name: '森林 · 秋夜',
    emoji: '🌕',
    series: '森林',
    background: 'assets/images/forest-autumn-night.png',
    particle: { type: 'leaf', colors: ['#ffaa44', '#dd8833', '#ffbb55'], count: 20, speed: 0.5 },
    bgm: 'assets/audio/forest-autumn-dust.mp3',
    preset: null,
    keywords: [
      '森林', '秋天', '秋季', '夜晚', '晚上', '秋夜', '月夜',
      '明月', '凉风', '落叶', '秋风',
      '思念', '想家', '想ta', '孤独', '安静', '沉淀', '想静静',
      '感性', '怀旧', '感慨',
      '看月亮', '散步', '吹风', '放空', '独处',
    ],
  },
  {
    id: 'forest-winter-day',
    name: '森林 · 冬日',
    emoji: '❄️',
    series: '森林',
    background: 'assets/images/forest-winter-day.png',
    particle: { type: 'snow', color: '#e8f0ff', count: 45, speed: 0.8 },
    bgm: 'assets/audio/forest-winter-day.mp3',
    preset: null,
    keywords: [
      '森林', '冬天', '冬季', '白天', '冬日', '下雪', '雪天',
      '雪', '雪花', '白雪', '银白', '冰晶',
      '平静', '安静', '冷静', '清醒', '纯净', '清净',
      '看雪', '取暖', '喝热茶', '发呆',
    ],
  },
  {
    id: 'forest-winter-night',
    name: '森林 · 冬夜',
    emoji: '🌟',
    series: '森林',
    background: 'assets/images/forest-winter-night.png',
    particle: { type: 'snow', color: '#d0e0ff', count: 35, speed: 0.6 },
    bgm: 'assets/audio/forest-winter-night.mp3',
    preset: null,
    keywords: [
      '森林', '冬天', '冬季', '夜晚', '晚上', '冬夜', '雪夜',
      '雪', '星光', '寒意',
      '平静', '孤独', '沉思', '宁静', '思考', '想事情',
      '独处', '回忆', '围炉', '看星星',
    ],
  },

  // ═══════════════════════════════════════════
  // 🌊 海边系列
  // ═══════════════════════════════════════════

  {
    id: 'sea-dust-day',
    name: '海边 · 黄昏',
    emoji: '🌅',
    series: '海边',
    background: 'assets/images/sea-dust-day.jpg',
    particle: { type: 'sparkle', color: '#ffe0b3', count: 35, speed: 0.4 },
    bgm: 'assets/audio/sea-dust-day.mp3',
    preset: '🌅海边黄昏',
    keywords: [
      '海边', '海滩', '海洋', '黄昏', '夕阳', '日落', '晚霞', '傍晚',
      '金色', '波浪', '沙滩', '海风',
      '浪漫', '温柔', '放松', '自由', '惬意', '舒服',
      '焦虑', '压力', '烦躁', '需要放松',
      '散步', '赤脚', '听海', '吹风', '发呆',
    ],
  },
  {
    id: 'sea-night-moon',
    name: '海边 · 月夜',
    emoji: '🌊',
    series: '海边',
    background: 'assets/images/sea-night-moon.jpg',
    particle: { type: 'sea-sparkle', color: '#e8e8ff', count: 55, speed: 0.2 },
    bgm: 'assets/audio/sea-night-moon.mp3',
    preset: null,
    keywords: [
      '海边', '夜晚', '月夜', '月光', '海面', '海上',
      '银色', '潮汐', '灯塔', '波浪', '波光', '粼粼',
      '悲伤', '思念', '想家', '想ta', '远方', '平静', '深邃',
      '忧郁', '孤单',
      '听潮', '写信', '独处', '发呆',
    ],
  },
  {
    id: 'sea-night-stars',
    name: '海边 · 星夜',
    emoji: '🌌',
    series: '海边',
    background: 'assets/images/sea-night-stars.jpg',
    particle: { type: 'sparkle', color: '#ffffff', count: 50, speed: 0.2 },
    bgm: 'assets/audio/sea-night-stars.mp3',
    preset: null,
    keywords: [
      '海边', '夜晚', '星空', '星星', '银河', '星夜', '流星',
      '许愿', '沙滩',
      '悲伤', '渺小', '宇宙', '感慨', '梦幻', '失眠',
      '需要陪伴', '孤单',
      '仰望', '躺平', '发呆', '数星星', '做梦',
    ],
  },

  // ═══════════════════════════════════════════
  // 🌸 花海
  // ═══════════════════════════════════════════

  {
    id: 'flower-sun-day',
    name: '花海 · 晴日',
    emoji: '🌻',
    series: '花海',
    background: 'assets/images/flower-sun-day.jpg',
    particle: { type: 'petal', color: '#ffe8f0', count: 40, speed: 0.45 },
    bgm: 'assets/audio/forest-spring-day.mp3',
    preset: null,
    keywords: [
      '花海', '花田', '花', '晴日', '晴天', '阳光', '蓝天',
      '向日葵', '雏菊', '摇曳', '花瓣',
      '开心', '快乐', '明媚', '温暖', '希望', '元气', '治愈', '美好',
      '奔跑', '拍照', '野餐', '看花',
    ],
  },

  // ═══════════════════════════════════════════
  // 🌿 草原
  // ═══════════════════════════════════════════

  {
    id: 'grassland-day-flower',
    name: '草原 · 花野',
    emoji: '🌾',
    series: '草原',
    background: 'assets/images/grassland-day-flower.jpg',
    particle: { type: 'sparkle', color: '#fffde8', count: 40, speed: 0.3 },
    bgm: 'assets/audio/forest-summer-day.mp3',
    preset: null,
    keywords: [
      '草原', '旷野', '花野', '原野', '草地', '辽阔',
      '蓝天', '白云', '风', '远方', '地平线',
      '自由', '开阔', '奔放', '释放', '放松', '畅快',
      '奔跑', '吹风', '躺平', '发呆', '深呼吸',
    ],
  },

  // ═══════════════════════════════════════════
  // 🌊 湖泊
  // ═══════════════════════════════════════════

  {
    id: 'lake-dust-sunset',
    name: '湖泊 · 晚霞',
    emoji: '🌅',
    series: '湖泊',
    background: 'assets/images/lake-dust-sunset.jpg',
    particle: { type: 'sparkle', color: '#ffe8c0', count: 45, speed: 0.3 },
    bgm: 'assets/audio/sea-dust-day.mp3',
    preset: null,
    keywords: [
      '湖泊', '湖', '晚霞', '夕阳', '落日', '黄昏', '傍晚',
      '金光', '水面', '倒影', '芦苇', '波光',
      '温暖', '浪漫', '温柔', '平静', '安静', '治愈', '惬意',
      '发呆', '散步', '看日落', '钓鱼',
    ],
  },
  {
    id: 'lake-morning-fog',
    name: '湖泊 · 晨雾',
    emoji: '🌫️',
    series: '湖泊',
    background: 'assets/images/lake-morning-fog.jpg',
    particle: { type: 'mist', color: '#f0f4f8', count: 18, speed: 0.15 },
    bgm: 'assets/audio/valley-day-water.mp3',
    preset: null,
    keywords: [
      '湖泊', '湖', '晨雾', '雾', '雾气', '清晨', '早晨', '朦胧',
      '仙气', '氤氲', '飘渺', '若隐若现',
      '宁静', '治愈', '冥想', '放空', '禅意', '清净', '平和',
      '深呼吸', '打坐', '发呆', '品茶',
    ],
  },

  // ═══════════════════════════════════════════
  // 🌠 流星
  // ═══════════════════════════════════════════

  {
    id: 'shootingstar-night-lake',
    name: '流星 · 夜湖',
    emoji: '🌠',
    series: '流星',
    background: 'assets/images/shootingstar-night-lake.jpg',
    particle: { type: 'meteor', color: '#ffeedd', count: 6, speed: 6.5 },
    bgm: 'assets/audio/sea-night-moon.mp3',
    preset: null,
    keywords: [
      '流星', '流星雨', '夜', '湖', '夜晚', '星空',
      '许愿', '划过', '光芒', '倒影',
      '梦幻', '浪漫', '幸运', '希望', '短暂', '美好', '感动',
      '许愿', '仰望', '独处', '发呆', '等待',
    ],
  },
  {
    id: 'shootingstar-night-mountain',
    name: '流星 · 夜山',
    emoji: '💫',
    series: '流星',
    background: 'assets/images/shootingstar-night-mountain.jpg',
    particle: { type: 'meteor', color: '#ffeedd', count: 7, speed: 7 },
    bgm: 'assets/audio/sky-nebula-night.mp3',
    preset: null,
    keywords: [
      '流星', '流星雨', '夜', '山', '夜晚', '星空', '银河',
      '宇宙', '山顶', '天际', '划过',
      '震撼', '渺小', '敬畏', '感动', '梦幻', '孤独', '浪漫',
      '许愿', '仰望', '跋涉', '独行', '思考',
    ],
  },

  // ═══════════════════════════════════════════
  // 🔥 篝火
  // ═══════════════════════════════════════════

  {
    id: 'bonfire-night-flower',
    name: '篝火 · 花夜',
    emoji: '🔥',
    series: '篝火',
    background: 'assets/images/bonfire-night-flower.jpg',
    particle: { type: 'firefly', color: '#ff9966', count: 25, speed: 0.5 },
    bgm: 'assets/audio/bonfire-night-flower.mp3',
    preset: '🔥篝火之夜',
    keywords: [
      '篝火', '营火', '露营', '火堆', '火花', '火苗',
      '开心', '快乐', '温暖', '拥抱', '陪伴', '安心', '安全',
      '害怕', '不安', '恐惧', '需要温暖',
      '兴奋', '激动', '热闹',
      '聊天', '唱歌', '烤火', '夜谈', '朋友', '好朋友', '聚会',
    ],
  },

  // ═══════════════════════════════════════════
  // ✨ 星空
  // ═══════════════════════════════════════════

  {
    id: 'sky-nebula-night',
    name: '星空 · 星云',
    emoji: '✨',
    series: '星空',
    background: 'assets/images/sky-nebula-night.png',
    particle: { type: 'sparkle', color: '#e8e0ff', count: 60, speed: 0.15 },
    bgm: 'assets/audio/sky-nebula-night.mp3',
    preset: '✨星空',
    keywords: [
      '星空', '星云', '银河', '宇宙', '星际', '极光', '流星', '星座',
      '震撼', '渺小', '幻想', '做梦', '探索', '未来',
      '浪漫', '失眠', '睡不着', '焦虑', '压力',
      '兴奋', '激动', '好奇',
      '仰望', '许愿', '旅行', '想象',
    ],
  },

  // ═══════════════════════════════════════════
  // 🏔️ 雪山
  // ═══════════════════════════════════════════

  {
    id: 'snowmountain-summer-day',
    name: '雪山 · 夏',
    emoji: '🏔️',
    series: '雪山',
    background: 'assets/images/snowmountain-summer-day.jpg',
    particle: { type: 'sparkle', color: '#fffbe6', count: 30, speed: 0.35 },
    bgm: 'assets/audio/forest-summer-day.mp3',
    preset: null,
    keywords: [
      '雪山', '高山', '夏天', '白天', '山巅',
      '白雪', '阳光', '清冽', '辽阔', '壮丽',
      '清醒', '敬畏', '自由', '洒脱', '开阔',
      '焦虑', '压力', '需要释放',
      '远足', '登山', '呼吸', '挑战',
    ],
  },
  {
    id: 'snowmountain-winter-day',
    name: '雪山 · 冬',
    emoji: '⛰️',
    series: '雪山',
    background: 'assets/images/snowmountain-winter-day.jpg',
    particle: { type: 'snow', color: '#f0f4ff', count: 40, speed: 0.7 },
    bgm: 'assets/audio/snowmountain-winter-day.mp3',
    preset: null,
    keywords: [
      '雪山', '高山', '冬天', '白天', '暴雪', '严寒', '冰封',
      '风雪', '冰川',
      '平静', '坚毅', '孤独', '沉思', '清醒', '冷静', '思考',
      '禅意', '修行',
      '攀登', '坚持', '挑战', '独行',
    ],
  },

  // ═══════════════════════════════════════════
  // 🎋 竹林
  // ═══════════════════════════════════════════

  {
    id: 'bamboo-day-water',
    name: '竹林 · 流水',
    emoji: '🎋',
    series: '竹林',
    background: 'assets/images/bamboo-day-water.jpg',
    particle: { type: 'leaf', colors: ['#88cc88', '#aaddaa', '#77bb77'], count: 25, speed: 0.5 },
    bgm: 'assets/audio/valley-day-water.mp3',
    preset: null,
    keywords: [
      '竹林', '竹子', '竹', '流水', '小溪', '水', '溪流',
      '翠绿', '清凉', '幽静', '清幽',
      '平静', '安静', '禅意', '淡泊', '清净', '修身', '治愈',
      '焦虑', '烦躁', '压力', '需要安静',
      '喝茶', '冥想', '打坐', '太极', '瑜伽', '修行',
    ],
  },

  // ═══════════════════════════════════════════
  // 🏞️ 山谷
  // ═══════════════════════════════════════════

  {
    id: 'valley-day-water',
    name: '山谷 · 溪流',
    emoji: '🏞️',
    series: '山谷',
    background: 'assets/images/valley-day-water.jpg',
    particle: { type: 'sparkle', color: '#e8f5e8', count: 35, speed: 0.3 },
    bgm: 'assets/audio/valley-day-water.mp3',
    preset: null,
    keywords: [
      '山谷', '溪流', '流水', '瀑布', '水声', '溪水',
      '绿色', '幽谷', '鸟语', '森林',
      '放松', '治愈', '逃离', '隐居', '轻松', '平静',
      '疲惫', '累', '需要休息',
      '徒步', '涉水', '探险', '郊游',
    ],
  },
];

// ── 特殊引用 ────────────────────────────────
const DIALOG_SCENE  = SCENES[0];
const DEFAULT_SCENE = SCENES[1];

// ── 导出 ────────────────────────────────────

/**
 * 返回按匹配分数降序排列的场景数组（不含 dialog）
 * 用于滑动切换场景：用户输入后，可左滑切换到下一个匹配场景
 */
export function getRankedScenes(input) {
  if (!input || !input.trim()) return [];
  const text = input.trim().toLowerCase();

  const scored = [];
  for (const scene of SCENES) {
    if (!scene.keywords.length) continue;
    let score = 0;
    for (const kw of scene.keywords) {
      if (text.includes(kw.toLowerCase())) {
        score += kw.length >= 3 ? kw.length : 5;
      }
    }
    if (score > 0) {
      scored.push({ scene, score });
    }
  }

  // 按分数降序排列
  scored.sort((a, b) => b.score - a.score);

  const ranked = scored.map(s => s.scene);

  // 如果关键词一个都没匹配到，用模糊兜底填充
  if (ranked.length === 0) {
    const fallback = fuzzyFallback(text);
    if (fallback) ranked.push(fallback);
  }

  return ranked;
}

/**
 * 获取最佳匹配场景（getRankedScenes 的第一个结果）
 */
export function getScene(input) {
  const ranked = getRankedScenes(input);
  return ranked[0] || null;
}

function fuzzyFallback(text) {
  // ── 场景系列匹配（具体优先） ──────────
  if (/流星|流星雨|许愿星/.test(text)) return byId('shootingstar-night-lake');
  if (/花海|花田/.test(text)) return byId('flower-sun-day');
  if (/草原|旷野|原野/.test(text)) return byId('grassland-day-flower');
  if (/雾|晨雾|朦胧|氤氲/.test(text)) return byId('lake-morning-fog');
  if (/湖|湖泊/.test(text)) return byId('lake-dust-sunset');
  // ── 季节 / 天气 ──────────────────────
  if (/雪|冬|寒|冰/.test(text)) return byId('forest-winter-day');
  if (/秋|落叶|枫/.test(text)) return byId('forest-autumn-dust');
  if (/夏|暑|热|蝉/.test(text)) return byId('forest-summer-day');
  if (/春|樱|花|暖/.test(text)) return byId('forest-spring-day');
  if (/雨/.test(text)) return byId('forest-summer-rain');
  // ── 地点 / 地貌 ──────────────────────
  if (/海|浪|沙滩|潮/.test(text)) return byId('sea-dust-day');
  if (/星|宇宙|银河|夜/.test(text)) return byId('sky-nebula-night');
  if (/篝火|火|营/.test(text)) return byId('bonfire-night-flower');
  if (/山|雪|高/.test(text)) return byId('snowmountain-summer-day');
  if (/竹|禅/.test(text)) return byId('bamboo-day-water');
  if (/谷|溪|流|瀑/.test(text)) return byId('valley-day-water');
  // ── 情绪兜底 ─────────────────────────
  if (/难过|伤心|哭|悲伤|忧郁|闷/.test(text)) return byId('forest-summer-rain');
  if (/开心|快乐|高兴|兴奋/.test(text)) return byId('forest-spring-day');
  if (/累|疲惫|忙|休息/.test(text)) return byId('forest-autumn-dust');
  if (/平静|安静|静静|静/.test(text)) return byId('bamboo-day-water');
  if (/想家|思念|想ta|想念/.test(text)) return byId('forest-autumn-night');
  if (/怕|不安|恐惧/.test(text)) return byId('bonfire-night-flower');
  if (/失眠|睡不着/.test(text)) return byId('forest-summer-rain');
  return DEFAULT_SCENE;
}

function byId(id) { return SCENES.find(s => s.id === id) || DEFAULT_SCENE; }

export function getPresetScenes() { return SCENES.filter(s => s.preset); }
export function getAllScenes()    { return SCENES.filter(s => s.keywords.length > 0); }
export function getHomeScene()    { return DIALOG_SCENE; }

export { DEFAULT_SCENE, DIALOG_SCENE };
