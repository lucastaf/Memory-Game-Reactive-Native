import { Button, StyleSheet, Text, View } from "react-native";
import CardComponent, { cardProps } from "./cardComponents";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import { shuffleArray } from "../shuffleArray";
import ConfettiCannon from "react-native-confetti-cannon";
import Explosion from "react-native-confetti-cannon";

const cardsList = ["❤️", "🚗", "🎮", "☂️", "🍔", "🌝", "🍎", "🏀"];
export default function CardDeck() {
  const [cards, setCards] = useState(cardsList);
  const [reset, setReset] = useState(false);
  const [blockCards, setBlockCards] = useState(false);
  const [tryCount, setTryCount] = useState(0);
  const [winCount, setWinCount] = useState(0);

  const confettiRef = useRef<Explosion | null>();

  const selectedCards = useRef<
    {
      card: card;
      callback: (res: boolean) => void;
    }[]
  >([]);
  useEffect(() => {
    shuffleCards();
  }, []);

  function shuffleCards() {
    setCards(shuffleArray([...cardsList, ...cardsList]));
    setTryCount(0);
    setWinCount(0);
    setReset(!reset);
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
        setTimeout(() => {
          if (!win) setTryCount((prev) => prev + 1);
          else {
            setWinCount((prev) => prev + 1);
            if (winCount == cards.length / 2 - 1) {
              confettiRef.current?.start();
            }
          }

          selectedCards.current.forEach((item) => item.callback(win));
          selectedCards.current = [];
          setBlockCards(false);
        }, 400);
      }
      return returnPromise;
    }
  };

  return (
    <View>
      <GestureHandlerRootView>
        <View style={DeckStyles.header}>
          <Text style={DeckStyles.text}>Tentativas : {tryCount}</Text>
          <Text style={[DeckStyles.text, { marginBottom: 10 }]}>
            Acertos : {winCount}
          </Text>
          <Button title="Resetar" onPress={shuffleCards} />
        </View>
        <View style={DeckStyles.container}>
          <FlatList
            numColumns={4}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ gap: 10, alignItems: "center" }}
            data={cards}
            renderItem={(item) => (
              <CardComponent
                card={{
                  id: item.index,
                  name: item.item,
                }}
                onCardSelection={handleCardSelection}
                blockCard={blockCards}
                reset={reset}
              />
            )}
          />
        </View>
      </GestureHandlerRootView>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "110%",
          zIndex: -10,
        }}
      >
        <ConfettiCannon
          onAnimationEnd={shuffleCards}
          ref={(ref) => (confettiRef.current = ref)}
          count={25}
          autoStart={false}
          origin={{ x: -10, y: 0 }}
          fadeOut
        />
      </View>
    </View>
  );
}

const DeckStyles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export interface card {
  name: string;
  id: number;
}
