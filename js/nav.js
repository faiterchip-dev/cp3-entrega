// Marca o item de menu correspondente à página atual
document.addEventListener('DOMContentLoaded', function () {
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current) {
      link.setAttribute('aria-current', 'page');
    }
  });
});
