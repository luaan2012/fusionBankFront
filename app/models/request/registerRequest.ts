interface RegisterRequest {
  name: string;
  lastName: string;
  phoneNumber: string;
  salaryPerMonth: string;
  accountType: string;
  bankISBP: string;
  bankName: string;
  documentType: 'CPF' | 'CNPJ';
  email: string;
  document: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
}