// Função para verificar se a loja está aberta ou fechada
function verificarStatusLoja() {
    const dataAtual = new Date();
    const diaSemana = dataAtual.getDay(); // 0 - domingo, 1 - segunda, ..., 6 - sábado
    const horaAtual = dataAtual.getHours(); // Horário atual

    // Verifica se o dia e horário estão dentro do funcionamento da loja (quinta a terça das 19h às 23h)
    const lojaAberta = diaSemana !== 3; // Se não for quarta, a loja está aberta

    const dentroHorario = horaAtual >= 19 && horaAtual <= 23; // Das 19h às 23h

    const statusLoja = lojaAberta && dentroHorario; // Loja está aberta se ambos forem verdadeiros

    // Seleciona o elemento de texto e o círculo
    const textoStatus = document.querySelector('span.TextGreen');
    const circuloStatus = document.querySelector('.circulo');
    const circuloStatusFoto = document.querySelector('.img-logo');

    if (statusLoja) {
        // Se estiver aberta
        textoStatus.textContent = 'Loja Aberta';
        circuloStatus.style.backgroundColor = '#4CAF50'; // Verde natural
        circuloStatusFoto.style.backgroundColor = '#4CAF50'; // Verde natural
        textoStatus.style.color = '#4CAF50'; // Verde natural
    } else {
        // Se estiver fechada
        textoStatus.textContent = 'Loja Fechada';
        circuloStatus.style.backgroundColor = '#F44336'; // Vermelho
        circuloStatusFoto.style.backgroundColor = '#F44336'; // Vermelho
        textoStatus.style.color = '#F44336'; // Vermelho
    }
    return statusLoja;
}

// Chama a função assim que a página carrega
window.onload = verificarStatusLoja;
