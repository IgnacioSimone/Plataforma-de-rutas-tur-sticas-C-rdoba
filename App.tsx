import * as React from "react";
import { Text } from "react-native";
import * as Linking from "expo-linking";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";

import PantallaRegistro from "./Pantallas/PantallaRegistro";
import PantallaIniciarSesion from "./Pantallas/PantallaIniciarSesion";
import PantallaRecuperarContrasena from "./Pantallas/PantallaRecuperarContrasena";
import PantallaRegistroExitoso from "./Pantallas/PantallaRegistroExitoso";
import PantallaCheckMail from "./Pantallas/PantallaCheckMail";
import PantallaCambiarContrasena from "./Pantallas/PantallaCambiarContrasena";
import PantallaExploracion from "./Pantallas/PantallaExploracion";

const Stack = createNativeStackNavigator();

// Deep-linking: prefijos + mapeo de rutas a pantallas
const linking = {
  prefixes: [Linking.createURL("/"), "rtc://"],
  config: {
    screens: {
      PantallaIniciarSesion:       "login",            // rtc://login
      PantallaRegistro:            "signup",           // rtc://signup
      PantallaRegistroExitoso:     "signup-success",   // rtc://signup-success
      PantallaRecuperarContrasena: "forgot-password",  // rtc://forgot-password
      PantallaCheckMail:           "check-mail",       // rtc://check-mail
      PantallaCambiarContrasena:   "reset-password",   // rtc://reset-password?access_token=...
      PantallaExploracion:         "home",             // rtc://home
    },
  },
};

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer linking={linking} fallback={<Text>Cargando…</Text>}>
        <Stack.Navigator
          initialRouteName="PantallaIniciarSesion"
          screenOptions={{ headerShown: false }}
        >
          {/* Modales / pantallas secundarias */}
          <Stack.Screen
            name="PantallaRecuperarContrasena"
            component={PantallaRecuperarContrasena}
          />
          <Stack.Screen
            name="PantallaRegistroExitoso"
            component={PantallaRegistroExitoso}
          />
          <Stack.Screen
            name="PantallaCheckMail"
            component={PantallaCheckMail}
          />
          <Stack.Screen
            name="PantallaCambiarContrasena"
            component={PantallaCambiarContrasena}
          />

          {/* Flujo de autenticación */}
          <Stack.Screen name="PantallaRegistro" component={PantallaRegistro} />
          <Stack.Screen
            name="PantallaIniciarSesion"
            component={PantallaIniciarSesion}
          />

          {/* Pantalla principal */}
          <Stack.Screen
            name="PantallaExploracion"
            component={PantallaExploracion}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
