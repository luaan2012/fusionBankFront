export function validarCPF(cpf) {
  // Limpa o CPF, removendo caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');

  // Verifica se o CPF tem 11 dígitos ou é uma sequência repetida
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) {
    return false;
  }

  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) {
    return false;
  }

  return true;
}

export function validarCNPJ(cnpj) {
  // Limpa o CNPJ, removendo caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica se o CNPJ tem 14 dígitos ou é uma sequência repetida
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Calcula o primeiro dígito verificador
  let soma = 0;
  let pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj[i]) * pesos[i];
  }
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;
  if (digito1 !== parseInt(cnpj[12])) {
    return false;
  }

  // Calcula o segundo dígito verificador
  soma = 0;
  pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj[i]) * pesos[i];
  }
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;
  if (digito2 !== parseInt(cnpj[13])) {
    return false;
  }

  return true;
}