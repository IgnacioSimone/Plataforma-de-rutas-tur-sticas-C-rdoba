// Pantallas/PantallaRegistro.tsx
import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { Text, TextInput, Button, Card, HelperText } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../supabaseClient";

const { width } = Dimensions.get("window");

export default function PantallaRegistro({ navigation }: any) {
  // ── Estados de formulario ───────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Animación de borde ───────────────────────────────────────────────────
  const borderAnim = useRef(new Animated.Value(0)).current;
  const triggerSuccessAnimation = () => {
    Animated.sequence([
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "#4CAF50"],
  });

  // ── Validaciones según tu tesis ──────────────────────────────────────────
  const validate = (): boolean => {
    if (firstName.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return false;
    }
    if (lastName.length < 2) {
      setError("El apellido debe tener al menos 2 caracteres");
      return false;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      setError("Ingresá un correo válido");
      return false;
    }
    const rules = [
      { regex: /.{8,}/, msg: "Mínimo 8 caracteres" },
      { regex: /[A-Z]/, msg: "1 mayúscula" },
      { regex: /[a-z]/, msg: "1 minúscula" },
      { regex: /[0-9]/, msg: "1 número" },
      { regex: /[^A-Za-z0-9]/, msg: "1 carácter especial" },
    ];
    for (let { regex, msg } of rules) {
      if (!regex.test(password)) {
        setError(`La contraseña necesita ${msg}`);
        return false;
      }
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    setError("");
    return true;
  };

  // ── Manejo de registro ───────────────────────────────────────────────────
  // ...
  const handleRegistro = async () => {
    setError("");
    setInfo("");
    if (!validate()) return;

    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "rtc://login", // tu esquema femenino
        data: {
          // <-- aquí!
          firstName,
          lastName,
        },
      },
    });
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setInfo(
      "¡Registro exitoso! Revisa tu correo y confirmá tu cuenta antes de iniciar sesión."
    );
    triggerSuccessAnimation();
    navigation.replace("PantallaRegistroExitoso");
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Animated.View style={[styles.wrapper, { borderColor }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        extraScrollHeight={20}
      >
        {/* ICONO Y TÍTULOS */}
        <View style={styles.topContainer}>
          <LinearGradient
            colors={["#4E8DF5", "#2C68F2"]}
            style={styles.gradientIcon}
          >
            <MaterialCommunityIcons name="account" size={32} color="#fff" />
          </LinearGradient>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Completa tus datos para registrarte
          </Text>
        </View>

        {/* FORMULARIO */}
        <Card style={styles.card}>
          <Card.Content>
            {/* Nombre y Apellido */}
            <View style={styles.row}>
              <View style={[styles.half, { marginRight: 6 }]}>
                <TextInput
                  placeholder="Nombre"
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="account" />}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={[styles.half, { marginLeft: 6 }]}>
                <TextInput
                  placeholder="Apellido"
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="account-outline" />}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            {/* Email */}
            <TextInput
              placeholder="Correo electrónico"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.hint}>
              Te enviaremos un correo de confirmación
            </Text>

            {/* Contraseña */}
            <TextInput
              placeholder="Contraseña"
              mode="outlined"
              style={styles.input}
              secureTextEntry={!visible1}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={visible1 ? "eye-off" : "eye"}
                  onPress={() => setVisible1(!visible1)}
                />
              }
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.hint}>
              Mínimo 8 caract., mayúscula, minúscula, número y especial
            </Text>

            {/* Confirmar contraseña */}
            <TextInput
              placeholder="Confirmar contraseña"
              mode="outlined"
              style={styles.input}
              secureTextEntry={!visible2}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={visible2 ? "eye-off" : "eye"}
                  onPress={() => setVisible2(!visible2)}
                />
              }
              value={confirm}
              onChangeText={setConfirm}
            />

            {/* Mensajes */}
            {error ? <HelperText type="error">{error}</HelperText> : null}
            {info ? (
              <HelperText type="info" style={{ color: "#4CAF50" }}>
                {info}
              </HelperText>
            ) : null}

            {/* Botón Registrar */}
            <Button
              mode="contained"
              onPress={handleRegistro}
              loading={loading}
              style={styles.button}
              contentStyle={{ paddingVertical: 10 }}
            >
              Registrarse
            </Button>

            {/* Link volver a login */}
            <View style={styles.linkRow}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={16}
                color="#2073F7"
              />
              <Text
                style={styles.link}
                onPress={() => navigation.navigate("PantallaIniciarSesion")}
              >
                Volver al inicio de sesión
              </Text>
            </View>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  topContainer: {
    alignItems: "center",
    marginBottom: 16,
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
    fontSize: 28,
    fontWeight: "600",
    color: "#1C355E",
  },
  subtitle: {
    fontSize: 15,
    color: "#90949C",
    marginTop: 4,
  },
  card: {
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingVertical: 16,
    width: width - 32,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  half: {
    flex: 1,
  },
  input: {
    backgroundColor: "#F1F3F5",
    marginBottom: 6,
    borderRadius: 12,
  },
  hint: {
    fontSize: 11,
    color: "#A0A5B9",
    marginBottom: 6,
    marginLeft: 6,
  },
  button: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#2073F7",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  link: {
    color: "#2073F7",
    fontSize: 15,
    marginLeft: 4,
  },
});
