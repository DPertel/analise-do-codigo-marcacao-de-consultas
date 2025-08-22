// =============================================
// Arquivo: doctors.ts
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

/**
 * Tipos relacionados a médicos
 * Este arquivo contém todas as definições de tipos necessárias para o gerenciamento de médicos
 */

/**
 * Representa um médico no sistema
 * @property id - Identificador único do médico
 * @property name - Nome completo do médico
 * @property specialty - Especialidade médica
 * @property image - URL da foto do médico
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  image: string;
}; 