let tabAtual = 0;
let destinatarioAtual = { nome: "", chave: "" };
let valorPixSelecionado = "0,00";
let saldoVisivel = true;
let saldoAtual = 12847.35;

const campoValor = document.getElementById('campoValor');
const areaDest = document.getElementById('areaDestinatario');
const destNomeSpan = document.getElementById('destNome');
const destChaveSpan = document.getElementById('destChave');
const descricaoInput = document.getElementById('descricaoPix');

function formatarDinheiro(input) {
    let raw = input.value.replace(/\D/g, '');
    if (raw === "") {
        input.value = "";
        return;
    }
    let numero = parseInt(raw, 10) / 100;
    if (isNaN(numero)) numero = 0;
    let formatado = numero.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    input.value = formatado;
}

function selecionarChavePix(elemento, tipo, chave, nomePessoa) {
    document.querySelectorAll('.chave-item').forEach(el => {
        el.classList.remove('chave-selecionada');
        el.style.background = "white";
    });
    elemento.classList.add('chave-selecionada');
    elemento.style.background = "#fff2f5";
            
    destinatarioAtual.nome = nomePessoa;
    destinatarioAtual.chave = chave;
            
    destNomeSpan.innerText = nomePessoa;
    destChaveSpan.innerText = chave;
    areaDest.style.display = "block";
}

function validarChavePix(input) {
    const chave = input.value.trim();
    const erroDiv = document.getElementById('erroChave');
    const textoErro = document.getElementById('textoErro');
    let isValido = false;
    let tipo = "";

    if (chave === "") {
        erroDiv.style.display = "none";
        limparDestinatario();
        return;
        }

    const regexCPF = /^(\d{3})\.?(\d{3})\.?(\d{3})-?(\d{2})$/;
    if (regexCPF.test(chave)) {
        isValido = true;
        tipo = "CPF";
    }
            
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regexEmail.test(chave)) {
        isValido = true;
        tipo = "E-mail";
    }
            
    const regexTelefone = /^(\(\d{2}\)\s?)?(\d{4,5})-?(\d{4})$/;
    if (regexTelefone.test(chave)) {
        isValido = true;
        tipo = "Telefone";
    }
            
    const regexAleatorio = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    if (regexAleatorio.test(chave)) {
        isValido = true;
        tipo = "Chave Aleatória";
    }

    if (isValido) {
        erroDiv.style.display = "none";
        destinatarioAtual.nome = tipo;
        destinatarioAtual.chave = chave;
        destNomeSpan.innerText = tipo;
        destChaveSpan.innerText = chave;
        areaDest.style.display = "block";
        input.style.borderColor = "#10b981";
        input.style.backgroundColor = "#f0fdf4";
    } else {
        erroDiv.style.display = "block";
        textoErro.innerText = "Formato inválido. Use: CPF, E-mail, Telefone ou Chave Aleatória";
        input.style.borderColor = "#dc2626";
        input.style.backgroundColor = "#fef2f2";
        limparDestinatario();
    }
}

function limparDestinatario() {
    areaDest.style.display = "none";
    destinatarioAtual = { nome: "", chave: "" };
    document.querySelectorAll('.chave-item').forEach(el => {
        el.classList.remove('chave-selecionada');
        el.style.background = "white";
    });
}

function buscarContatoManual() {
    let nomeDigitado = prompt("Digite o nome ou chave Pix do destinatário:");
    if (nomeDigitado && nomeDigitado.trim() !== "") {
        destinatarioAtual.nome = nomeDigitado;
        destinatarioAtual.chave = "Chave informada manualmente";
        destNomeSpan.innerText = nomeDigitado;
        destChaveSpan.innerText = "Chave manual";
        areaDest.style.display = "block";
        document.querySelectorAll('.chave-item').forEach(el => {
            el.classList.remove('chave-selecionada');
            el.style.background = "white";
        });
    }
}

function abrirModalConfirmacao() {
    let valor = campoValor.value;
    if (!valor || parseFloat(valor.replace(',','.')) <= 0) {
        alert("Por favor, digite um valor válido (ex: 10,50)");
        return;
    }
    if (!destinatarioAtual.nome) {
        alert("Selecione ou informe um destinatário para o Pix");
        return;
    }
    document.getElementById('modalValor').innerText = "R$ " + valor;
    document.getElementById('modalDestinatario').innerText = destinatarioAtual.nome;
    let desc = descricaoInput.value.trim() === "" ? "Sem descrição" : descricaoInput.value;
    document.getElementById('modalDescricao').innerText = desc;
            
    document.getElementById('modalConfirm').classList.add('show');
}

function fecharModal() {
    document.getElementById('modalConfirm').classList.remove('show');
}

function executarPix() {
    let valorNumerico = parseFloat(campoValor.value.replace(',','.'));
    if (isNaN(valorNumerico)) valorNumerico = 0;
    if (saldoAtual >= valorNumerico && valorNumerico > 0) {
        saldoAtual = saldoAtual - valorNumerico;
        atualizarSaldoNaTela();
        fecharModal();
        document.getElementById('telaSucesso').classList.add('abrir');
        campoValor.value = "";
        descricaoInput.value = "";
        limparDestinatario();
    } else {
        alert("Saldo insuficiente ou valor inválido!");
        fecharModal();
    }
}

function atualizarSaldoNaTela() {
    let saldoEl = document.getElementById('saldoValor');
    if (saldoVisivel) {
        saldoEl.innerText = "R$ " + saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
        saldoEl.innerText = "R$ ••••,••";
    }
}

function alternarVisibilidadeSaldo() {
    saldoVisivel = !saldoVisivel;
    atualizarSaldoNaTela();
    let btn = document.querySelector('.saldo-box button');
    if (btn) btn.innerHTML = saldoVisivel ? '<i class="fa-regular fa-eye"></i> Ocultar' : '<i class="fa-regular fa-eye-slash"></i> Mostrar';
}

function fecharTelaSucesso() {
    document.getElementById('telaSucesso').classList.remove('abrir');
}

function mudarTab(tab) {
    tabAtual = tab;
    const elEnviar = document.getElementById('conteudoEnviar');
    const elChaves = document.getElementById('conteudoChaves');
    const elHistorico = document.getElementById('conteudoHistorico');
    elEnviar.style.display = 'none';
    elChaves.style.display = 'none';
    elHistorico.style.display = 'none';
    if (tab === 0) elEnviar.style.display = 'block';
    if (tab === 1) elChaves.style.display = 'block';
    if (tab === 2) elHistorico.style.display = 'block';

    const btnEnviar = document.getElementById('tabEnviar');
    const btnChaves = document.getElementById('tabChaves');
    const btnHistorico = document.getElementById('tabHistorico');
    btnEnviar.classList.remove('tab-active');
    btnChaves.classList.remove('tab-active');
    btnHistorico.classList.remove('tab-active');
    if (tab === 0) btnEnviar.classList.add('tab-active');
    if (tab === 1) btnChaves.classList.add('tab-active');
    if (tab === 2) btnHistorico.classList.add('tab-active');
}

function cadastrarChaveNova() {
    let tipo = prompt("Qual tipo de chave?\n1 - Celular\n2 - E-mail\n3 - CPF\n4 - Aleatória");
    if (tipo) {
        alert("Chave cadastrada com sucesso! (Simulação)");
    }
}

window.onload = function() {
    mudarTab(0);
    atualizarSaldoNaTela();
    console.log("Página Bradesco Pix carregada — versão com ajustes manuais");
};
