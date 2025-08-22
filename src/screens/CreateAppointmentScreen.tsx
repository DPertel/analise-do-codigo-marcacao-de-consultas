// =============================================
// Arquivo: CreateAppointmentScreen.tsx
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import React, { useState } from 'react';
// Importação de módulos, bibliotecas e componentes necessários
import styled from 'styled-components/native';
// Importação de módulos, bibliotecas e componentes necessários
import { ScrollView, ViewStyle } from 'react-native';
// Importação de módulos, bibliotecas e componentes necessários
import { Button, Input } from 'react-native-elements';
// Importação de módulos, bibliotecas e componentes necessários
import { useAuth } from '../contexts/AuthContext';
// Importação de módulos, bibliotecas e componentes necessários
import { useNavigation } from '@react-navigation/native';
// Importação de módulos, bibliotecas e componentes necessários
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Importação de módulos, bibliotecas e componentes necessários
import { RootStackParamList } from '../types/navigation';
// Importação de módulos, bibliotecas e componentes necessários
import theme from '../styles/theme';
// Importação de módulos, bibliotecas e componentes necessários
import Header from '../components/Header';
// Importação de módulos, bibliotecas e componentes necessários
import DoctorList from '../components/DoctorList';
// Importação de módulos, bibliotecas e componentes necessários
import TimeSlotList from '../components/TimeSlotList';
// Importação de módulos, bibliotecas e componentes necessários
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definição de tipos/interfaces TypeScript para tipagem forte
type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
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
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// Lista de médicos disponíveis
const availableDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
// Chamada à API/backend para buscar ou enviar dados
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Pediatria',
// Chamada à API/backend para buscar ou enviar dados
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Ortopedia',
// Chamada à API/backend para buscar ou enviar dados
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '4',
    name: 'Dra. Ana Costa',
    specialty: 'Dermatologia',
// Chamada à API/backend para buscar ou enviar dados
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '5',
    name: 'Dr. Carlos Mendes',
    specialty: 'Oftalmologia',
// Chamada à API/backend para buscar ou enviar dados
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

// Declaração de função ou variável com arrow function
const CreateAppointmentScreen: React.FC = () => {
// Declaração de função ou variável com arrow function
  const { user } = useAuth();
// Declaração de função ou variável com arrow function
  const navigation = useNavigation<CreateAppointmentScreenProps['navigation']>();
// Declaração de estado local com useState (React Hook)
  const [date, setDate] = useState('');
// Declaração de estado local com useState (React Hook)
  const [selectedTime, setSelectedTime] = useState<string>('');
// Declaração de estado local com useState (React Hook)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
// Declaração de estado local com useState (React Hook)
  const [loading, setLoading] = useState(false);
// Declaração de estado local com useState (React Hook)
  const [error, setError] = useState('');

// Declaração de função ou variável com arrow function
  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      setError('');

      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha a data e selecione um médico e horário');
        return;
      }

      // Recupera consultas existentes
// Declaração de função ou variável com arrow function
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
// Declaração de função ou variável com arrow function
      const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];

      // Cria nova consulta
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: user?.id || '',
        patientName: user?.name || '',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time: selectedTime,
        specialty: selectedDoctor.specialty,
        status: 'pending',
      };

      // Adiciona nova consulta à lista
      appointments.push(newAppointment);

      // Salva lista atualizada
      await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(appointments));

      alert('Consulta agendada com sucesso!');
      navigation.goBack();
    } catch (err) {
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

// Renderização JSX do componente (UI)
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title>

        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime}
          selectedTime={selectedTime}
        />

        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList
          doctors={availableDoctors}
          onSelectDoctor={setSelectedDoctor}
          selectedDoctorId={selectedDoctor?.id}
        />

        {error ? <ErrorText>{error}</ErrorText> : null}

        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
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

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 10px;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default CreateAppointmentScreen;
