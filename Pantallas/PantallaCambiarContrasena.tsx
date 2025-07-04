// Pantallas/PantallaCambiarContrasena.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Card,
} from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { supabase } from "../supabaseClient";

const { width } = Dimensions.get("window");

export default function PantallaCambiarContrasena({ navigation }: any) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    (async () => {
      // 1) traemos la URL que abrió la app
      const url = await Linking.getInitialURL();
      if (!url) {
        console.warn("No hay URL de deep-link");
        return navigation.replace("PantallaIniciarSesion");
      }

      // 2) parseamos queryParams (TS-safe)
      const { queryParams } = Linking.parse(url) || {};
      const access_token  = (queryParams?.access_token  as string) || "";
      const refresh_token = (queryParams?.refresh_token as string) || "";

      if (!access_token || !refresh_token) {
        console.warn("Faltan tokens en URL:", queryParams);
        return navigation.replace("PantallaIniciarSesion");
      }

      // 3) restauramos la sesión en RN
      const { data, error: sessionErr } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (sessionErr) {
        console.warn("No se pudo setear sesión:", sessionErr.message);
        return navigation.replace("PantallaIniciarSesion");
      }
      // si llegamos acá, ya estamos logueados y se muestra el form
    })();
  }, []);

  const handleUpdate = async () => {
    setError("");
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error: updErr } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updErr) {
      setError(updErr.message);
    } else {
      navigation.replace("PantallaIniciarSesion");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
    >
      <View style={styles.topContainer}>
        <LinearGradient
          colors={["#4E8DF5", "#2C68F2"]}
          style={styles.gradientIcon}
        >
          {/* Icono corregido a uno válido */}
          <MaterialCommunityIcons name="lock-reset" size={32} color="#fff" />
        </LinearGradient>
        <Text style={styles.title}>Crear nueva contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa y confirma tu nueva contraseña
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            placeholder="Nueva contraseña"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Confirmar contraseña"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
          />

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleUpdate}
            loading={loading}
            style={styles.button}
          >
            Actualizar contraseña
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F6F7FA",
  },
  topContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  gradientIcon: {
    width: 62,
    height: 62,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1C355E",
  },
  subtitle: {
    fontSize: 14,
    color: "#90949C",
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 16,
    width: width - 32,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#F1F3F5",
    marginBottom: 12,
    borderRadius: 12,
  },
  button: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#2073F7",
  },
});
