// =============================================
// Arquivo: DoctorDashboardScreen.tsx
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import React, { useState } from 'react';
// Importação de módulos, bibliotecas e componentes necessários
import styled from 'styled-components/native';
// Importação de módulos, bibliotecas e componentes necessários
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
// Importação de módulos, bibliotecas e componentes necessários
import { Button, ListItem, Text } from 'react-native-elements';
// Importação de módulos, bibliotecas e componentes necessários
import { useAuth } from '../contexts/AuthContext';
// Importação de módulos, bibliotecas e componentes necessários
import { useNavigation } from '@react-navigation/native';
// Importação de módulos, bibliotecas e componentes necessários
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Importação de módulos, bibliotecas e componentes necessários
import { useFocusEffect } from '@react-navigation/native';
// Importação de módulos, bibliotecas e componentes necessários
import { RootStackParamList } from '../types/navigation';
// Importação de módulos, bibliotecas e componentes necessários
import theme from '../styles/theme';
// Importação de módulos, bibliotecas e componentes necessários
import Header from '../components/Header';
// Importação de módulos, bibliotecas e componentes necessários
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definição de tipos/interfaces TypeScript para tipagem forte
type DoctorDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorDashboard'>;
};

// Definição de tipos/interfaces TypeScript para tipagem forte
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Definição de tipos/interfaces TypeScript para tipagem forte
interface StyledProps {
  status: string;
}

// Declaração de função ou variável com arrow function
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.error;
    default:
      return theme.colors.warning;
  }
};

// Declaração de função ou variável com arrow function
const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Pendente';
  }
};

// Declaração de função ou variável com arrow function
const DoctorDashboardScreen: React.FC = () => {
// Declaração de função ou variável com arrow function
  const { user, signOut } = useAuth();
// Declaração de função ou variável com arrow function
  const navigation = useNavigation<DoctorDashboardScreenProps['navigation']>();
// Declaração de estado local com useState (React Hook)
  const [appointments, setAppointments] = useState<Appointment[]>([]);
// Declaração de estado local com useState (React Hook)
  const [loading, setLoading] = useState(true);

// Declaração de função ou variável com arrow function
  const loadAppointments = async () => {
    try {
// Declaração de função ou variável com arrow function
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
// Declaração de função ou variável com arrow function
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
// Declaração de função ou variável com arrow function
        const doctorAppointments = allAppointments.filter(
          (appointment) => appointment.doctorId === user?.id
        );
        setAppointments(doctorAppointments);
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

// Declaração de função ou variável com arrow function
  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
// Declaração de função ou variável com arrow function
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
// Declaração de função ou variável com arrow function
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
// Declaração de função ou variável com arrow function
        const updatedAppointments = allAppointments.map(appointment => {
          if (appointment.id === appointmentId) {
            return { ...appointment, status: newStatus };
          }
          return appointment;
        });
        await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));
        loadAppointments(); // Recarrega a lista
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Carrega as consultas quando a tela estiver em foco
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

// Renderização JSX do componente (UI)
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Minhas Consultas</Title>

        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {loading ? (
          <LoadingText>Carregando consultas...</LoadingText>
        ) : appointments.length === 0 ? (
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.patientName as TextStyle}>
                  Paciente: {appointment.patientName || 'Nome não disponível'}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.dateTime as TextStyle}>
                  {appointment.date} às {appointment.time}
                </ListItem.Subtitle>
                <Text style={styles.specialty as TextStyle}>
                  {appointment.specialty}
                </Text>
                <StatusBadge status={appointment.status}>
                  <StatusText status={appointment.status}>
                    {getStatusText(appointment.status)}
                  </StatusText>
                </StatusBadge>
                {appointment.status === 'pending' && (
                  <ButtonContainer>
                    <Button
                      title="Confirmar"
                      onPress={() => handleUpdateStatus(appointment.id, 'confirmed')}
                      containerStyle={styles.actionButton as ViewStyle}
                      buttonStyle={styles.confirmButton}
                    />
                    <Button
                      title="Cancelar"
                      onPress={() => handleUpdateStatus(appointment.id, 'cancelled')}
                      containerStyle={styles.actionButton as ViewStyle}
                      buttonStyle={styles.cancelButton}
                    />
                  </ButtonContainer>
                )}
              </ListItem.Content>
            </AppointmentCard>
          ))
        )}

        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
  actionButton: {
    marginTop: 8,
    width: '48%',
  },
  confirmButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 8,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
  },
  dateTime: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Declaração de função ou variável com arrow function
const AppointmentCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const StatusBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const StatusText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

export default DoctorDashboardScreen; 