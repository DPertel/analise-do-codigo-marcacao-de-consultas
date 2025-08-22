// =============================================
// Arquivo: index.tsx
// Este arquivo faz parte do sistema de marcação de consultas
// Comentários adicionados para explicar blocos de código
// =============================================

// Importação de módulos, bibliotecas e componentes necessários
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importação de módulos, bibliotecas e componentes necessários
import HomeScreen from '../screens/HomeScreen';
// Importação de módulos, bibliotecas e componentes necessários
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';
// Importação de módulos, bibliotecas e componentes necessários
import ProfileScreen from '../screens/ProfileScreen';

// Declaração de função ou variável com arrow function
const Stack = createNativeStackNavigator();

// Exportação de um componente/função principal deste arquivo
export default function AppRoutes() {
// Renderização JSX do componente (UI)
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}