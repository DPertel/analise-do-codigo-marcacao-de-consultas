// =============================================
// Arquivo: TimeSlotList.tsx
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import React from 'react';
// Importação de módulos, bibliotecas e componentes necessários
import styled from 'styled-components/native';
// Importação de módulos, bibliotecas e componentes necessários
import { ViewStyle, TouchableOpacity } from 'react-native';
// Importação de módulos, bibliotecas e componentes necessários
import theme from '../styles/theme';

// Definição de tipos/interfaces TypeScript para tipagem forte
interface TimeSlotListProps {
  onSelectTime: (time: string) => void;
  selectedTime?: string;
  style?: ViewStyle;
}

// Definição de tipos/interfaces TypeScript para tipagem forte
interface StyledProps {
  isSelected: boolean;
}

// Declaração de função ou variável com arrow function
const TimeSlotList: React.FC<TimeSlotListProps> = ({
  onSelectTime,
  selectedTime,
  style,
}) => {
  // Gera horários de 30 em 30 minutos das 9h às 18h
// Declaração de função ou variável com arrow function
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

// Declaração de função ou variável com arrow function
  const timeSlots = generateTimeSlots();

// Renderização JSX do componente (UI)
  return (
    <Container style={style}>
      <TimeGrid>
        {timeSlots.map((time) => (
          <TimeCard
            key={time}
            onPress={() => onSelectTime(time)}
            isSelected={selectedTime === time}
          >
            <TimeText isSelected={selectedTime === time}>{time}</TimeText>
          </TimeCard>
        ))}
      </TimeGrid>
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 15px;
`;

const TimeGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px;
`;

// Declaração de função ou variável com arrow function
const TimeCard = styled(TouchableOpacity)<StyledProps>`
  width: 23%;
  padding: 8px;
  border-radius: 6px;
  background-color: ${(props: StyledProps) => props.isSelected ? theme.colors.primary + '20' : theme.colors.background};
  border-width: 1px;
  border-color: ${(props: StyledProps) => props.isSelected ? theme.colors.primary : theme.colors.border};
  align-items: center;
  justify-content: center;
`;

const TimeText = styled.Text<StyledProps>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props: StyledProps) => props.isSelected ? theme.colors.primary : theme.colors.text};
`;

export default TimeSlotList; 