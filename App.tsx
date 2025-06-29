import * as React from "react";
import { Text } from "react-native";
import * as Linking from "expo-linking";
import { NavigationContainer } from "@react-navigation/native";
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

const linking = {
  prefixes: [
    Linking.createURL("/"),  // expo://… en desarrollo
    "rtc://",                // tu scheme en producción
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

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer linking={linking} fallback={<Text>Cargando…</Text>}>
        <Stack.Navigator initialRouteName="PantallaIniciarSesion" screenOptions={{ headerShown: false }}>
          {/* Flujo contraseña */}
          <Stack.Screen name="PantallaRecuperarContrasena" component={PantallaRecuperarContrasena} />
          <Stack.Screen name="PantallaCheckMail" component={PantallaCheckMail} />
          <Stack.Screen name="PantallaCambiarContrasena" component={PantallaCambiarContrasena} />

          {/* Flujo registro */}
          <Stack.Screen name="PantallaRegistro" component={PantallaRegistro} />
          <Stack.Screen name="PantallaRegistroExitoso" component={PantallaRegistroExitoso} />

          {/* Login */}
          <Stack.Screen name="PantallaIniciarSesion" component={PantallaIniciarSesion} />

          {/* Principal */}
          <Stack.Screen name="PantallaExploracion" component={PantallaExploracion} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
