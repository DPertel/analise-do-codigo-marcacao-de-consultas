// =============================================
// Arquivo: LoginScreen.tsx
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
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

// Declaração de função ou variável com arrow function
const LoginScreen: React.FC = () => {
// Declaração de função ou variável com arrow function
  const { signIn } = useAuth();
// Declaração de função ou variável com arrow function
  const navigation = useNavigation<LoginScreenProps['navigation']>();
// Declaração de estado local com useState (React Hook)
  const [email, setEmail] = useState('');
// Declaração de estado local com useState (React Hook)
  const [password, setPassword] = useState('');
// Declaração de estado local com useState (React Hook)
  const [loading, setLoading] = useState(false);
// Declaração de estado local com useState (React Hook)
  const [error, setError] = useState('');

// Declaração de função ou variável com arrow function
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signIn({ email, password });
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

// Renderização JSX do componente (UI)
  return (
    <Container>
      <Title>App Marcação de Consultas</Title>
      
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
        title="Entrar"
        onPress={handleLogin}
        loading={loading}
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      <Button
        title="Cadastrar Novo Paciente"
        onPress={() => navigation.navigate('Register')}
        containerStyle={styles.registerButton as ViewStyle}
        buttonStyle={styles.registerButtonStyle}
      />

      <Text style={styles.hint}>
        Use as credenciais de exemplo:
      </Text>
      <Text style={styles.credentials}>
        Admin: admin@example.com / 123456{'\n'}
        Médicos: joao@example.com, maria@example.com, pedro@example.com / 123456
      </Text>
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
  registerButton: {
    marginTop: 10,
    width: '100%',
  },
  registerButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  hint: {
    marginTop: 20,
    textAlign: 'center' as const,
    color: theme.colors.text,
  },
  credentials: {
    marginTop: 10,
    textAlign: 'center' as const,
    color: theme.colors.text,
    fontSize: 12,
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

export default LoginScreen; 