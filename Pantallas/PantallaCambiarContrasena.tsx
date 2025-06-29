// Pantallas/PantallaCambiarContrasena.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import * as Linking from "expo-linking";
import { supabase } from "../supabaseClient";

const { width } = Dimensions.get("window");

export default function PantallaCambiarContrasena() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 1) Al montarse, extraemos access_token y refresh_token de la URL
    (async () => {
      try {
        const url = await Linking.getInitialURL();
        if (!url) throw new Error("URL vacía");
        const parsed = Linking.parse(url);
        const { access_token, refresh_token } = parsed.queryParams as Record<
          string,
          string
        >;
        if (!access_token || !refresh_token) {
          throw new Error("Faltan tokens en la URL");
        }

        // 2) Le decimos a supabase que use esa sesión
        const {
          data: sessionData,
          error: sessionError,
        } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (sessionError) throw sessionError;
        // sesión lista, permitimos mostrar el formulario
      } catch (err: unknown) {
        console.warn(err);
        setError("Link inválido o expirado.");
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const handleUpdate = async () => {
    setError("");
    setInfo("");
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const { error: updateErr } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);
    if (updateErr) {
      setError("No pudimos cambiar tu contraseña.");
    } else {
      setInfo("¡Contraseña actualizada! Redirigiendo al login...");
      setTimeout(() => {
        Linking.openURL("rtc://login");
      }, 2000);
    }
  };

  if (checking) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Verificando enlace…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu nueva contraseña para finalizar.
      </Text>

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
      {info ? (
        <HelperText type="info" style={{ color: "#4CAF50" }}>
          {info}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleUpdate}
        loading={loading}
        style={styles.button}
      >
        Actualizar contraseña
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FA",
    padding: 16,
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F7FA",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#90949C",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#FFF",
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
});
