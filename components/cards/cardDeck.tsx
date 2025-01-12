import { Button, StyleSheet, Text, View } from "react-native";
import CardComponent, { cardProps } from "./cardComponents";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { useRef, useState } from "react";

const cartas = ["❤️", "🚗", "🎮", "☂️", "🍔", "❤️", "🚗", "🎮", "☂️", "🍔"];
export default function CardDeck() {
  const selectedCards = useRef<
    {
      card: card;
      callback: (res: boolean) => void;
    }[]
  >([]);
  const [blockCards, setBlockCards] = useState(false);
  const [tryCount, setTryCount] = useState(0);

  function clear(win: boolean) {
    setTryCount((prev) => prev + 1);
    selectedCards.current.forEach((item) => item.callback(win));
    selectedCards.current = [];
    setBlockCards(false);
  }

  const handleCardSelection: cardProps["onCardSelection"] = (card, showing) => {
    if (!showing) {
      selectedCards.current = selectedCards.current.filter(
        (item) => item.card.id != card.id
      );
      return false;
    } else {
      const returnPromise = new Promise<boolean>((resolve) => {
        selectedCards.current.push({ card, callback: resolve });
      });
      if (selectedCards.current.length >= 2) {
        const win = selectedCards.current.every(
          (item) => item.card.name == selectedCards.current[0].card.name
        );

        setBlockCards(true);
        setTimeout(() => clear(win), 700);
      }
      return returnPromise;
    }
  };
  return (
    <GestureHandlerRootView>
      <Text>Tentativas : {tryCount}</Text>
      <View style={DeckStyles.container}>
        <FlatList
          numColumns={4}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10, alignItems: "center" }}
          data={cartas}
          renderItem={(item) => (
            <CardComponent
              card={{
                id: item.index,
                name: item.item,
              }}
              onCardSelection={handleCardSelection}
              blockCard={blockCards}
            />
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const DeckStyles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
  },
});

export interface card {
  name: string;
  id: number;
}
