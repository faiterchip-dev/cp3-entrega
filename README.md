# Felipe Gomes — Site pessoal

Site pessoal / portfólio feito para o projeto individual (HTML, CSS e JavaScript puros, sem frameworks).

- **Site publicado:** https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
- **Repositório:** https://github.com/faiterchip-dev/cp3-entrega

## Páginas

| Página | O que tem |
| --- | --- |
| `index.html` | Início: apresentação, interesses e links para as outras páginas |
| `curriculo.html` | Formação, experiência e tabela de habilidades |
| `formulario.html` | Contato: formulário com validação e histórico de mensagens |
| `multimidia.html` | Vídeo, áudio e mapa |
| `graficos.html` | Gráfico de barras em `<canvas>` e ilustração em SVG |

## Estrutura

```
.
├── index.html
├── curriculo.html
├── formulario.html
├── multimidia.html
├── graficos.html
├── css/
│   └── estilos.css    # CSS responsivo (mobile-first), tema claro e escuro
└── js/
    └── scripts.js     # menu ativo, tema, formulário e gráfico
```

## Features interativas (JavaScript + localStorage)

1. **Tema claro/escuro** — o botão "Tema escuro" no menu alterna o tema. A escolha fica salva
   no `localStorage` (chave `fg_tema`) e vale em todas as páginas e nas próximas visitas. Na
   primeira visita, o site segue a preferência do sistema. O gráfico em canvas é redesenhado
   com as cores do tema.
2. **Formulário de contato com histórico** — validação campo a campo (nome e sobrenome, e-mail
   válido, telefone opcional com 10 ou 11 dígitos, assunto, mensagem com no mínimo 10
   caracteres), com mensagens de erro ao lado de cada campo e aviso de sucesso ou erro após o
   envio. As mensagens enviadas ficam salvas no `localStorage` (chave `fg_mensagens`, até 20
   itens) e aparecem em uma lista ao lado do formulário, com opção de remover uma a uma ou
   apagar todas. O site não tem servidor: nada é enviado para fora do navegador.

## Como rodar localmente

Abra o `index.html` no navegador, ou, para simular um servidor:

```
python3 -m http.server 8000
```

e acesse http://localhost:8000.

## Publicação

O site é publicado com **GitHub Pages** (branch `main`, pasta raiz), que serve as páginas por HTTPS.
Todos os links internos são relativos, então funcionam tanto localmente quanto na URL pública.

## Entrega

A versão do CP3 está marcada com a tag `cp3-entrega`.
