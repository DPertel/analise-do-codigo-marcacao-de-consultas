// =============================================
// Arquivo: AuthContext.tsx
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import React, { createContext, useContext, useState, useEffect } from 'react';
// Importação de módulos, bibliotecas e componentes necessários
import AsyncStorage from '@react-native-async-storage/async-storage';
// Importação de módulos, bibliotecas e componentes necessários
import { authApiService } from '../services/authApi';
// Importação de módulos, bibliotecas e componentes necessários
import { apiClient } from '../services/api';
// Importação de módulos, bibliotecas e componentes necessários
import { User, LoginCredentials, RegisterData, AuthContextData } from '../types/auth';

// Chaves de armazenamento
const STORAGE_KEYS = {
  USER: '@MedicalApp:user',
  TOKEN: '@MedicalApp:token',
};


// Declaração de função ou variável com arrow function
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Exportação de um componente/função principal deste arquivo
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// Declaração de estado local com useState (React Hook)
  const [user, setUser] = useState<User | null>(null);
// Declaração de estado local com useState (React Hook)
  const [loading, setLoading] = useState(true);

// Efeito colateral com useEffect (executa em ciclos de vida do componente)
  useEffect(() => {
    loadStoredUser();
  }, []);

// Declaração de função ou variável com arrow function
  const loadStoredUser = async () => {
    try {
      // Carrega o token salvo
// Declaração de função ou variável com arrow function
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
// Declaração de função ou variável com arrow function
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      
      if (storedToken && storedUser) {
        // Configura o token no cliente da API
// Chamada à API/backend para buscar ou enviar dados
        apiClient.setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      // Se houver erro, limpa os dados armazenados
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } finally {
      setLoading(false);
    }
  };

// Declaração de função ou variável com arrow function
  const signIn = async (credentials: LoginCredentials) => {
    try {
// Declaração de função ou variável com arrow function
      const response = await authApiService.signIn(credentials);
      setUser(response.user);
      
      // Salva os dados no AsyncStorage para persistência
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };

// Declaração de função ou variável com arrow function
  const register = async (data: RegisterData) => {
    try {
// Declaração de função ou variável com arrow function
      const response = await authApiService.register(data);
      setUser(response.user);
      
      // Salva os dados no AsyncStorage para persistência
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };

// Declaração de função ou variável com arrow function
  const signOut = async () => {
    try {
      await authApiService.signOut();
      setUser(null);
      
      // Remove os dados do AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

// Renderização JSX do componente (UI)
  return (
    <AuthContext.Provider value={{ user, loading, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportação de um componente/função principal deste arquivo
export const useAuth = () => {
// Declaração de função ou variável com arrow function
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 