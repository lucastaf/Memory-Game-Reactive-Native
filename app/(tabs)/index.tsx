import { Image, StyleSheet, Text, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import CardComponent from "@/components/cards/cardComponents";
import CardDeck from "@/components/cards/cardDeck";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/card-games.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.titleContainer}>
        <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>
          Jogo da memória:
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 18,
          }}
        >
          Encontre todos os pares de cartas iguais para vencer
        </ThemedText>
      </View>
      <CardDeck />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 200,
    width: 200,
    bottom: -50,
    left: 20,
    position: "absolute",
  },
});
