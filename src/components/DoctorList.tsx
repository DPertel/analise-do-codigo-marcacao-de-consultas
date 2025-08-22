// =============================================
// Arquivo: DoctorList.tsx
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import React from 'react';
// Importação de módulos, bibliotecas e componentes necessários
import styled from 'styled-components/native';
// Importação de módulos, bibliotecas e componentes necessários
import { ViewStyle } from 'react-native';
// Importação de módulos, bibliotecas e componentes necessários
import { ListItem, Avatar } from 'react-native-elements';
// Importação de módulos, bibliotecas e componentes necessários
import theme from '../styles/theme';

// Definição de tipos/interfaces TypeScript para tipagem forte
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}


// Definição de tipos/interfaces TypeScript para tipagem forte
interface DoctorListProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
  selectedDoctorId?: string;
  style?: ViewStyle;
}

// Declaração de função ou variável com arrow function
const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  onSelectDoctor,
  selectedDoctorId,
  style,
}) => {
// Renderização JSX do componente (UI)
  return (
    <Container style={style}>
      {doctors.map((doctor) => (
        <ListItem
          key={doctor.id}
          onPress={() => onSelectDoctor(doctor)}
          containerStyle={[
            styles.listItem,
            selectedDoctorId === doctor.id && styles.selectedItem,
          ]}
        >
          <Avatar
            size="medium"
            rounded
            source={{ uri: doctor.image }}
            containerStyle={styles.avatar}
          />
          <ListItem.Content>
            <ListItem.Title style={styles.name}>{doctor.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.specialty}>
              {doctor.specialty}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </Container>
  );
};

const styles = {
  listItem: {
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedItem: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
  },
};

const Container = styled.View`
  margin-bottom: 15px;
`;

export default DoctorList; 