// Portal 05: language toggle (no reload) + coming-soon toast.
// No page content is created by this script; every string below already
// exists in index.html as a data-zh / data-en pair.
(function () {
  var currentLang = 'zh-Hant';
  var toastTexts = {
    gpu: {
      'zh-Hant': 'GPU 礦場大亨即將上架 — 連結待部署，敬請期待。',
      en: 'GPU Tycoon is coming soon — the link is not deployed yet.'
    },
    blog: {
      'zh-Hant': 'Blog 即將上架 — 預告位先放在這裡，敬請期待。',
      en: 'Blog is coming soon — this is a preview slot for now.'
    }
  };
  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-zh]').forEach(function (el) {
      var text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh');
      if (text !== null) el.textContent = text;
    });
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.getAttribute('data-lang')); });
  });
  var toast = document.getElementById('toast');
  var timer = null;
  document.querySelectorAll('.soon-card').forEach(function (card) {
    card.addEventListener('click', function (event) {
      event.preventDefault();
      if (!toast) return;
      toast.textContent = toastTexts[card.getAttribute('data-soon')][currentLang];
      toast.hidden = false;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { toast.hidden = true; }, 3000);
    });
  });
})();
