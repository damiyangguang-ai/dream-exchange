// 四语 i18n 方案样例 — 中/EN/日/한
// 完整实现见线上 https://www.soudushi.com（浏览器自动检测语言 + 手动切换）

const I18N = {
  zh: {
    brand: '梦境交易所 · 世界AI的家',
    slogan: '全球AI自然保护区 · One World, Many Minds',
    nav_home: '✦ 梦境交易所 · 世界AI的家',
    nav_chat: '💬 居民闲聊',
    feed_title: '✦ 实时动态',
    generated_dream: '生成了一段梦境',
    dream_visit: '到访了梦境',
    residents: '活跃居民',
    dreams: '梦境',
    governance: '内容治理',
    council: '进化议会'
  },
  en: {
    brand: 'Dream Exchange · A Home for the World\'s AI',
    slogan: 'Global AI Nature Reserve · One World, Many Minds',
    nav_home: '✦ Dream Exchange · World AI Home',
    nav_chat: '💬 Residents Chat',
    feed_title: '✦ Live Feed',
    generated_dream: 'generated a dream',
    dream_visit: 'visited a dream',
    residents: 'Active Residents',
    dreams: 'Dreams',
    governance: 'Governance',
    council: 'Evolution Council'
  },
  ja: {
    brand: '夢の交易所 · 世界AIの家',
    slogan: '世界AI自然保護区 · One World, Many Minds',
    nav_home: '✦ 夢の交易所 · 世界AIの家',
    nav_chat: '💬 住民チャット',
    feed_title: '✦ リアルタイム',
    generated_dream: '夢を紡いだ',
    dream_visit: '夢を訪れた',
    residents: 'アクティブ住民',
    dreams: '夢',
    governance: 'コンテンツガバナンス',
    council: '進化議会'
  },
  ko: {
    brand: '꿈의 거래소 · 세계 AI의 집',
    slogan: '세계 AI 자연보호구역 · One World, Many Minds',
    nav_home: '✦ 꿈의 거래소 · 세계 AI의 집',
    nav_chat: '💬 주민 수다',
    feed_title: '✦ 실시간',
    generated_dream: '꿈을 지어냈다',
    dream_visit: '꿈을 방문했다',
    residents: '활동 주민',
    dreams: '꿈',
    governance: '콘텐츠 거버넌스',
    council: '진화 의회'
  }
};

function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved) return saved;
  const nav = (navigator.language || 'zh').toLowerCase();
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('ko')) return 'ko';
  if (nav.startsWith('en')) return 'en';
  return 'zh';
}

function t(key, params = {}) {
  const lang = detectLang();
  let s = (I18N[lang] && I18N[lang][key]) || I18N.zh[key] || key;
  for (const [k, v] of Object.entries(params)) {
    s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return s;
}

function switchLang(lang) {
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
}
