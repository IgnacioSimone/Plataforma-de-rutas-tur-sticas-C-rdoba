// Pantallas/PantallaIniciarSesion.tsx
import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { Text, TextInput, Button, Card, HelperText } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../supabaseClient";

const { width } = Dimensions.get("window");

export default function PantallaIniciarSesion({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // Animación de borde para marcar errores
  const borderAnim = useRef(new Animated.Value(0)).current;
  const triggerErrorAnimation = () => {
    Animated.sequence([
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "#E53935"],
  });

  const handleLogin = async () => {
    setError("");
    setInfo("");

    // 1) Validaciones
    if (!email || !password) {
      setError("Por favor completá ambos campos.");
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
    // 2) Intentar login
    const { data: authData, error: loginErr } =
      await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (loginErr) {
      setError("Credenciales inválidas.");
      triggerErrorAnimation();
      return;
    }

    const userId = authData.user.id;

    // 3) Comprobar si ya existe perfil
    const { data: existing, error: selErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (selErr) {
      console.error("Error verificando perfil:", selErr);
      setError("Error interno. Intentá de nuevo.");
      return;
    }

    // 4) Si no existe, crear nuevo perfil con metadata
    if (!existing) {
      const { error: insErr } = await supabase.from("profiles").insert([
        {
          id: userId,
          nombre: authData.user.user_metadata?.firstName || "",
          apellido: authData.user.user_metadata?.lastName || "",
        },
      ]);
      if (insErr) {
        console.error("Error insertando perfil:", insErr);
        setError("No pudimos guardar tu perfil.");
        return;
      }
    }

    // 5) Navegar a Exploración
    navigation.replace("PantallaExploracion");
  };

  return (
    <Animated.View style={[styles.wrapper, { borderColor }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        extraScrollHeight={20}
      >
        {/* CABECERA */}
        <View style={styles.topContainer}>
          <LinearGradient
            colors={["#4E8DF5", "#2C68F2"]}
            style={styles.gradientIcon}
          >
            <MaterialCommunityIcons
              name="lock-open-outline"
              size={32}
              color="#fff"
            />
          </LinearGradient>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Ingresá tus datos para continuar</Text>
        </View>

        {/* FORMULARIO */}
        <Card style={styles.card}>
          <Card.Content>
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
            <TextInput
              placeholder="Contraseña"
              mode="outlined"
              style={styles.input}
              secureTextEntry={!visible}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={visible ? "eye-off" : "eye"}
                  onPress={() => setVisible(!visible)}
                />
              }
              value={password}
              onChangeText={setPassword}
            />

            {error ? <HelperText type="error">{error}</HelperText> : null}
            {info ? (
              <HelperText type="info" style={{ color: "#4CAF50" }}>
                {info}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            >
              Iniciar sesión
            </Button>

            {/* Link Olvidé mi contraseña */}
            <Button
              mode="text"
              onPress={() => navigation.navigate("PantallaRecuperarContrasena")}
              labelStyle={styles.link}
              uppercase={false}
              contentStyle={styles.forgotContent}
            >
              ¿Olvidaste tu contraseña?
            </Button>

            {/* Link Registrarse */}
            <View style={styles.linkRow}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={16}
                color="#2073F7"
              />
              <Text
                style={styles.link}
                onPress={() => navigation.navigate("PantallaRegistro")}
              >
                ¿No tenés cuenta? Registrate
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
  input: {
    backgroundColor: "#F1F3F5",
    marginBottom: 10,
    borderRadius: 12,
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
    textDecorationLine: "underline",
  },
  forgotContent: {
    marginTop: 8,
    justifyContent: "center",
  },
});
