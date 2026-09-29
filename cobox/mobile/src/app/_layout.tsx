import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme/colors';

/**
 * Layout raíz de la porción de la app que corresponde a Ángel:
 * Bolsa de Envíos, Mapa/Navegación, Escáner de doble validación y
 * App Comprador. Los headers de cada pantalla se dibujan a mano con
 * `ScreenHeader` para respetar el estilo de los mockups, por eso el
 * Stack nativo va sin cabecera.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
