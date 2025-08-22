// =============================================
// Arquivo: authApi.ts
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import { apiClient, API_ENDPOINTS } from './api';
// Importação de módulos, bibliotecas e componentes necessários
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

/**
 * Interface para a resposta de login da API
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
interface ApiLoginResponse {
  token: string;
}

/**
 * Interface para o usuário retornado pela API
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
interface ApiUser {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN' | 'MEDICO' | 'PACIENTE';
}

/**
 * Serviço de autenticação que se conecta com a API do backend
 */
// Exportação de um componente/função principal deste arquivo
export const authApiService = {
  /**
   * Faz login com a API
   */
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Faz a requisição de login
// Chamada à API/backend para buscar ou enviar dados
      const loginResponse = await apiClient.post<ApiLoginResponse>(
        API_ENDPOINTS.LOGIN,
        {
          email: credentials.email,
          senha: credentials.password,
        }
      );

      // Define o token no cliente da API
// Chamada à API/backend para buscar ou enviar dados
      apiClient.setToken(loginResponse.token);

      // Busca os dados do usuário
// Declaração de função ou variável com arrow function
      const userData = await this.getCurrentUser();

      return {
        user: userData,
        token: loginResponse.token,
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Email ou senha inválidos');
    }
  },

  /**
   * Registra um novo usuário (paciente)
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Cria o usuário
// Chamada à API/backend para buscar ou enviar dados
      const newUser = await apiClient.post<ApiUser>(API_ENDPOINTS.REGISTER, {
        nome: data.name,
        email: data.email,
        senha: data.password,
        tipo: 'PACIENTE',
      });

      // Faz login automaticamente após o registro
      return await this.signIn({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      throw new Error('Erro ao criar conta. Verifique se o email já não está em uso.');
    }
  },

  /**
   * Obtém os dados do usuário atual baseado no token JWT
   */
  async getCurrentUser(): Promise<User> {
    try {
      // Busca o usuário atual usando o endpoint específico que utiliza o JWT
// Chamada à API/backend para buscar ou enviar dados
      const currentUser = await apiClient.get<ApiUser>(API_ENDPOINTS.CURRENT_USER);
      return this.mapApiUserToUser(currentUser);
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw new Error('Erro ao carregar dados do usuário');
    }
  },

  /**
   * Busca todos os médicos
   */
  async getAllDoctors(): Promise<User[]> {
    try {
// Chamada à API/backend para buscar ou enviar dados
      const doctors = await apiClient.get<ApiUser[]>(API_ENDPOINTS.DOCTORS);
      return doctors.map(this.mapApiUserToUser);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      throw new Error('Erro ao carregar médicos');
    }
  },

  /**
   * Busca médicos por especialidade
   */
  async getDoctorsBySpecialty(specialty: string): Promise<User[]> {
    try {
// Chamada à API/backend para buscar ou enviar dados
      const doctors = await apiClient.get<ApiUser[]>(
        `${API_ENDPOINTS.DOCTORS}?especialidade=${encodeURIComponent(specialty)}`
      );
      return doctors.map(this.mapApiUserToUser);
    } catch (error) {
      console.error('Erro ao buscar médicos por especialidade:', error);
      throw new Error('Erro ao carregar médicos da especialidade');
    }
  },

  /**
   * Faz logout
   */
  async signOut(): Promise<void> {
    // Remove o token do cliente da API
// Chamada à API/backend para buscar ou enviar dados
    apiClient.setToken(null);
  },

  /**
   * Mapeia um usuário da API para o formato usado no frontend
   */
// Chamada à API/backend para buscar ou enviar dados
  mapApiUserToUser(apiUser: ApiUser): User {
    const baseUser = {
// Chamada à API/backend para buscar ou enviar dados
      id: apiUser.id.toString(),
// Chamada à API/backend para buscar ou enviar dados
      name: apiUser.nome,
// Chamada à API/backend para buscar ou enviar dados
      email: apiUser.email,
// Chamada à API/backend para buscar ou enviar dados
      image: `https://randomuser.me/api/portraits/${apiUser.id % 2 === 0 ? 'men' : 'women'}/${(apiUser.id % 10) + 1}.jpg`,
    };

// Chamada à API/backend para buscar ou enviar dados
    switch (apiUser.tipo) {
      case 'ADMIN':
        return {
          ...baseUser,
          role: 'admin' as const,
        };
      case 'MEDICO':
        return {
          ...baseUser,
          role: 'doctor' as const,
          specialty: 'Especialidade não informada', // TODO: Buscar da API de especialidades
        };
      case 'PACIENTE':
        return {
          ...baseUser,
          role: 'patient' as const,
        };
      default:
// Chamada à API/backend para buscar ou enviar dados
        throw new Error(`Tipo de usuário inválido: ${apiUser.tipo}`);
    }
  },
};
