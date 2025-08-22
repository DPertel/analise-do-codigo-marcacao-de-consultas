// =============================================
// Arquivo: ProfileScreen.tsx
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import React from 'react';
// Importação de módulos, bibliotecas e componentes necessários
import styled from 'styled-components/native';
// Importação de módulos, bibliotecas e componentes necessários
import { Button, ListItem } from 'react-native-elements';
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
import { ViewStyle } from 'react-native';

// Definição de tipos/interfaces TypeScript para tipagem forte
type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

// Declaração de função ou variável com arrow function
const ProfileScreen: React.FC = () => {
// Declaração de função ou variável com arrow function
  const { user, signOut } = useAuth();
// Declaração de função ou variável com arrow function
  const navigation = useNavigation<ProfileScreenProps['navigation']>();

// Declaração de função ou variável com arrow function
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'doctor':
        return 'Médico';
      case 'patient':
        return 'Paciente';
      default:
        return role;
    }
  };

// Renderização JSX do componente (UI)
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Meu Perfil</Title>

        <ProfileCard>
          <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />
          <Name>{user?.name}</Name>
          <Email>{user?.email}</Email>
          <RoleBadge role={user?.role || ''}>
            <RoleText>{getRoleText(user?.role || '')}</RoleText>
          </RoleBadge>
          
          {user?.role === 'doctor' && (
            <SpecialtyText>Especialidade: {user?.specialty}</SpecialtyText>
          )}
        </ProfileCard>

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

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
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ScrollView = styled.ScrollView`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const ProfileCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
`;

const Name = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const Email = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(props: { role: string }) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20';
      case 'doctor':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

const SpecialtyText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-top: 8px;
`;

export default ProfileScreen;
