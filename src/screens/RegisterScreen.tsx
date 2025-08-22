// =============================================
// Arquivo: RegisterScreen.tsx
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import React, { useState } from 'react';
// Importação de módulos, bibliotecas e componentes necessários
import styled from 'styled-components/native';
// Importação de módulos, bibliotecas e componentes necessários
import { Input, Button, Text } from 'react-native-elements';
// Importação de módulos, bibliotecas e componentes necessários
import { useAuth } from '../contexts/AuthContext';
// Importação de módulos, bibliotecas e componentes necessários
import theme from '../styles/theme';
// Importação de módulos, bibliotecas e componentes necessários
import { ViewStyle } from 'react-native';
// Importação de módulos, bibliotecas e componentes necessários
import { useNavigation } from '@react-navigation/native';
// Importação de módulos, bibliotecas e componentes necessários
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Importação de módulos, bibliotecas e componentes necessários
import { RootStackParamList } from '../types/navigation';

// Definição de tipos/interfaces TypeScript para tipagem forte
type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

// Declaração de função ou variável com arrow function
const RegisterScreen: React.FC = () => {
// Declaração de função ou variável com arrow function
  const { register } = useAuth();
// Declaração de função ou variável com arrow function
  const navigation = useNavigation<RegisterScreenProps['navigation']>();
// Declaração de estado local com useState (React Hook)
  const [name, setName] = useState('');
// Declaração de estado local com useState (React Hook)
  const [email, setEmail] = useState('');
// Declaração de estado local com useState (React Hook)
  const [password, setPassword] = useState('');
// Declaração de estado local com useState (React Hook)
  const [loading, setLoading] = useState(false);
// Declaração de estado local com useState (React Hook)
  const [error, setError] = useState('');

// Declaração de função ou variável com arrow function
  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');

      if (!name || !email || !password) {
        setError('Por favor, preencha todos os campos');
        return;
      }

      await register({
        name,
        email,
        password,
      });

      // Após o registro bem-sucedido, navega para o login
      navigation.navigate('Login');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

// Renderização JSX do componente (UI)
  return (
    <Container>
      <Title>Cadastro de Paciente</Title>
      
      <Input
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
// Chamada à API/backend para buscar ou enviar dados
        autoCapitalize="words"
        containerStyle={styles.input}
      />

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
// Chamada à API/backend para buscar ou enviar dados
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.input}
      />

      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.input}
      />

      {error ? <ErrorText>{error}</ErrorText> : null}

      <Button
        title="Cadastrar"
        onPress={handleRegister}
        loading={loading}
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      <Button
        title="Voltar para Login"
        onPress={() => navigation.navigate('Login')}
        containerStyle={styles.backButton as ViewStyle}
        buttonStyle={styles.backButtonStyle}
      />
    </Container>
  );
};

const styles = {
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
  backButton: {
    marginTop: 10,
    width: '100%',
  },
  backButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: ${theme.colors.text};
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default RegisterScreen; 