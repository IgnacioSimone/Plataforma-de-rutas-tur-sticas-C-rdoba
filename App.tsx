// App.tsx
import * as React from "react";
import "react-native-gesture-handler";
import { Text } from "react-native";
import * as Linking from "expo-linking";
import {
  NavigationContainer,
  createNavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";

import PantallaRegistro from "./Pantallas/PantallaRegistro";
import PantallaIniciarSesion from "./Pantallas/PantallaIniciarSesion";
import PantallaRecuperarContrasena from "./Pantallas/PantallaRecuperarContrasena";
import PantallaCheckMail from "./Pantallas/PantallaCheckMail";
import PantallaCambiarContrasena from "./Pantallas/PantallaCambiarContrasena";
import PantallaRegistroExitoso from "./Pantallas/PantallaRegistroExitoso";
import PantallaExploracion from "./Pantallas/PantallaExploracion";

const Stack = createNativeStackNavigator();

// Configuración de deep-linking
const linking = {
  prefixes: [
    Linking.createURL("/"), // expo://… en dev
    "rtc://",               // tu scheme nativo
  ],
  config: {
    screens: {
      PantallaIniciarSesion:       "login",
      PantallaRegistro:            "signup",
      PantallaRegistroExitoso:     "signup-success",
      PantallaRecuperarContrasena: "forgot-password",
      PantallaCheckMail:           "check-mail",
      PantallaCambiarContrasena:   "reset-password", // rtc://reset-password?access_token=…
      PantallaExploracion:         "home",
    },
  },
};

// Creamos un ref “estático” sin hooks para la navegación
export const navigationRef = createNavigationContainerRef<ParamListBase>();

export default function App() {
  // Hook *dentro* de App: suscripción al deep-link
  React.useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const data = Linking.parse(url);
      if (data.path === "reset-password") {
        // navegamos pasando la URL completa para que PantallaCambiarContrasena
        // pueda extraer tokens y restaurar la sesión
        navigationRef.current?.navigate("PantallaCambiarContrasena", { url });
      }
    };

    const sub = Linking.addEventListener("url", handleDeepLink);
    return () => sub.remove();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        fallback={<Text>Cargando…</Text>}
      >
        <Stack.Navigator
          initialRouteName="PantallaIniciarSesion"
          screenOptions={{ headerShown: false }}
        >
          {/* Flujo de “olvidé contraseña” */}
          <Stack.Screen
            name="PantallaRecuperarContrasena"
            component={PantallaRecuperarContrasena}
          />
          <Stack.Screen
            name="PantallaCheckMail"
            component={PantallaCheckMail}
          />
          <Stack.Screen
            name="PantallaCambiarContrasena"
            component={PantallaCambiarContrasena}
          />

          {/* Flujo de registro */}
          <Stack.Screen name="PantallaRegistro" component={PantallaRegistro} />
          <Stack.Screen
            name="PantallaRegistroExitoso"
            component={PantallaRegistroExitoso}
          />

          {/* Login */}
          <Stack.Screen
            name="PantallaIniciarSesion"
            component={PantallaIniciarSesion}
          />

          {/* App principal */}
          <Stack.Screen
            name="PantallaExploracion"
            component={PantallaExploracion}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
