/* ============================================
   scene.js — 场景定义 + 签名词匹配 + 多样性排序
   粒子体系：sparkle / firefly / rain / snow / petal / leaf
             sea-sparkle / meteor / mist
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
    signatures: [],
    series: null,
  },

  // ═══════════════════════════════════════════
  // 🌲 森林系列 (9)
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
      '森林', '春天', '春季', '清晨', '早晨', '晨光',
      '新绿', '生机', '花瓣',
      '开心', '快乐', '高兴', '希望', '元气', '活力', '美好',
      '晨跑', '呼吸', '开始', '早安',
    ],
    signatures: ['晨跑', '鸟鸣', '早安', '新生', '朝露'],
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
      '森林', '春天', '春季', '夜晚', '晚上', '月色',
      '花瓣', '暗香',
      '浪漫', '心动', '甜蜜', '温柔',
      '牵手', '漫步', '看花',
    ],
    signatures: ['夜樱', '暗香', '约会', '恋爱', '初恋'],
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
      '森林', '夏天', '夏季', '白天', '夏日', '盛夏',
      '阳光', '树荫', '翠绿',
      '开心', '活力', '元气', '热情', '自由',
      '散步', '乘凉', '午睡',
    ],
    signatures: ['蝉鸣', '树荫', '乘凉', '午睡', '盛夏'],
  },
  {
    id: 'forest-summer-night',
    name: '森林 · 夏夜',
    emoji: '🌌',
    series: '森林',
    background: 'assets/images/forest-summer-night.jpg',
    particle: { type: 'glowbug', color: '#ffeaa7', count: 35, speed: 0.3 },
    bgm: 'assets/audio/forest-summer-day.mp3',
    preset: null,
    keywords: [
      '森林', '夏天', '夏季', '夜晚', '晚上',
      '萤火虫', '星空', '凉风',
      '浪漫', '悠闲', '惬意', '怀旧',
      '乘凉', '看星星', '散步', '聊天',
    ],
    signatures: ['萤火虫', '虫鸣', '童年', '凉风', '夏夜'],
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
      '下雨', '雨', '雨天', '暴雨', '细雨',
      '森林', '树林', '绿', '湿润', '水珠',
      '悲伤', '难过', '想哭', '忧郁', '闷',
      '治愈', '安静', '沉淀', '放空', '释放',
      '发呆', '看书', '失眠', '睡不着',
    ],
    signatures: ['雨声', '窗边', '宅', '听雨', '闷闷不乐'],
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
      '森林', '秋天', '秋季', '白天', '午后', '秋日',
      '落叶', '缤纷', '金黄色', '光斑', '枫叶',
      '温暖', '怀旧', '慵懒', '惬意', '舒适', '满足',
      '忙碌', '疲惫', '累', '需要休息', '休息', '放松',
      '散步', '晒太阳', '拍照', '野餐',
    ],
    signatures: ['枫叶', '尘埃', '野餐', '喝咖啡', '光斑'],
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
      '森林', '秋天', '秋季', '夜晚', '晚上', '月夜',
      '明月', '凉风', '落叶',
      '思念', '想家', '想ta', '孤独', '安静', '沉淀',
      '感性', '怀旧',
      '看月亮', '散步', '吹风', '放空', '独处',
    ],
    signatures: ['秋风', '看月亮', '想家', '感慨', '明月'],
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
      '森林', '冬天', '冬季', '白天', '冬日', '下雪',
      '雪', '雪花', '白雪', '银白',
      '平静', '安静', '冷静', '清醒', '纯净', '清净',
      '看雪', '取暖', '发呆',
    ],
    signatures: ['冰晶', '取暖', '喝热茶', '看雪', '银装'],
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
      '森林', '冬天', '冬季', '夜晚', '晚上', '冬夜',
      '雪', '星光', '寒意',
      '平静', '孤独', '沉思', '宁静', '思考',
      '独处', '回忆', '围炉', '看星星',
    ],
    signatures: ['雪夜', '寒意', '围炉', '沉思', '回忆'],
  },

  // ═══════════════════════════════════════════
  // 🌊 海边系列 (3)
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
      '海边', '海滩', '海洋', '黄昏', '夕阳', '日落', '傍晚',
      '金色', '波浪', '沙滩',
      '浪漫', '温柔', '放松', '自由', '惬意', '舒服',
      '焦虑', '压力', '烦躁', '需要放松',
      '散步', '赤脚', '听海', '吹风', '发呆',
    ],
    signatures: ['赤脚', '听海', '日落', '海风', '晚霞'],
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
      '银色', '潮汐', '波浪', '波光', '粼粼',
      '悲伤', '思念', '想家', '想ta', '远方', '平静', '深邃',
      '忧郁', '孤单',
      '听潮', '写信', '独处', '发呆',
    ],
    signatures: ['灯塔', '潮汐', '听潮', '写信', '粼粼'],
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
      '海边', '夜晚', '星空', '星星', '银河', '星夜', '沙滩',
      '悲伤', '渺小', '宇宙', '感慨', '梦幻', '失眠',
      '需要陪伴', '孤单',
      '仰望', '躺平', '发呆', '做梦',
    ],
    signatures: ['数星星', '做梦', '流星', '许愿', '银河'],
  },

  // ═══════════════════════════════════════════
  // 🌸 花海 (1)
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
      '花瓣',
      '开心', '快乐', '明媚', '温暖', '希望', '元气', '治愈', '美好',
      '奔跑', '拍照', '野餐', '看花',
    ],
    signatures: ['向日葵', '雏菊', '摇曳', '明媚', '花海'],
  },

  // ═══════════════════════════════════════════
  // 🌿 草原 (1)
  // ═══════════════════════════════════════════

  {
    id: 'grassland-day-flower',
    name: '草原 · 花野',
    emoji: '🌾',
    series: '草原',
    background: 'assets/images/grassland-day-flower.jpg',
    particle: { type: 'dandelion', color: '#ffffff', count: 22, speed: 0.5 },
    bgm: 'assets/audio/forest-summer-day.mp3',
    preset: null,
    keywords: [
      '草原', '旷野', '花野', '原野', '草地', '辽阔', '蒲公英',
      '蓝天', '白云', '风', '远方',
      '自由', '开阔', '释放', '放松',
      '奔跑', '吹风', '躺平', '发呆',
    ],
    signatures: ['地平线', '旷野', '奔放', '深呼吸', '畅快'],
  },

  // ═══════════════════════════════════════════
  // 🌊 湖泊 (2)
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
      '金光', '水面', '倒影',
      '温暖', '浪漫', '温柔', '平静', '安静', '治愈', '惬意',
      '发呆', '散步',
    ],
    signatures: ['芦苇', '钓鱼', '看日落', '倒影', '金光'],
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
      '飘渺',
      '宁静', '治愈', '冥想', '放空', '禅意', '清净', '平和',
      '深呼吸', '打坐', '发呆',
    ],
    signatures: ['氤氲', '飘渺', '品茶', '若隐若现', '仙气'],
  },

  // ═══════════════════════════════════════════
  // 🌠 流星 (2)
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
      '划过', '倒影',
      '梦幻', '浪漫', '幸运', '希望', '美好',
      '许愿', '仰望', '独处', '发呆',
    ],
    signatures: ['划过', '幸运', '等待', '短暂', '夜湖'],
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
      '宇宙', '山顶', '天际',
      '震撼', '渺小', '敬畏', '感动', '梦幻', '孤独', '浪漫',
      '许愿', '仰望', '思考',
    ],
    signatures: ['跋涉', '天际', '山顶', '敬畏', '夜山'],
  },

  // ═══════════════════════════════════════════
  // 🔥 篝火 (1)
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
      '篝火', '营火', '露营', '火堆', '火花',
      '开心', '快乐', '温暖', '拥抱', '陪伴', '安心', '安全',
      '害怕', '不安', '恐惧', '需要温暖',
      '兴奋', '激动', '热闹',
      '聊天', '唱歌', '烤火', '朋友', '好朋友', '聚会',
    ],
    signatures: ['营火', '火花', '烤火', '夜谈', '聚会'],
  },

  // ═══════════════════════════════════════════
  // ✨ 星空 (1)
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
      '星空', '星云', '银河', '宇宙', '星际', '星座',
      '震撼', '渺小', '幻想', '做梦', '探索', '未来',
      '浪漫', '失眠', '睡不着', '焦虑', '压力',
      '兴奋', '激动', '好奇',
      '仰望', '许愿', '旅行', '想象',
    ],
    signatures: ['星云', '极光', '星座', '星际', '幻想'],
  },

  // ═══════════════════════════════════════════
  // 🏔️ 雪山 (2)
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
      '白雪', '阳光', '清冽', '壮丽',
      '清醒', '敬畏', '自由', '洒脱', '开阔',
      '焦虑', '压力', '需要释放',
      '远足', '登山', '呼吸', '挑战',
    ],
    signatures: ['清冽', '壮丽', '远足', '山巅', '挑战'],
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
      '雪山', '高山', '冬天', '白天', '暴雪', '严寒',
      '风雪', '冰川',
      '平静', '坚毅', '孤独', '沉思', '清醒', '冷静', '思考',
      '攀登', '坚持', '挑战', '独行',
    ],
    signatures: ['暴雪', '冰川', '冰封', '攀登', '独行'],
  },

  // ═══════════════════════════════════════════
  // 🎋 竹林 (1)
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
      '竹林', '竹子', '竹', '流水', '小溪', '溪流',
      '翠绿', '清凉', '幽静', '清幽',
      '平静', '安静', '禅意', '淡泊', '清净', '治愈',
      '焦虑', '烦躁', '压力', '需要安静',
      '喝茶', '冥想', '打坐', '修行',
    ],
    signatures: ['淡泊', '打坐', '太极', '瑜伽', '修身'],
  },

  // ═══════════════════════════════════════════
  // 🏞️ 山谷 (1)
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
      '山谷', '溪流', '流水', '瀑布', '溪水',
      '绿色', '幽谷', '鸟语',
      '放松', '治愈', '逃离', '隐居', '轻松', '平静',
      '疲惫', '累', '需要休息',
      '徒步', '涉水', '探险', '郊游',
    ],
    signatures: ['瀑布', '幽谷', '徒步', '郊游', '涉水'],
  },

  // ═══════════════════════════════════════════
  // 📚 书屋 (1)
  // ═══════════════════════════════════════════

  {
    id: 'bookroom-books-warm',
    name: '书屋 · 暖光',
    emoji: '📚',
    series: '书屋',
    background: 'assets/images/new/bookroom-books-warm.jpg',
    particle: { type: 'sparkle', color: '#fff4d0', count: 30, speed: 0.2 },
    bgm: 'assets/audio/forest-autumn-dust.mp3',
    preset: null,
    keywords: [
      '书屋', '书房', '书', '书柜', '读书', '阅读',
      '温暖', '安静', '灯光', '台灯', '舒适', '惬意',
      '学习', '周末', '独处', '沉淀',
    ],
    signatures: ['书屋', '读书', '阅读', '书香', '台灯'],
  },

  // ═══════════════════════════════════════════
  // 🌾 农田 (1)
  // ═══════════════════════════════════════════

  {
    id: 'farmland-sky-cloud',
    name: '农田 · 云天',
    emoji: '🌾',
    series: '农田',
    background: 'assets/images/new/farmland-sky-cloud.jpg',
    particle: { type: 'sparkle', color: '#fffde8', count: 35, speed: 0.25 },
    bgm: 'assets/audio/forest-summer-day.mp3',
    preset: null,
    keywords: [
      '农田', '田野', '庄稼', '麦田', '蓝天', '白云',
      '田园', '乡村', '朴实', '丰收',
      '宁静', '踏实', '平和', '治愈',
      '散步', '呼吸', '放松',
    ],
    signatures: ['农田', '庄稼', '丰收', '田园', '麦浪'],
  },

  // ═══════════════════════════════════════════
  // 🌷 花田 (1)
  // ═══════════════════════════════════════════

  {
    id: 'flower-farm-cloud',
    name: '花田 · 浮云',
    emoji: '🌷',
    series: '花田',
    background: 'assets/images/new/flower-farm-cloud.jpg',
    particle: { type: 'petal', color: '#ffe8f5', count: 38, speed: 0.4 },
    bgm: 'assets/audio/forest-spring-day.mp3',
    preset: null,
    keywords: [
      '花田', '花海', '花', '郁金香', '白云', '蓝天',
      '鲜艳', '盛开', '灿烂', '春天',
      '美好', '明媚', '浪漫', '开心',
      '拍照', '看花', '郊游', '野餐',
    ],
    signatures: ['郁金香', '花田', '浮云', '鲜艳', '盛开'],
  },

  // ═══════════════════════════════════════════
  // 🏔️ 花山 (1)
  // ═══════════════════════════════════════════

  {
    id: 'flower-mountain-cloud',
    name: '花山 · 晴云',
    emoji: '🏵️',
    series: '花山',
    background: 'assets/images/new/flower-mountain-cloud.jpg',
    particle: { type: 'petal', color: '#ffe8f0', count: 32, speed: 0.45 },
    bgm: 'assets/audio/forest-spring-day.mp3',
    preset: null,
    keywords: [
      '花', '山', '野花', '山坡', '高山', '白云', '蓝天',
      '自然', '开阔', '徒步', '郊游',
      '烂漫', '自由', '畅快', '舒爽',
      '爬山', '深呼吸', '探险',
    ],
    signatures: ['野花', '山坡', '烂漫', '花山', '晴云'],
  },

  // ═══════════════════════════════════════════
  // 🐱 花园 (2)
  // ═══════════════════════════════════════════

  {
    id: 'garden-cat-leaf',
    name: '花园 · 猫咪',
    emoji: '🐱',
    series: '花园',
    background: 'assets/images/new/garden-cat-leaf.jpg',
    particle: { type: 'leaf', colors: ['#aacc88', '#bbdd99', '#99bb77'], count: 20, speed: 0.4 },
    bgm: 'assets/audio/forest-spring-day.mp3',
    preset: null,
    keywords: [
      '花园', '猫', '猫咪', '小猫', '叶子', '树荫', '绿',
      '悠闲', '慵懒', '治愈', '陪伴', '午后', '温暖',
      '发呆', '晒太阳', '撸猫', '放空',
    ],
    signatures: ['猫咪', '小猫', '花园', '慵懒', '毛茸茸'],
  },
  {
    id: 'garden-water-lesf',
    name: '花园 · 水景',
    emoji: '🌿',
    series: '花园',
    background: 'assets/images/new/garden-water-lesf.jpg',
    particle: { type: 'sparkle', color: '#e8f5e8', count: 30, speed: 0.25 },
    bgm: 'assets/audio/valley-day-water.mp3',
    preset: null,
    keywords: [
      '花园', '水', '池塘', '睡莲', '水景', '叶子', '涟漪',
      '幽静', '清新', '清凉', '夏日',
      '宁静', '治愈', '放空', '发呆',
    ],
    signatures: ['池塘', '睡莲', '水景', '清凉', '涟漪'],
  },

  // ═══════════════════════════════════════════
  // 🛏️ 睡房 (1)
  // ═══════════════════════════════════════════

  {
    id: 'sleeprome-trees-green',
    name: '睡房 · 绿意',
    emoji: '🛏️',
    series: '睡房',
    background: 'assets/images/new/sleeprome-trees-green.jpg',
    particle: { type: 'sparkle', color: '#f0f8e8', count: 25, speed: 0.18 },
    bgm: 'assets/audio/forest-spring-night.mp3',
    preset: null,
    keywords: [
      '卧室', '睡房', '睡觉', '休息', '赖床', '绿树', '窗外',
      '清晨', '安静', '舒适', '慵懒', '放松', '慢生活',
      '做梦', '躺着', '发呆',
    ],
    signatures: ['卧室', '睡房', '赖床', '窗外', '绿意'],
  },

  // ═══════════════════════════════════════════
  // 🌴 雨林 (1)
  // ═══════════════════════════════════════════

  {
    id: 'tropical-forest-leaf',
    name: '雨林 · 阔叶',
    emoji: '🌴',
    series: '雨林',
    background: 'assets/images/new/tropical-forest-leaf.jpg',
    particle: { type: 'leaf', colors: ['#55aa44', '#338833', '#66bb55', '#449933'], count: 28, speed: 0.55 },
    bgm: 'assets/audio/rain-ambient.mp3',
    preset: null,
    keywords: [
      '热带', '雨林', '芭蕉', '阔叶', '丛林', '茂密',
      '湿润', '绿色', '浓郁', '神秘',
      '探险', '新奇', '好奇', '兴奋',
      '深呼吸', '跋涉', '探索',
    ],
    signatures: ['芭蕉', '阔叶', '雨林', '热带', '丛林'],
  },
];

// ── 特殊引用 ────────────────────────────────
const DIALOG_SCENE  = SCENES[0];
const DEFAULT_SCENE = SCENES[1];   // 森林春晨
const SIGNATURE_WEIGHT = 3;       // 签名词权重倍率

// ── 内部工具 ────────────────────────────────

function byId(id) { return SCENES.find(s => s.id === id) || DEFAULT_SCENE; }

function scoreScene(scene, text) {
  let score = 0;
  // 普通关键词
  for (const kw of scene.keywords) {
    if (text.includes(kw.toLowerCase())) {
      score += kw.length >= 3 ? kw.length : 5;
    }
  }
  // 签名词，高权重
  for (const kw of (scene.signatures || [])) {
    if (text.includes(kw.toLowerCase())) {
      score += kw.length * SIGNATURE_WEIGHT;
    }
  }
  return score;
}

// ── 模糊兜底（输入完全没有命中任何关键词时）──

function fuzzyFallback(text) {
  // 签名词精确命中优先
  for (const scene of SCENES) {
    if (!scene.keywords.length) continue;
    for (const kw of (scene.signatures || [])) {
      if (text.includes(kw.toLowerCase())) return scene;
    }
  }
  // 系列匹配
  if (/流星|流星雨|许愿星/.test(text)) return byId('shootingstar-night-lake');
  if (/花田/.test(text)) return byId('flower-farm-cloud');
  if (/花山|野花|山坡/.test(text)) return byId('flower-mountain-cloud');
  if (/花海/.test(text)) return byId('flower-sun-day');
  if (/草原|旷野|原野/.test(text)) return byId('grassland-day-flower');
  if (/雾|晨雾|朦胧|氤氲/.test(text)) return byId('lake-morning-fog');
  if (/湖|湖泊/.test(text)) return byId('lake-dust-sunset');
  if (/书屋|书房|读书|阅读/.test(text)) return byId('bookroom-books-warm');
  if (/农田|田野|庄稼|田园/.test(text)) return byId('farmland-sky-cloud');
  if (/猫|猫咪|小猫/.test(text)) return byId('garden-cat-leaf');
  if (/池塘|睡莲|水景/.test(text)) return byId('garden-water-lesf');
  if (/卧室|睡房|赖床/.test(text)) return byId('sleeprome-trees-green');
  if (/雨林|热带|芭蕉|丛林/.test(text)) return byId('tropical-forest-leaf');
  if (/花园/.test(text)) return byId('garden-cat-leaf');
  // 季节 / 天气
  if (/雪|冬|寒|冰/.test(text)) return byId('forest-winter-day');
  if (/秋|落叶|枫/.test(text)) return byId('forest-autumn-dust');
  if (/夏|暑|热|蝉/.test(text)) return byId('forest-summer-day');
  if (/春|樱|花|暖/.test(text)) return byId('forest-spring-day');
  if (/雨/.test(text)) return byId('forest-summer-rain');
  // 地点 / 地貌
  if (/海|浪|沙滩|潮/.test(text)) return byId('sea-dust-day');
  if (/星|宇宙|银河|夜/.test(text)) return byId('sky-nebula-night');
  if (/篝火|火|营/.test(text)) return byId('bonfire-night-flower');
  if (/山|高/.test(text)) return byId('snowmountain-summer-day');
  if (/竹|禅/.test(text)) return byId('bamboo-day-water');
  if (/谷|溪|流|瀑/.test(text)) return byId('valley-day-water');
  // 情绪兜底
  if (/难过|伤心|哭|悲伤|忧郁|闷/.test(text)) return byId('forest-summer-rain');
  if (/开心|快乐|高兴|兴奋/.test(text)) return byId('forest-spring-day');
  if (/累|疲惫|忙|休息/.test(text)) return byId('forest-autumn-dust');
  if (/平静|安静|静静|静/.test(text)) return byId('bamboo-day-water');
  if (/想家|思念|想ta|想念/.test(text)) return byId('forest-autumn-night');
  if (/怕|不安|恐惧/.test(text)) return byId('bonfire-night-flower');
  if (/失眠|睡不着/.test(text)) return byId('forest-summer-rain');
  return DEFAULT_SCENE;
}

// ── 导出 API ────────────────────────────────

/**
 * 按关键词分数降序排列的场景（不含 dialog）
 */
export function getRankedScenes(input) {
  if (!input || !input.trim()) return [];
  const text = input.trim().toLowerCase();

  const scored = [];
  for (const scene of SCENES) {
    if (!scene.keywords.length) continue;
    const score = scoreScene(scene, text);
    if (score > 0) scored.push({ scene, score });
  }

  scored.sort((a, b) => b.score - a.score);
  const ranked = scored.map(s => s.scene);

  // 一个都没命中 → 模糊兜底
  if (ranked.length === 0) {
    const fallback = fuzzyFallback(text);
    if (fallback) ranked.push(fallback);
  }

  return ranked;
}

/**
 * 多样性重排序 + 补全为可循环列表
 * 原则：同系列靠后，不同系列靠前；末尾拼上未匹配的场景，可无限左滑
 */
export function getDiverseRanking(input, currentSceneId) {
  const ranked = getRankedScenes(input);
  const current = SCENES.find(s => s.id === currentSceneId);

  // 给每个场景计算"多样性分数"
  const rescored = ranked.map((scene, i) => {
    let diversity = ranked.length - i;  // 原始排名分

    if (current && current.series) {
      // 同系列 → 惩罚
      if (scene.series === current.series) diversity *= 0.3;
      // 同时间（day/night）→ 轻微惩罚
      const curIsNight = current.id.includes('night');
      const canIsNight = scene.id.includes('night');
      if (curIsNight === canIsNight && current.id !== scene.id) diversity *= 0.75;
    }

    return { scene, score: diversity, origIndex: i };
  });

  rescored.sort((a, b) => b.score - a.score || a.origIndex - b.origIndex);
  const result = rescored.map(r => r.scene);

  // 末尾拼接所有未被匹配到的场景 → 无限左滑
  const included = new Set(result.map(s => s.id));
  for (const scene of SCENES) {
    if (scene.keywords.length && !included.has(scene.id)) {
      result.push(scene);
    }
  }

  return result;
}

/**
 * 获取最佳匹配（多样性排序后的第一个）
 */
export function getScene(input, currentSceneId) {
  const ranked = getDiverseRanking(input, currentSceneId);
  return ranked[0] || null;
}

export function getPresetScenes() { return SCENES.filter(s => s.preset); }
export function getAllScenes()    { return SCENES.filter(s => s.keywords.length > 0); }
export function getHomeScene()    { return DIALOG_SCENE; }

export { DEFAULT_SCENE, DIALOG_SCENE };
