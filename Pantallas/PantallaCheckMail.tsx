// Pantallas/PantallaCheckMail.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function PantallaCheckMail({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <LinearGradient
            colors={["#4CAF50", "#81C784"]}
            style={styles.iconWrapper}
          >
            <MaterialCommunityIcons
              name="email-check-outline"
              size={48}
              color="#fff"
            />
          </LinearGradient>
          <Text style={styles.title}>¡Listo!</Text>
          <Text style={styles.subtitle}>
            Revisá tu correo y tocá el enlace para restablecer tu contraseña.
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.replace("PantallaIniciarSesion")}
            uppercase={false}
            labelStyle={{ color: "#2073F7" }}
            style={styles.button}
          >
            Volver al inicio de sesión
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F6F7FA",
  },
  card: {
    borderRadius: 16,
    width: width - 32,
    alignSelf: "center",
  },
  content: {
    alignItems: "center",
    paddingVertical: 24,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1C355E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#90949C",
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    alignSelf: "center",
  },
});
