// =============================================
// Arquivo: UserManagementScreen.tsx
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
type UserManagementScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserManagement'>;
};

// Definição de tipos/interfaces TypeScript para tipagem forte
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

// Definição de tipos/interfaces TypeScript para tipagem forte
interface StyledProps {
  role: string;
}

// Declaração de função ou variável com arrow function
const UserManagementScreen: React.FC = () => {
// Declaração de função ou variável com arrow function
  const { user } = useAuth();
// Declaração de função ou variável com arrow function
  const navigation = useNavigation<UserManagementScreenProps['navigation']>();
// Declaração de estado local com useState (React Hook)
  const [users, setUsers] = useState<User[]>([]);
// Declaração de estado local com useState (React Hook)
  const [loading, setLoading] = useState(true);

// Declaração de função ou variável com arrow function
  const loadUsers = async () => {
    try {
// Declaração de função ou variável com arrow function
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
// Declaração de função ou variável com arrow function
        const allUsers: User[] = JSON.parse(storedUsers);
        // Filtra o usuário atual da lista
// Declaração de função ou variável com arrow function
        const filteredUsers = allUsers.filter(u => u.id !== user?.id);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

// Declaração de função ou variável com arrow function
  const handleDeleteUser = async (userId: string) => {
    try {
// Declaração de função ou variável com arrow function
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
// Declaração de função ou variável com arrow function
        const allUsers: User[] = JSON.parse(storedUsers);
// Declaração de função ou variável com arrow function
        const updatedUsers = allUsers.filter(u => u.id !== userId);
        await AsyncStorage.setItem('@MedicalApp:users', JSON.stringify(updatedUsers));
        loadUsers(); // Recarrega a lista
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  // Carrega os usuários quando a tela estiver em foco
  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    }, [])
  );

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
        <Title>Gerenciar Usuários</Title>

        <Button
          title="Adicionar Novo Usuário"
          onPress={() => {}}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {loading ? (
          <LoadingText>Carregando usuários...</LoadingText>
        ) : users.length === 0 ? (
          <EmptyText>Nenhum usuário cadastrado</EmptyText>
        ) : (
          users.map((user) => (
            <UserCard key={user.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.userName as TextStyle}>
                  {user.name}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.userEmail as TextStyle}>
                  {user.email}
                </ListItem.Subtitle>
                <RoleBadge role={user.role}>
                  <RoleText role={user.role}>
                    {getRoleText(user.role)}
                  </RoleText>
                </RoleBadge>
                <ButtonContainer>
                  <Button
                    title="Editar"
                    onPress={() => {}}
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.editButton}
                  />
                  <Button
                    title="Excluir"
                    onPress={() => handleDeleteUser(user.id)}
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.deleteButton}
                  />
                </ButtonContainer>
              </ListItem.Content>
            </UserCard>
          ))
        )}

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.backButton}
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
  backButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  actionButton: {
    marginTop: 8,
    width: '48%',
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
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
const UserCard = styled(ListItem)`
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

const RoleBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20';
      case 'doctor':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const RoleText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary;
      case 'doctor':
        return theme.colors.success;
      default:
        return theme.colors.secondary;
    }
  }};
  font-size: 12px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

export default UserManagementScreen; 