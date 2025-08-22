// =============================================
// Arquivo: AppointmentForm.tsx
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import React, { useState, useEffect } from 'react';
// Importação de módulos, bibliotecas e componentes necessários
import styled from 'styled-components/native';
// Importação de módulos, bibliotecas e componentes necessários
import { Button, Input, Text } from 'react-native-elements';
// Importação de módulos, bibliotecas e componentes necessários
import { Platform, View, TouchableOpacity, Alert } from 'react-native';
// Importação de módulos, bibliotecas e componentes necessários
import theme from '../styles/theme';
// Importação de módulos, bibliotecas e componentes necessários
import { Doctor } from '../types/doctors';
// Importação de módulos, bibliotecas e componentes necessários
import { Appointment } from '../types/appointments';
// Importação de módulos, bibliotecas e componentes necessários
import { authApiService } from '../services/authApi';
// Importação de módulos, bibliotecas e componentes necessários
import { specialtiesApiService, Specialty } from '../services/specialtiesApi';
// Importação de módulos, bibliotecas e componentes necessários
import { User } from '../types/auth';

// Definição de tipos/interfaces TypeScript para tipagem forte
type AppointmentFormProps = {
   onSubmit: (appointment: {
      doctorId: string;
      date: Date;
      time: string;
      description: string;
   }) => void;
};

// Declaração de função ou variável com arrow function
const generateTimeSlots = () => {
   const slots = [];
   for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
   }
   return slots;
};

// Declaração de função ou variável com arrow function
const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
// Declaração de estado local com useState (React Hook)
   const [selectedDoctor, setSelectedDoctor] = useState<string>('');
// Declaração de estado local com useState (React Hook)
   const [dateInput, setDateInput] = useState('');
// Declaração de estado local com useState (React Hook)
   const [selectedTime, setSelectedTime] = useState<string>('');
// Declaração de estado local com useState (React Hook)
   const [description, setDescription] = useState('');
// Declaração de estado local com useState (React Hook)
   const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
   
   // Estados para dados da API
// Declaração de estado local com useState (React Hook)
   const [doctors, setDoctors] = useState<User[]>([]);
// Declaração de estado local com useState (React Hook)
   const [specialties, setSpecialties] = useState<Specialty[]>([]);
// Declaração de estado local com useState (React Hook)
   const [loading, setLoading] = useState(true);
   
// Declaração de função ou variável com arrow function
   const timeSlots = generateTimeSlots();

   // Carrega especialidades e médicos ao montar o componente
// Efeito colateral com useEffect (executa em ciclos de vida do componente)
   useEffect(() => {
      loadInitialData();
   }, []);

   // Carrega médicos quando uma especialidade é selecionada
// Efeito colateral com useEffect (executa em ciclos de vida do componente)
   useEffect(() => {
      if (selectedSpecialty) {
         loadDoctorsBySpecialty(selectedSpecialty);
      } else {
         loadAllDoctors();
      }
   }, [selectedSpecialty]);

// Declaração de função ou variável com arrow function
   const loadInitialData = async () => {
      try {
         setLoading(true);
// Declaração de função ou variável com arrow function
         const [specialtiesData, doctorsData] = await Promise.all([
            specialtiesApiService.getAllSpecialties(),
            authApiService.getAllDoctors(),
         ]);
         
         setSpecialties(specialtiesData);
         setDoctors(doctorsData);
      } catch (error) {
         console.error('Erro ao carregar dados:', error);
         Alert.alert('Erro', 'Não foi possível carregar os dados. Tente novamente.');
      } finally {
         setLoading(false);
      }
   };

// Declaração de função ou variável com arrow function
   const loadAllDoctors = async () => {
      try {
// Declaração de função ou variável com arrow function
         const doctorsData = await authApiService.getAllDoctors();
         setDoctors(doctorsData);
      } catch (error) {
         console.error('Erro ao carregar médicos:', error);
      }
   };

// Declaração de função ou variável com arrow function
   const loadDoctorsBySpecialty = async (specialty: string) => {
      try {
// Declaração de função ou variável com arrow function
         const doctorsData = await authApiService.getDoctorsBySpecialty(specialty);
         setDoctors(doctorsData);
         // Reset da seleção de médico quando muda a especialidade
         setSelectedDoctor('');
      } catch (error) {
         console.error('Erro ao carregar médicos por especialidade:', error);
      }
   };

// Declaração de função ou variável com arrow function
   const validateDate = (inputDate: string) => {
// Declaração de função ou variável com arrow function
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
// Declaração de função ou variável com arrow function
      const match = inputDate.match(dateRegex);

      if (!match) return false;

      const [, day, month, year] = match;
// Declaração de função ou variável com arrow function
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
// Declaração de função ou variável com arrow function
      const today = new Date();
// Declaração de função ou variável com arrow function
      const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

      return date >= today && date <= maxDate;
   };

// Declaração de função ou variável com arrow function
   const handleDateChange = (text: string) => {
      // Remove todos os caracteres não numéricos
// Declaração de função ou variável com arrow function
      const numbers = text.replace(/\D/g, '');
      
      // Formata a data enquanto digita
      let formattedDate = '';
      if (numbers.length > 0) {
         if (numbers.length <= 2) {
            formattedDate = numbers;
         } else if (numbers.length <= 4) {
            formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
         } else {
            formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
         }
      }

      setDateInput(formattedDate);
   };

// Declaração de função ou variável com arrow function
   const handleSubmit = () => {
      if (!selectedDoctor || !selectedTime || !description) {
         alert('Por favor, preencha todos os campos');
         return;
      }

      if (!validateDate(dateInput)) {
         alert('Por favor, insira uma data válida (DD/MM/AAAA)');
         return;
      }

// Declaração de função ou variável com arrow function
      const [day, month, year] = dateInput.split('/');
// Declaração de função ou variável com arrow function
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      onSubmit({
         doctorId: selectedDoctor,
         date,
         time: selectedTime,
         description,
      });
   };

// Declaração de função ou variável com arrow function
   const isTimeSlotAvailable = (time: string) => {
      // Aqui você pode adicionar lógica para verificar se o horário está disponível
      // Por exemplo, verificar se já existe uma consulta agendada para este horário
      return true;
   };

   if (loading) {
// Renderização JSX do componente (UI)
      return (
         <Container>
            <Text>Carregando...</Text>
         </Container>
      );
   }

// Renderização JSX do componente (UI)
   return (
      <Container>
         <Title>Selecione a Especialidade</Title>
         <SpecialtyContainer>
            <SpecialtyButton 
               selected={selectedSpecialty === ''}
               onPress={() => setSelectedSpecialty('')}
            >
               <SpecialtyText selected={selectedSpecialty === ''}>
                  Todas as Especialidades
               </SpecialtyText>
            </SpecialtyButton>
            {specialties.map((specialty) => (
               <SpecialtyButton
                  key={specialty.id}
                  selected={selectedSpecialty === specialty.name}
                  onPress={() => setSelectedSpecialty(specialty.name)}
               >
                  <SpecialtyText selected={selectedSpecialty === specialty.name}>
                     {specialty.name}
                  </SpecialtyText>
               </SpecialtyButton>
            ))}
         </SpecialtyContainer>

         <Title>Selecione o Médico</Title>
         <DoctorList>
            {doctors.map((doctor) => (
               <DoctorCard
                  key={doctor.id}
                  selected={selectedDoctor === doctor.id}
                  onPress={() => setSelectedDoctor(doctor.id)}
               >
                  <DoctorImage source={{ uri: doctor.image }} />
                  <DoctorInfo>
                     <DoctorName>{doctor.name}</DoctorName>
                     <DoctorSpecialty>
                        {doctor.role === 'doctor' && 'specialty' in doctor 
                           ? doctor.specialty 
                           : 'Especialidade não informada'}
                     </DoctorSpecialty>
                  </DoctorInfo>
               </DoctorCard>
            ))}
         </DoctorList>

         <Title>Data e Hora</Title>
         <Input
            placeholder="Data (DD/MM/AAAA)"
            value={dateInput}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10}
            containerStyle={InputContainer}
            errorMessage={dateInput && !validateDate(dateInput) ? 'Data inválida' : undefined}
         />

         <TimeSlotsContainer>
            <TimeSlotsTitle>Horários Disponíveis:</TimeSlotsTitle>
            <TimeSlotsGrid>
               {timeSlots.map((time) => {
// Declaração de função ou variável com arrow function
                  const isAvailable = isTimeSlotAvailable(time);
// Renderização JSX do componente (UI)
                  return (
                     <TimeSlotButton
                        key={time}
                        selected={selectedTime === time}
                        disabled={!isAvailable}
                        onPress={() => isAvailable && setSelectedTime(time)}
                     >
                        <TimeSlotText selected={selectedTime === time} disabled={!isAvailable}>
                           {time}
                        </TimeSlotText>
                     </TimeSlotButton>
                  );
               })}
            </TimeSlotsGrid>
         </TimeSlotsContainer>

         <Input
            placeholder="Descrição da consulta"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            containerStyle={InputContainer}
         />

         <SubmitButton
            title="Agendar Consulta"
            onPress={handleSubmit}
            buttonStyle={{
               backgroundColor: theme.colors.primary,
               borderRadius: 8,
               padding: 12,
               marginTop: 20,
            }}
         />
      </Container>
   );
};

const Container = styled.View`
  padding: ${theme.spacing.medium}px;
`;

const Title = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.medium}px;
`;

const DoctorList = styled.ScrollView`
  margin-bottom: ${theme.spacing.large}px;
`;

// Declaração de função ou variável com arrow function
const DoctorCard = styled(TouchableOpacity)<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.medium}px;
  background-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.white};
  border-radius: 8px;
  margin-bottom: ${theme.spacing.medium}px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;

const DoctorInfo = styled.View`
  flex: 1;
`;

const DoctorName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;

const DoctorSpecialty = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
`;

const TimeSlotsContainer = styled.View`
  margin-bottom: ${theme.spacing.large}px;
`;

const TimeSlotsTitle = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small}px;
`;

const TimeSlotsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.spacing.small}px;
`;

// Declaração de função ou variável com arrow function
const TimeSlotButton = styled(TouchableOpacity)<{ selected: boolean; disabled: boolean }>`
  background-color: ${(props: { selected: boolean; disabled: boolean }) => 
    props.disabled 
      ? theme.colors.background 
      : props.selected 
        ? theme.colors.primary 
        : theme.colors.white};
  padding: ${theme.spacing.small}px ${theme.spacing.medium}px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${(props: { selected: boolean; disabled: boolean }) => 
    props.disabled 
      ? theme.colors.background 
      : props.selected 
        ? theme.colors.primary 
        : theme.colors.text};
  opacity: ${(props: { disabled: boolean }) => props.disabled ? 0.5 : 1};
`;

// Declaração de função ou variável com arrow function
const TimeSlotText = styled(Text)<{ selected: boolean; disabled: boolean }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { selected: boolean; disabled: boolean }) => 
    props.disabled 
      ? theme.colors.text 
      : props.selected 
        ? theme.colors.white 
        : theme.colors.text};
`;

const InputContainer = {
   marginBottom: theme.spacing.medium,
   backgroundColor: theme.colors.white,
   borderRadius: 8,
   paddingHorizontal: theme.spacing.medium,
};

// Declaração de função ou variável com arrow function
const SubmitButton = styled(Button)`
  margin-top: ${theme.spacing.large}px;
`;

const SpecialtyContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.spacing.small}px;
  margin-bottom: ${theme.spacing.large}px;
`;

// Declaração de função ou variável com arrow function
const SpecialtyButton = styled(TouchableOpacity)<{ selected: boolean }>`
  background-color: ${(props: { selected: boolean }) => 
    props.selected ? theme.colors.primary : theme.colors.white};
  padding: ${theme.spacing.small}px ${theme.spacing.medium}px;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${(props: { selected: boolean }) => 
    props.selected ? theme.colors.primary : theme.colors.border};
  margin-bottom: ${theme.spacing.small}px;
`;

// Declaração de função ou variável com arrow function
const SpecialtyText = styled(Text)<{ selected: boolean }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { selected: boolean }) => 
    props.selected ? theme.colors.white : theme.colors.text};
  text-align: center;
`;

export default AppointmentForm; 