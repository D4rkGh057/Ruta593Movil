export interface User {
  id: string;
  fullName: string;
  email: string;
  cedula: string; // Cédula de identidad
  birthDate: string; // ISO string, ej: '2000-05-20'
  phone?: string;
  isDisabled?: boolean;
  isSenior?: boolean;
  createdAt?: string;
}
