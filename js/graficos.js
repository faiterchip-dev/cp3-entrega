// Desenha, em <canvas>, um gráfico de barras simples com horas semanais
// dedicadas a cada área de estudo/interesse técnico.
// CP2: o gráfico se adapta à largura disponível e é redesenhado quando a
// janela muda de tamanho (girar o celular, redimensionar o navegador).
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

  var ink = '#4c5866';
  var accent = '#1c3f5f';
  var ochre = '#b5722f';
  var line = '#c3cdd4';

  function draw() {
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
});
