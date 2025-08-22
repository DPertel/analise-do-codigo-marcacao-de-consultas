// =============================================
// Arquivo: api.ts
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

/**
 * Configuração base da API
 */

// URL base da API do backend
// Exportação de um componente/função principal deste arquivo
export const API_BASE_URL = 'http://localhost:8080';

// Endpoints da API
// Exportação de um componente/função principal deste arquivo
export const API_ENDPOINTS = {
  // Autenticação
  LOGIN: '/usuarios/login',
  REGISTER: '/usuarios',
  CURRENT_USER: '/usuarios/me',
  
  // Usuários
  USERS: '/usuarios',
  DOCTORS: '/usuarios/medicos',
  
  // Especialidades
  SPECIALTIES: '/especialidades',
  
  // Consultas
  APPOINTMENTS: '/consultas',
} as const;

/**
 * Classe para fazer requisições HTTP à API
 */
export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Define o token de autenticação
   */
  setToken(token: string | null) {
    this.token = token;
  }

  /**
   * Obtém os headers padrão para as requisições
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Faz uma requisição GET
   */
  async get<T>(endpoint: string): Promise<T> {
// Declaração de função ou variável com arrow function
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Faz uma requisição POST
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
// Declaração de função ou variável com arrow function
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
// Declaração de função ou variável com arrow function
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Faz uma requisição PUT
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
// Declaração de função ou variável com arrow function
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
// Declaração de função ou variável com arrow function
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Faz uma requisição DELETE
   */
  async delete(endpoint: string): Promise<void> {
// Declaração de função ou variável com arrow function
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
// Declaração de função ou variável com arrow function
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }
  }
}

// Instância global do cliente da API
// Exportação de um componente/função principal deste arquivo
export const apiClient = new ApiClient();
