// =============================================
// Arquivo: appointmentsApi.ts
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import { apiClient, API_ENDPOINTS } from './api';

/**
 * Interface para a consulta retornada pela API
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
interface ApiAppointment {
  id: number;
  dataHora: string;
  especialidade: string;
  usuarioId: number;
  medicoId: number;
  observacao: string;
  status: 'AGENDADA' | 'CONFIRMADA' | 'CANCELADA' | 'REALIZADA';
}

/**
 * Interface para a consulta usada no frontend
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface Appointment {
  id: string;
  date: string;
  time: string;
  specialty: string;
  patientId: string;
  doctorId: string;
  notes: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

/**
 * Interface para criar uma nova consulta
 */
// Definição de tipos/interfaces TypeScript para tipagem forte
export interface CreateAppointmentData {
  dataHora: string;
  especialidade: string;
  usuarioId: number;
  medicoId: number;
  observacao: string;
}

/**
 * Serviço para gerenciar consultas médicas
 */
// Exportação de um componente/função principal deste arquivo
export const appointmentsApiService = {
  /**
   * Cria uma nova consulta
   */
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    try {
// Chamada à API/backend para buscar ou enviar dados
      const appointment = await apiClient.post<ApiAppointment>(
        API_ENDPOINTS.APPOINTMENTS,
        {
          ...data,
          status: 'AGENDADA',
        }
      );
      return this.mapApiAppointmentToAppointment(appointment);
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      throw new Error('Erro ao agendar consulta');
    }
  },

  /**
   * Busca uma consulta por ID
   */
  async getAppointmentById(id: string): Promise<Appointment> {
    try {
// Chamada à API/backend para buscar ou enviar dados
      const appointment = await apiClient.get<ApiAppointment>(
        `${API_ENDPOINTS.APPOINTMENTS}/${id}`
      );
      return this.mapApiAppointmentToAppointment(appointment);
    } catch (error) {
      console.error('Erro ao buscar consulta:', error);
      throw new Error('Erro ao carregar consulta');
    }
  },

  /**
   * Cancela uma consulta
   */
  async cancelAppointment(id: string): Promise<void> {
    try {
// Chamada à API/backend para buscar ou enviar dados
      await apiClient.delete(`${API_ENDPOINTS.APPOINTMENTS}/${id}`);
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error);
      throw new Error('Erro ao cancelar consulta');
    }
  },

  /**
   * Mapeia uma consulta da API para o formato usado no frontend
   */
// Chamada à API/backend para buscar ou enviar dados
  mapApiAppointmentToAppointment(apiAppointment: ApiAppointment): Appointment {
    // Divide data e hora
// Chamada à API/backend para buscar ou enviar dados
    const dateTime = new Date(apiAppointment.dataHora);
// Declaração de função ou variável com arrow function
    const date = dateTime.toISOString().split('T')[0];
// Declaração de função ou variável com arrow function
    const time = dateTime.toTimeString().slice(0, 5);

    // Mapeia o status
    let status: Appointment['status'];
// Chamada à API/backend para buscar ou enviar dados
    switch (apiAppointment.status) {
      case 'AGENDADA':
        status = 'scheduled';
        break;
      case 'CONFIRMADA':
        status = 'confirmed';
        break;
      case 'CANCELADA':
        status = 'cancelled';
        break;
      case 'REALIZADA':
        status = 'completed';
        break;
      default:
        status = 'scheduled';
    }

    return {
// Chamada à API/backend para buscar ou enviar dados
      id: apiAppointment.id.toString(),
      date,
      time,
// Chamada à API/backend para buscar ou enviar dados
      specialty: apiAppointment.especialidade,
// Chamada à API/backend para buscar ou enviar dados
      patientId: apiAppointment.usuarioId.toString(),
// Chamada à API/backend para buscar ou enviar dados
      doctorId: apiAppointment.medicoId.toString(),
// Chamada à API/backend para buscar ou enviar dados
      notes: apiAppointment.observacao,
      status,
    };
  },

  /**
   * Mapeia dados do frontend para o formato da API
   */
  mapAppointmentDataToApi(
    data: {
      date: string;
      time: string;
      specialty: string;
      patientId: string;
      doctorId: string;
      notes: string;
    }
  ): CreateAppointmentData {
    // Combina data e hora
    const dateTime = `${data.date}T${data.time}:00`;

    return {
      dataHora: dateTime,
      especialidade: data.specialty,
      usuarioId: parseInt(data.patientId),
      medicoId: parseInt(data.doctorId),
      observacao: data.notes,
    };
  },
};
