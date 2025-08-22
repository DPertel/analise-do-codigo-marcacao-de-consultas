// =============================================
// Arquivo: specialtiesApi.ts
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import { apiClient, API_ENDPOINTS } from './api';

/**
 * Interface para a especialidade retornada pela API
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
interface ApiSpecialty {
  id: number;
  nome: string;
}

/**
 * Interface para a especialidade usada no frontend
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface Specialty {
  id: string;
  name: string;
}

/**
 * Serviço para gerenciar especialidades médicas
 */
// Exportação de um componente/função principal deste arquivo
export const specialtiesApiService = {
  /**
   * Busca todas as especialidades
   */
  async getAllSpecialties(): Promise<Specialty[]> {
    try {
// Chamada à API/backend para buscar ou enviar dados
      const specialties = await apiClient.get<ApiSpecialty[]>(API_ENDPOINTS.SPECIALTIES);
      return specialties.map(this.mapApiSpecialtyToSpecialty);
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
      throw new Error('Erro ao carregar especialidades');
    }
  },

  /**
   * Mapeia uma especialidade da API para o formato usado no frontend
   */
// Chamada à API/backend para buscar ou enviar dados
  mapApiSpecialtyToSpecialty(apiSpecialty: ApiSpecialty): Specialty {
    return {
// Chamada à API/backend para buscar ou enviar dados
      id: apiSpecialty.id.toString(),
// Chamada à API/backend para buscar ou enviar dados
      name: apiSpecialty.nome,
    };
  },
};
