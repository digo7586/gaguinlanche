$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

    const ENDERECO_PIZZARIA = {
        endereco: 'Av Eugênia Fazanario Pedroso',
        numero: '287',
        bairro: 'Campo verde',
        cidade: 'Iracemápolis',
        uf: 'SP',
        cep: '13498-102',
        complemento: ''
    };

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;

var CELULAR_EMPRESA = '5519999429988';

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarBotaoReserva();
    }

}

cardapio.metodos = {

    // obtem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];

        // atualiza o texto conforme a categoria do menu escolhida

        let promoText = '';

        if (categoria === 'burgers') {
            promoText = 'Todas os lanches vão com ketchup e maionese';
        } /* else if (['pizzasCombo'].includes(categoria)) {
            promoText = 'Promoção válida para Segunda e Quinta-feira. Sabores salgados: Frango c/ Catupiry, Brócolis, Baiana, Calabresa, Milho e Tradicional.<br>Doces: Brigadeiro, Prestígio, Chocobana e Banana Nevada..'; */
       /*  } else if (['Pastel', 'pizzasSweetM', 'pizzasSweetG'].includes(categoria)) {
            promoText = 'Todas as pizzas doces vão com borda de chocolate.';
        } */
        
        $("#promoText").html(promoText);
        
        


        console.log(filtro);

        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${title}/g, e.title)
            .replace(/\${dsc}/g, e.dsc)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)

            // botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 16) {
                $("#itensCardapio").append(temp)
            }

            // paginação inicial (8 itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }

        })

        // remove o ativo
        $(".container-menu a").removeClass('active');

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active')

    }, 

    // clique no botão de ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');

    },

    // diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    // adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            // obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obtem a lista de itens
            let filtro = MENU[categoria];

            // obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                // validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                // caso já exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                // caso ainda não exista o item no carrinho, adiciona ele 
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }      
                
                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green')
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

            }

        }

    },

    // atualiza o badge de totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    // abrir a modal de carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }

    },

    // altera os texto e exibe os botões das etapas
    carregarEtapa: (etapa) => {
        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#entregaRetirada").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');
    
            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
    
            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }
    
        if (etapa == 2) {
            $("#lblTituloEtapa").text('Observação / Pagamento:');
            $("#itensCarrinho").addClass('hidden');
            $("#entregaRetirada").removeClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');
    
            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
    
            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
    
            // Lógica para desabilitar campos de endereço se "Retirada" estiver selecionado
            if (document.getElementById('retirada').checked) {
                document.getElementById('txtCEP').disabled = true;
                document.getElementById('txtEndereco').disabled = true;
                document.getElementById('txtBairro').disabled = true;
                document.getElementById('txtNumero').disabled = true;
                document.getElementById('txtCidade').disabled = true;
                document.getElementById('txtComplemento').disabled = true;
                document.getElementById('ddlUf').disabled = true;
            } else {
                // Caso contrário, habilita os campos de endereço
                document.getElementById('txtCEP').disabled = false;
                document.getElementById('txtEndereco').disabled = false;
                document.getElementById('txtBairro').disabled = false;
                document.getElementById('txtNumero').disabled = false;
                document.getElementById('txtCidade').disabled = false;
                document.getElementById('txtComplemento').disabled = false;
                document.getElementById('ddlUf').disabled = false;
            }
        }
    
        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#entregaRetirada").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');
    
            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');
    
            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }
    }
    ,

    // botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    // carrega a lista de itens do carrinho
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${dsc}/g, e.dsc)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                // último item
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }

            })

            let observacao = document.getElementById('obs').value;
            $('#obser').text(observacao);

        }
        else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
            cardapio.metodos.carregarValores();
        }

    },

    // diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }
        else {
            cardapio.metodos.removerItemCarrinho(id)
        }

    },

    // aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

    },

    // botão remover item do carrinho
    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();
        
    },

    // atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

        // atualiza os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();

    },

    // carrega os valores de SubTotal, Entrega e Total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }

        })

    },

    // carregar a etapa enderecos
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Seu carrinho está vazio.');
            return;
        }
    
        // Carrega a etapa 2 do processo
        cardapio.metodos.carregarEtapa(2);
    
        // Função para adicionar ou remover a obrigatoriedade dos campos de endereço com base na seleção
        const updateFieldRequirements = () => {
            const retiradaRadio = document.getElementById('retirada');
            const enderecoFields = [
                document.getElementById('txtCEP'),
                document.getElementById('txtEndereco'),
                document.getElementById('txtBairro'),
                document.getElementById('txtNumero'),
                document.getElementById('txtCidade'),
                document.getElementById('ddlUf')
            ];
    
            if (retiradaRadio.checked) {
                enderecoFields.forEach(field => field.removeAttribute('required'));
                
            }
        };
    
        // Adiciona eventos de mudança aos rádios após carregar a etapa 2
        document.addEventListener('DOMContentLoaded', function() {
            const retiradaRadio = document.getElementById('retirada');
    
            retiradaRadio.addEventListener('change', updateFieldRequirements);

            // Inicializa os campos com base na seleção atual
            updateFieldRequirements();
        });
    },
    

    // API ViaCEP
    buscarCep: () => {

        // cria a variavel com o valor do cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        // verifica se o CEP possui valor informado
        if (cep != "") {

            // Expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {

                        // Atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();

                    }
                    else {
                        cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                        $("#txtEndereco").focus();
                    }

                })

            }
            else {
                cardapio.metodos.mensagem('Formato do CEP inválido.');
                $("#txtCEP").focus();
            }

        }
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
        }

    },

    resumoPedido: () => {
        const radioRetirada = document.getElementById('retirada');
        const radioEntrega = document.getElementById('entrega');
        const radioDebito = document.getElementById('debito');
        const radioCredito = document.getElementById('credito');
        const radioPix = document.getElementById('pix');
        
        // Função para desabilitar ou habilitar campos com base na opção selecionada
        function toggleEnderecoFields() {
            const isRetiradaChecked = radioRetirada.checked;
            const camposEndereco = [
                'txtCEP', 'txtEndereco', 'txtBairro', 
                'txtNumero', 'txtCidade', 'txtComplemento', 'ddlUf'
            ];
    
            camposEndereco.forEach(id => {
                document.getElementById(id).disabled = isRetiradaChecked;
            });
    
            if (isRetiradaChecked) {
                document.getElementById('localEntrega').classList.add('hidden');
                $("#lblValorTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                MEU_ENDERECO = {};
                cardapio.metodos.carregarEtapa(3);
                cardapio.metodos.carregarResumo();
            } else {
                document.getElementById('localEntrega').classList.remove('hidden');
                const valorTotalComEntrega = VALOR_CARRINHO + VALOR_ENTREGA; // Adiciona a taxa de entrega
                $("#lblValorTotal").text(`R$ ${valorTotalComEntrega.toFixed(2).replace('.', ',')}`);
            }
        }
    
        // Inicializa o estado dos campos de endereço
        toggleEnderecoFields();
    
        // Adiciona um evento de mudança para os inputs de rádio
        radioRetirada.addEventListener('change', toggleEnderecoFields);
        radioEntrega.addEventListener('change', toggleEnderecoFields);
    
        // Verifica se a opção 'Retirada' está selecionada
        if (radioRetirada.checked) {
            return; // Interrompe a execução, pois a função toggleEnderecoFields já cuida do resto
        }
    
        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();
    
        // Validações dos campos de endereço
        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
            return;
        }
    
        if (endereco.length <= 0) {
            cardapio.metodos.mensagem('Informe o Endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }
    
        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o Bairro, por favor.');
            $("#txtBairro").focus();
            return;
        }
    
        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe a Cidade, por favor.');
            $("#txtCidade").focus();
            return;
        }
    
        if (uf == "-1") {
            cardapio.metodos.mensagem('Informe a UF, por favor.');
            $("#ddlUf").focus();
            return;
        }
    
        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o Número, por favor.');
            $("#txtNumero").focus();
            return;
        }
    
        // Armazena o endereço
        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        };
    
        // Captura a forma de pagamento selecionada
        let formaPagamento = '';
        if (radioDebito.checked) {
            formaPagamento = 'Débito';
        } else if (radioCredito.checked) {
            formaPagamento = 'Crédito';
        } else if (radioPix.checked) {
            formaPagamento = 'Pix';
        } else {
            cardapio.metodos.mensagem('Escolha uma forma de pagamento.');
            return;
        }
    
        // Exibe o resumo com forma de pagamento
        $("#formaPagamentoResumo").text(`Forma de pagamento: ${formaPagamento}`);
    
        // Atualiza o resumo com os dados do endereço
        let resumoEndereco = `${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero} - ${MEU_ENDERECO.bairro} - ${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf}`;
        $("#resumoEndereco").text(resumoEndereco);
    
        // Atualiza a etapa e carrega o resumo
        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();
    },
    
  // Carrega a etapa de Resumo do pedido
carregarResumo: () => {
    let nomeRetirada = document.getElementById('nomeCliente').value;
    let observacao = document.getElementById('obs').value;

    $("#listaItensResumo").html(''); // Limpa os itens do resumo

    // Exibe os itens do carrinho
    $.each(MEU_CARRINHO, (i, e) => {
        let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${dsc}/g, e.dsc)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${qntd}/g, e.qntd);

        $("#listaItensResumo").append(temp);
    });

    const enderecoFields = [
        document.getElementById('txtCEP'),
        document.getElementById('txtEndereco'),
        document.getElementById('txtBairro'),
        document.getElementById('txtNumero'),
        document.getElementById('txtCidade'),
        document.getElementById('ddlUf'),
        document.getElementById('txtComplemento')
    ];

    // Verifica se a opção 'Retirada' está selecionada
    if (document.getElementById('retirada').checked) {
        enderecoFields.forEach(field => field.value = ''); // Limpa os campos de endereço

        // Exibe o nome do cliente e a observação
        $('#obser').text(observacao);
        $('#nomeCli').text(nomeRetirada);

        // Atualiza o título para 'Endereço de retirada'
        $("#localEntregaOuRetirada").html('<b>Endereço retirada:</b>');

        // Exibe o endereço da pizzaria
        $("#resumoEndereco").html('Av Eugênia Fazanario Pedroso, n°287, Iracemápolis');
        $("#cidadeEndereco").html('Iracemápolis-SP');

        // Oculta o valor da entrega
        $("#valorEntrega").hide();

        // Atualiza o total sem o valor da entrega
        $("#lblValorTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);

        // Limpa o formulário de endereço
        enderecoFields.forEach(field => $(field).val(''));

        // Mostra a seção de endereço da pizzaria
        $("#resumoEndereco").show();
        $("#cidadeEndereco").show();

    } else {
        // Exibe o nome do cliente
        $('#obser').text(observacao);
        $('#nomeCli').text(nomeRetirada);

        // Exibe o endereço fornecido pelo cliente
        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

        // Atualiza o valor total com entrega
        $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);

        // Atualiza o título para 'Local da Entrega'
        $("#localEntregaOuRetirada").html('<b>Local da entrega:</b>');

        // Mostra a seção de endereço do cliente
        $("#resumoEndereco").show();
        $("#cidadeEndereco").show();
    }

    // Captura a forma de pagamento selecionada
    let formaPagamento = '';
    if (document.getElementById('debito').checked) {
        formaPagamento = 'Débito';
    } else if (document.getElementById('credito').checked) {
        formaPagamento = 'Crédito';
    } else if (document.getElementById('pix').checked) {
        formaPagamento = 'Pix';
    } else {
        formaPagamento = 'Não selecionado';
    }

    // Exibe a forma de pagamento no resumo
    $("#formaPagamentoResumo").text(`Forma de pagamento: ${formaPagamento}`);

    // Finaliza o pedido
    cardapio.metodos.finalizarPedido();
},




   // Atualiza o link do botão do WhatsApp
finalizarPedido: () => {
    let nomeRetirada = document.getElementById('nomeCliente').value.trim(); // Remove espaços em branco
    let observacao = document.getElementById('obs').value.trim(); // Remove espaços em branco

    if (MEU_CARRINHO.length > 0) {

        // Cria a mensagem inicial com o nome do cliente
        var texto = `Olá! Me chamo ${nomeRetirada} e gostaria de fazer um pedido:`;
        texto += `\n\n*Itens do pedido:*\n`;

        var itens = '';


        $.each(MEU_CARRINHO, (i, e) => {
            itens += `*${e.qntd}x* ${e.name} ${e.dsc} .. R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

            // Último item
            if ((i + 1) == MEU_CARRINHO.length) {
                texto += itens; // Adiciona os itens ao texto

                 // Adiciona a observação
                if (observacao) {
                    texto += `\n\n*Observação:* ${observacao}`;
                }

                // Verifica se é retirada ou entrega
                if (document.getElementById('retirada').checked) {
                    // Se 'Retirada' estiver selecionado, mostra o endereço da pizzaria
                    texto += '\n\n*Vou retirar*';

                    // Total sem valor da entrega
                    texto += `\n\n*Total: R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}*`;
                } else {
                    // Se 'Entrega' estiver selecionado, mostra o endereço do cliente
                    texto += '\n\n*Endereço de entrega:*';
                    texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
                    texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;

                    // Total com valor da entrega
                    texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;
                }

                // Captura a forma de pagamento
                let formaPagamento = '';
                if (document.getElementById('debito').checked) {
                    formaPagamento = 'Débito';
                } else if (document.getElementById('credito').checked) {
                    formaPagamento = 'Crédito';
                } else if (document.getElementById('pix').checked) {
                    formaPagamento = 'Pix';
                } else {
                    formaPagamento = 'Não selecionado';
                }

                // Adiciona a forma de pagamento ao texto
                texto += `\n\n*Forma de pagamento: ${formaPagamento}*`;

                // Converte a URL
                let encode = encodeURI(texto);
                let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                // Atualiza o botão com o link do WhatsApp
                $("#btnEtapaResumo").attr('href', URL);
            }
        });

    } else {
        console.log("Nenhum item no carrinho.");
    }
},


    
    // carrega o link do botão reserva
    carregarBotaoReserva: () => {

        var texto = 'Olá! gostaria de fazer uma *reserva*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },

    abrirWhatsapp: () => {

        var texto = 'Olá! gostaria poderia me da uma informação';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnzap").attr('href', URL);

    },

    // carrega o botão de ligar
    carregarBotaoLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);

    },

    // abre o depoimento
    abrirDepoimento: (depoimento) => {

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    // mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)

    }

}

cardapio.templates = {

    item: `
        <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
            <div class="card card-item" id="\${id}">
                 <div class="img-produto">
                    <img src="\${img}" />
                </div>
                <p class="title-produto text-center mt-2">
                    <b>\${nome}</b>
                </p>
                <p class="description text-start">
                \${title} 
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${preco}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
            
                <p class="title-produto"><b> \${nome}</b> \${dsc}</p>
                <p class="price-produto"><b>R$ \${preco}</b><sub>un</sub></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
    `,

    itemResumo: `
        <div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${nome}</b> \${dsc}
                </p>
                <p class="price-produto-resumo">
                    <b>R$ \${preco}</b>
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
        </div>
    `

}
