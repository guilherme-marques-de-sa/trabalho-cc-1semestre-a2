function formatarCPF(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length <= 11) {
        if (valor.length > 9) {
            valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
        } else if (valor.length > 6) {
            valor = valor.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
        } else if (valor.length > 3) {
            valor = valor.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
        }
        input.value = valor;
    }
}

function formatarCelular(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length >= 2) {
        if (valor.length <= 10) {
            valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
    }
    input.value = valor;
}

function formatarMoeda(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor === "") {
        input.value = "";
        return;
    }
    let numero = parseInt(valor, 10) / 100;
    if (isNaN(numero)) numero = 0;
    input.value = numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

let usuarioLogado = {
    nome: "",
    cpf: "",
    email: ""
};

const screenCadastro = document.getElementById('screen-cadastro');
const screenSuccess = document.getElementById('screen-success');
const screenPix = document.getElementById('screen-pix');

function mostrarTela(telaId) {
    screenCadastro.style.display = 'none';
    screenSuccess.style.display = 'none';
    screenPix.style.display = 'none';
    if (telaId === 'cadastro') screenCadastro.style.display = 'block';
    else if (telaId === 'success') screenSuccess.style.display = 'block';
    else if (telaId === 'pix') screenPix.style.display = 'block';
}

function validarFormulario() {
    let valido = true;
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

    const nome = document.getElementById('nomeCompleto').value.trim();
    if (nome === "") {
        document.getElementById('error-nome').style.display = 'block';
        valido = false;
    }

    const cpfRaw = document.getElementById('cpfInput').value.replace(/\D/g, '');
    if (cpfRaw.length !== 11) {
        document.getElementById('error-cpf').style.display = 'block';
        valido = false;
    }

    const dataNasc = document.getElementById('dataNasc').value;
    if (!dataNasc) {
        document.getElementById('error-data').style.display = 'block';
        valido = false;
    } else {
        const hoje = new Date();
        const nasc = new Date(dataNasc);
        let idade = hoje.getFullYear() - nasc.getFullYear();
        const mes = hoje.getMonth() - nasc.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
        if (idade < 18 || idade > 110) {
            document.getElementById('error-data').innerText = "Você precisa ter 18 anos ou mais";
            document.getElementById('error-data').style.display = 'block';
            valido = false;
        }
    }

    const celularRaw = document.getElementById('celularInput').value.replace(/\D/g, '');
    if (celularRaw.length < 10 || celularRaw.length > 11) {
        document.getElementById('error-celular').style.display = 'block';
        valido = false;
    }

    const email = document.getElementById('emailInput').value.trim();
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(email)) {
        document.getElementById('error-email').style.display = 'block';
        valido = false;
    }

    const senha = document.getElementById('senhaInput').value;
    if (senha.length < 6) {
        document.getElementById('error-senha').style.display = 'block';
        valido = false;
    }

    return valido;
}

const formCadastro = document.getElementById('form-cadastro');
formCadastro.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
    const cpfFormatado = document.getElementById('cpfInput').value;
    const emailUser = document.getElementById('emailInput').value.trim();

    usuarioLogado.nome = nomeCompleto;
    usuarioLogado.cpf = cpfFormatado;
    usuarioLogado.email = emailUser;

    const primeiroNome = nomeCompleto.split(' ')[0];
    document.getElementById('mensagemBoasVindas').innerHTML = `Olá, ${primeiroNome}! <i class="fas fa-smile-wink"></i>`;

    mostrarTela('success');
});

function voltarParaCadastroCompleto() {
    document.getElementById('form-cadastro').reset();
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    usuarioLogado = { nome: "", cpf: "", email: "" };
    mostrarTela('cadastro');
}

const btnVoltarSuccess = document.getElementById('btnVoltarCadastroSuccess');
btnVoltarSuccess.addEventListener('click', voltarParaCadastroCompleto);

const btnIrPix = document.getElementById('btnIrPix');
btnIrPix.addEventListener('click', function() {
    window.location.href = 'pg-pix.html';
});

const btnSairPix = document.getElementById('btnSairPix');
btnSairPix.addEventListener('click', function() {
    voltarParaCadastroCompleto();
});

const btnEnviarPix = document.getElementById('btnEnviarPix');
const valorInput = document.getElementById('valorPix');

function getValorNumerico() {
    let valorStr = valorInput.value.replace(/\./g, '').replace(',', '.');
    let numero = parseFloat(valorStr);
    if (isNaN(numero)) numero = 0;
    return numero;
}

btnEnviarPix.addEventListener('click', function() {
    let valorNumerico = getValorNumerico();
    if (valorNumerico <= 0) {
        document.getElementById('pix-error').innerText = "Digite um valor maior que zero (ex: 10,50)";
        document.getElementById('pix-error').style.display = 'block';
        return;
    }
    if (valorNumerico > 5000) {
        document.getElementById('pix-error').innerText = "Limite para esta simulação: R$ 5.000,00";
        document.getElementById('pix-error').style.display = 'block';
        return;
    }
    document.getElementById('pix-error').style.display = 'none';

    const valorFormatado = valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const confirmar = confirm(`Enviar Pix de ${valorFormatado} para algum contato? (SIMULAÇÃO)\n\nClique em OK para confirmar.`);
    if (confirmar) {
        alert(`✅ Pix de ${valorFormatado} enviado com sucesso!\n\nTransação concluída. Você receberá o comprovante por e-mail.`);
        valorInput.value = "";
    }
});

const cpfField = document.getElementById('cpfInput');
const celularField = document.getElementById('celularInput');
const valorPixField = document.getElementById('valorPix');

if (cpfField) {
    cpfField.addEventListener('keyup', function() { formatarCPF(cpfField); });
    cpfField.addEventListener('blur', function() {
        let raw = cpfField.value.replace(/\D/g, '');
        if (raw.length !== 11 && raw.length > 0) {
            document.getElementById('error-cpf').style.display = 'block';
        } else {
            document.getElementById('error-cpf').style.display = 'none';
        }
    });
}
if (celularField) {
    celularField.addEventListener('keyup', function() { formatarCelular(celularField); });
    celularField.addEventListener('blur', function() {
        let raw = celularField.value.replace(/\D/g, '');
        if (raw.length < 10 || raw.length > 11) {
            document.getElementById('error-celular').style.display = 'block';
        } else {
            document.getElementById('error-celular').style.display = 'none';
        }
    });
}
if (valorPixField) {
    valorPixField.addEventListener('input', function() {
        let raw = valorPixField.value.replace(/\D/g, '');
        if (raw === "") {
            valorPixField.value = "";
            return;
        }
        let numero = parseInt(raw, 10) / 100;
        if (!isNaN(numero)) {
            valorPixField.value = numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
    });
}

const nomeInput = document.getElementById('nomeCompleto');
const emailInput = document.getElementById('emailInput');
const senhaInput = document.getElementById('senhaInput');
const dataInput = document.getElementById('dataNasc');

if (nomeInput) {
    nomeInput.addEventListener('input', function() {
        if (nomeInput.value.trim() !== "") document.getElementById('error-nome').style.display = 'none';
    });
}
if (emailInput) {
    emailInput.addEventListener('input', function() {
        const eml = emailInput.value.trim();
        const regex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        if (regex.test(eml)) document.getElementById('error-email').style.display = 'none';
            else if (eml === "") {}
            else document.getElementById('error-email').style.display = 'none';
        });
}
if (senhaInput) {
    senhaInput.addEventListener('input', function() {
        if (senhaInput.value.length >= 6) document.getElementById('error-senha').style.display = 'none';
    });
}
if (dataInput) {
    dataInput.addEventListener('change', function() {
        document.getElementById('error-data').style.display = 'none';
    });
}

window.addEventListener('load', function() {
    mostrarTela('cadastro');
});
