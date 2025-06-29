import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
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

export default function PantallaRecuperarContrasena({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // animación de borde (verde para éxito, rojo para error)
  const borderAnim = useRef(new Animated.Value(0)).current;
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "#4CAF50"],
  });

  const triggerSuccessAnimation = () => {
    Animated.sequence([
      Animated.timing(borderAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.timing(borderAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const triggerErrorAnimation = () => {
    Animated.sequence([
      Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
      Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const handleReset = async () => {
    setError("");
    setInfo("");

    if (!email) {
      setError("Ingresá tu correo.");
      triggerErrorAnimation();
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      setError("Ingresá un correo válido.");
      triggerErrorAnimation();
      return;
    }

    setLoading(true);
    // construyo dinámicamente la URL de reset
    const redirectUrl = Linking.createURL("reset-password");
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: redirectUrl }
    );
    setLoading(false);

    if (resetErr) {
      setError("No pudimos enviar el correo. Intentá de nuevo.");
      triggerErrorAnimation();
    } else {
      // navegación a pantalla de chequeo de mail
      triggerSuccessAnimation();
      navigation.replace("PantallaCheckMail");
    }
  };

  return (
    <Animated.View style={[styles.wrapper, { borderColor }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid
      >
        <View style={styles.topContainer}>
          <LinearGradient
            colors={["#4E8DF5", "#2C68F2"]}
            style={styles.gradientIcon}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={32}
              color="#fff"
            />
          </LinearGradient>
          <Text style={styles.title}>Recuperar contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresá tu correo y te enviaremos un enlace para cambiarla.
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Correo electrónico"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />

            {error ? <HelperText type="error">{error}</HelperText> : null}
            {info ? (
              <HelperText type="info" style={{ color: "#4CAF50" }}>
                {info}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleReset}
              loading={loading}
              style={styles.button}
            >
              Enviar enlace
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.replace("PantallaIniciarSesion")}
              uppercase={false}
              labelStyle={styles.link}
              contentStyle={styles.forgotContent}
            >
              ← Volver al inicio de sesión
            </Button>
          </Card.Content>
        </Card>
      </KeyboardAwareScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderWidth: 4,
    backgroundColor: "#F6F7FA",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
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
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#2073F7",
  },
  link: {
    color: "#2073F7",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  forgotContent: {
    marginTop: 12,
    justifyContent: "center",
  },
});
