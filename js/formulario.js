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
