/* Crédito discreto do desenvolvedor — incluído em todas as páginas */
(function () {
  function addGhostCredit() {
    if (document.getElementById('ghosthszz-credit')) return;

    var credit = document.createElement('div');
    credit.id = 'ghosthszz-credit';
    credit.innerHTML = '<a href="https://ghosthszz.shop" target="_blank" rel="noopener noreferrer">making by ghosthszz</a>';

    credit.style.cssText = [
      'display:block',
      'width:100%',
      'box-sizing:border-box',
      'padding:14px 12px 18px',
      'margin:0',
      'text-align:center',
      'font-size:12px',
      'line-height:1.5',
      'font-weight:400',
      'letter-spacing:.2px',
      'color:#8490a0',
      'background:#071326'
    ].join(';');

    var link = credit.querySelector('a');
    link.style.cssText = 'color:inherit;text-decoration:none;transition:color .2s ease';
    link.addEventListener('mouseenter', function () { link.style.color = '#f59e0b'; });
    link.addEventListener('mouseleave', function () { link.style.color = 'inherit'; });

    document.body.appendChild(credit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addGhostCredit, { once: true });
  } else {
    addGhostCredit();
  }
})();
