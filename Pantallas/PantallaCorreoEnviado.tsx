// Pantallas/PantallaCorreoEnviado.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function PantallaCorreoEnviado({ navigation }: any) {
  const borderAnim = useRef(new Animated.Value(0)).current;

  // disparar el parpadeo y después nada más (queda quieto)
  useEffect(() => {
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
  }, []);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "#4CAF50"],
  });

  return (
    <Animated.View style={[styles.wrapper, { borderColor }]}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#4E8DF5", "#2C68F2"]}
          style={styles.iconWrapper}
        >
          <MaterialCommunityIcons
            name="email-check-outline"
            size={40}
            color="#fff"
          />
        </LinearGradient>
        <Text style={styles.title}>¡Listo!</Text>
        <Text style={styles.message}>
          Te enviamos un enlace a tu correo para restablecer la contraseña.
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.replace("PantallaIniciarSesion")}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
        >
          Volver al inicio de sesión
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
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1C355E",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    width: width * 0.7,
    borderRadius: 10,
    backgroundColor: "#2073F7",
  },
});
