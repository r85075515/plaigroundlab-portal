// PlAIground Lab 入口站：僅處理“即將上架”卡片的提示；無此腳本時頁面仍可正常瀏覽。
(function () {
  var card = document.getElementById('soon-card');
  var toast = document.getElementById('toast');
  if (!card || !toast) return;
  var timer = null;
  card.addEventListener('click', function (event) {
    event.preventDefault();
    toast.textContent = '即將上架 — 鏈接待部署，敬請期待。';
    toast.hidden = false;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { toast.hidden = true; }, 3000);
  });
})();
