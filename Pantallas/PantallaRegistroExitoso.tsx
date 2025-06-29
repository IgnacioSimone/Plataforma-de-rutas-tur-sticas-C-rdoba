// Pantallas/PantallaRegistroExitoso.tsx
import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function PantallaRegistroExitoso({ navigation }: any) {
  // Animación del borde
  const borderAnim = useRef(new Animated.Value(0)).current;

  // Al montar, hacemos parpadear el borde verde un par de veces
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]),
      { iterations: 4 }
    ).start();
  }, []);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "#4CAF50"],
  });

  return (
    <Animated.View style={[styles.wrapper, { borderColor }]}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={80}
          color="#4CAF50"
        />
        <Text style={styles.title}>¡Felicitaciones!</Text>
        <Text style={styles.subtitle}>
          Te has registrado correctamente. Por favor, revisa tu correo y
          confirma tu cuenta para continuar.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.replace("PantallaIniciarSesion")}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
        >
          Ir a Iniciar Sesión
        </Button>
      </View>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C355E",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginVertical: 16,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    minWidth: width * 0.6,
  },
});
