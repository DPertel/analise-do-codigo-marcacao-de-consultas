// =============================================
// Arquivo: auth.ts
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

/**
 * Tipos relacionados à autenticação e autorização
 */

/**
 * Perfis de usuário disponíveis no sistema
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export type UserRole = 'admin' | 'doctor' | 'patient';

/**
 * Interface base do usuário
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string;
}

/**
 * Interface do médico
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface Doctor extends BaseUser {
  role: 'doctor';
  specialty: string;
}

/**
 * Interface do paciente
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface Patient extends BaseUser {
  role: 'patient';
}

/**
 * Interface do administrador
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface Admin extends BaseUser {
  role: 'admin';
}

/**
 * Interface do usuário autenticado
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export type User = Admin | Doctor | Patient;

/**
 * Dados necessários para login
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Dados necessários para registro
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * Resposta da API de autenticação
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Contexto de autenticação
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
} 