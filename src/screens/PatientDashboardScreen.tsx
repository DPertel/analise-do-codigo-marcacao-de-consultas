// =============================================
// Arquivo: PatientDashboardScreen.tsx
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
type PatientDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientDashboard'>;
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
const PatientDashboardScreen: React.FC = () => {
// Declaração de função ou variável com arrow function
  const { user, signOut } = useAuth();
// Declaração de função ou variável com arrow function
  const navigation = useNavigation<PatientDashboardScreenProps['navigation']>();
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
        const userAppointments = allAppointments.filter(
          (appointment) => appointment.patientId === user?.id
        );
        setAppointments(userAppointments);
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
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
          title="Agendar Nova Consulta"
          onPress={() => navigation.navigate('CreateAppointment')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

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
                  Paciente: {appointment.patientName}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.dateTime as TextStyle}>
                  {appointment.date} às {appointment.time}
                </ListItem.Subtitle>
                <Text style={styles.doctorName as TextStyle}>
                  {appointment.doctorName}
                </Text>
                <Text style={styles.specialty as TextStyle}>
                  {appointment.specialty}
                </Text>
                <StatusBadge status={appointment.status}>
                  <StatusText status={appointment.status}>
                    {getStatusText(appointment.status)}
                  </StatusText>
                </StatusBadge>
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
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  dateTime: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
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

export default PatientDashboardScreen; 