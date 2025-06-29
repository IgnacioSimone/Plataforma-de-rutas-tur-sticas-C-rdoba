// Pantallas/PantallaExploracion.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { supabase } from "../supabaseClient";

const { width } = Dimensions.get("window");

// Tipado según tu tabla "ruta"
type Ruta = {
  id_ruta: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagen_url: string | null;
  estado_validacion: string;
  fecha_creacion: string;
};

const CATEGORIAS = ["Todas", "Cultura", "Gastronomía", "Aventura", "Historia"];

export default function PantallaExploracion({ navigation }: any) {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoria, setCategoria] = useState<string>("Todas");
  const theme = useTheme();

  const fetchRutas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ruta")
      .select("*")
      .eq("estado_validacion", "aprobada")
      .order("fecha_creacion", { ascending: false });

    setLoading(false);
    if (error) console.error("Error al cargar rutas:", error);
    else setRutas(data as Ruta[]);
  };

  useEffect(() => {
    fetchRutas();
  }, [categoria]);

  const renderItem = ({ item }: { item: Ruta }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("DetalleRuta", { rutaId: item.id_ruta })
      }
    >
      <Card style={styles.card}>
        {item.imagen_url ? (
          <Card.Cover source={{ uri: item.imagen_url }} style={styles.imagen} />
        ) : null}
        <Card.Content>
          <Text variant="titleMedium" style={styles.titulo}>
            {item.titulo}
          </Text>
          <Text
            variant="bodySmall"
            numberOfLines={2}
            style={styles.descripcion}
          >
            {item.descripcion}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filtros}>
        {CATEGORIAS.map((cat) => (
          <Chip
            key={cat}
            mode={categoria === cat ? "flat" : "outlined"}
            selected={categoria === cat}
            onPress={() => setCategoria(cat)}
            style={[
              styles.chip,
              categoria === cat && {
                backgroundColor: theme.colors.primaryContainer,
              },
            ]}
          >
            {cat}
          </Chip>
        ))}
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={rutas}
          keyExtractor={(r) => r.id_ruta}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F6F7FA" },
  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    justifyContent: "center",
  },
  chip: { margin: 4 },
  list: { paddingBottom: 16 },
  card: {
    marginBottom: 12,
    borderRadius: 14,
    width: width - 32,
    alignSelf: "center",
  },
  imagen: { height: 140, borderTopLeftRadius: 14, borderTopRightRadius: 14 },
  titulo: { fontWeight: "600", marginTop: 8 },
  descripcion: { color: "#6b6b6b", marginTop: 4 },
});
