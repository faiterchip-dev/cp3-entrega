/* =========================================================
   Felipe Gomes — site pessoal
   Todo o JavaScript do site em um único arquivo.
   Recursos com localStorage: tema claro/escuro e mensagens do formulário.
   ========================================================= */
(function () {
  'use strict';

/* ---------- Utilitários de localStorage ---------- */
// Todo acesso ao localStorage passa por aqui, com try/catch: em modo anônimo
// restrito ou com o armazenamento bloqueado, o site continua funcionando.
function lerStorage(chave, padrao) {
  try {
    var bruto = window.localStorage.getItem(chave);
    return bruto === null ? padrao : JSON.parse(bruto);
  } catch (erro) {
    return padrao;
  }
}

function salvarStorage(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    return false;
  }
}

/* ---------- Tema claro/escuro (salvo no localStorage) ---------- */
var CHAVE_TEMA = 'fg_tema';

function temaInicial() {
  var salvo = lerStorage(CHAVE_TEMA, null);
  if (salvo === 'dark' || salvo === 'light') return salvo;
  // Sem preferência salva: segue a configuração do sistema
  var escuroNoSistema = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return escuroNoSistema ? 'dark' : 'light';
}

function temaAtual() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

// Roda já no <head>, antes de a página aparecer, para não "piscar" o tema errado
document.documentElement.setAttribute('data-theme', temaInicial());

document.addEventListener('DOMContentLoaded', function () {
  var botao = document.getElementById('theme-toggle');
  if (!botao) return;

  function atualizarBotao() {
    botao.setAttribute('aria-pressed', String(temaAtual() === 'dark'));
  }
  atualizarBotao();

  botao.addEventListener('click', function () {
    var novo = temaAtual() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', novo);
    salvarStorage(CHAVE_TEMA, novo);
    atualizarBotao();
    // Avisa o resto do site (o gráfico em canvas precisa redesenhar com as novas cores)
    document.dispatchEvent(new CustomEvent('temamudou'));
  });
});

/* ---------- Menu: marca a página atual ---------- */
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

/* ---------- Formulário de contato ---------- */
// Envio simulado do formulário de contato (sem backend nesta demonstração)
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var nome = document.getElementById('nome').value.trim();
    status.textContent = 'Obrigado, ' + nome + '! Sua mensagem foi registrada nesta demonstração — em um site real, ela seria enviada por e-mail ou salva em um servidor.';
    status.classList.add('visible');
    form.reset();
    status.focus();
  });
});

/* ---------- Gráfico de barras em canvas ---------- */
// Horas semanais dedicadas a cada área de estudo/interesse técnico.
// Adapta-se à largura disponível, redesenha ao redimensionar a janela e
// usa as cores do tema atual (claro ou escuro).
document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('hobby-chart');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');

  var data = [
    { label: 'Linux', curto: 'Linux', horas: 7 },
    { label: 'Segurança', curto: 'Segur.', horas: 9 },
    { label: 'Redes', curto: 'Redes', horas: 5 },
    { label: 'Scripting', curto: 'Script', horas: 6 },
    { label: 'Leitura téc.', curto: 'Leitura', horas: 4 }
  ];

  // Lê uma variável de cor do CSS (muda conforme o tema)
  function cor(nome) {
    return window.getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
  }

  function draw() {
    var ink = cor('--ink-soft');
    var accent = cor('--accent');
    var ochre = cor('--ochre');
    var line = cor('--line');

    // Largura real exibida (o CSS faz o canvas ocupar 100% do card)
    var displayWidth = canvas.clientWidth || 640;
    var displayHeight = displayWidth < 420 ? 260 : 320;
    var small = displayWidth < 420;

    // Resolução interna ajustada ao tamanho exibido (telas de alta densidade)
    var ratio = window.devicePixelRatio || 1;
    canvas.width = displayWidth * ratio;
    canvas.height = displayHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    var padding = { top: 24, right: small ? 10 : 20, bottom: 40, left: small ? 34 : 40 };
    var chartWidth = displayWidth - padding.left - padding.right;
    var chartHeight = displayHeight - padding.top - padding.bottom;
    var maxValue = Math.max.apply(null, data.map(function (d) { return d.horas; })) + 2;
    var barGap = small ? 10 : Math.min(28, Math.round(chartWidth * 0.04));
    var barWidth = (chartWidth - barGap * (data.length - 1)) / data.length;

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Linhas guia horizontais
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.font = (small ? '11px' : '12px') + ' "Work Sans", sans-serif';
    ctx.fillStyle = ink;
    ctx.textAlign = 'start';
    var steps = 4;
    for (var s = 0; s <= steps; s++) {
      var value = Math.round((maxValue / steps) * s);
      var y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(displayWidth - padding.right, y);
      ctx.stroke();
      ctx.fillText(value + 'h', 4, y + 4);
    }

    // Barras
    data.forEach(function (d, i) {
      var barHeight = (d.horas / maxValue) * chartHeight;
      var x = padding.left + i * (barWidth + barGap);
      var y = padding.top + chartHeight - barHeight;

      ctx.fillStyle = i === 2 ? ochre : accent;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barHeight, 4);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();

      ctx.fillStyle = ink;
      ctx.textAlign = 'center';

      // Valor acima da barra
      ctx.fillText(d.horas + 'h', x + barWidth / 2, y - 8);

      // Rótulo abaixo da barra (versão curta quando falta espaço)
      var texto = barWidth < 70 ? d.curto : d.label;
      ctx.fillText(texto, x + barWidth / 2, displayHeight - padding.bottom + 18);
    });

    ctx.textAlign = 'start';
  }

  draw();

  // Redesenha ao redimensionar / girar o aparelho (com um pequeno atraso)
  var timer = null;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(draw, 120);
  });

  // Redesenha quando o tema claro/escuro muda
  document.addEventListener('temamudou', draw);
});

})();
