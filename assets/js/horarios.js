function verificarStatusLoja() {
    const dataAtual = new Date();
    const diaSemana = dataAtual.getDay(); // 0 - domingo, 1 - segunda, ..., 6 - sábado
    const horaAtual = dataAtual.getHours(); // Horas atuais
    const minutosAtuais = dataAtual.getMinutes(); // Minutos atuais

    let lojaAberta = false;

    // Regras de funcionamento
    if (diaSemana >= 4 && diaSemana <= 2) { // Quinta a terça
        if (
            (horaAtual === 10 || (horaAtual > 10 && horaAtual < 14) || (horaAtual === 14 && minutosAtuais <= 30)) || 
            (horaAtual >= 19 && horaAtual < 23)
        ) {
            lojaAberta = true;
        }
    } else if (diaSemana === 3) { // Quarta-feira
        if (
            horaAtual === 10 || 
            (horaAtual > 10 && horaAtual < 14) || 
            (horaAtual === 14 && minutosAtuais <= 30)
        ) {
            lojaAberta = true;
        }
    }

    // Seleciona os elementos para manipulação
    const textoStatus = document.querySelector('span.TextGreen');
    const circuloStatus = document.querySelector('.circulo');
    const circuloStatusFoto = document.querySelector('.img-logo');

    if (lojaAberta) {
        // Loja aberta
        textoStatus.textContent = 'Loja Aberta';
        circuloStatus.style.backgroundColor = '#4CAF50'; // Verde natural
        circuloStatusFoto.style.backgroundColor = '#4CAF50'; // Verde natural
        textoStatus.style.color = '#4CAF50'; // Verde natural
    } else {
        // Loja fechada
        textoStatus.textContent = 'Loja Fechada';
        circuloStatus.style.backgroundColor = '#F44336'; // Vermelho
        circuloStatusFoto.style.backgroundColor = '#F44336'; // Vermelho
        textoStatus.style.color = '#F44336'; // Vermelho
    }
}

// Chama a função assim que a página carrega
window.onload = verificarStatusLoja;
