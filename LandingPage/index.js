const botao = document.getElementById('CriarConta');

botao.addEventListener('mouseover', () => {
    console.log('teste');
    botao.style.backgroundColor = '#81da54';
});

botao.addEventListener('mouseout', () => {
    botao.style.backgroundColor = ''
})

