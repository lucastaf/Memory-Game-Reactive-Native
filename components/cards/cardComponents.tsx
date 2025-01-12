import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { card } from "./cardDeck";
import { useEffect, useState } from "react";

export default function CardComponent(props: cardProps) {
  const { card, onCardSelection, blockCard } = props;
  const [showingCard, setShowingCard] = useState(false);
  const rotation = useSharedValue(180);
  const opacity = useSharedValue(1);
  useEffect(() => {
    rotation.value = withSpring(showingCard ? 0 : 180, {}, () =>
      rotation.value > 360 ? rotation.set(rotation.value % 360) : null
    );
  }, [showingCard]);
  const reset = () => {
    setShowingCard(false);
  };

  const onClick = () => {
    if (blockCard) return;
    setShowingCard(!showingCard);
    const onSelection = onCardSelection(card, !showingCard);
    if (typeof onSelection != "boolean") {
      onSelection.then((win) => {
        if (win == false) {
          reset();
        } else {
          opacity.value = withTiming(0);
        }
      });
    }
  };

  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: rotation.value + "deg",
        },
      ],
      opacity: opacity.value,
    };
  });

  const frontFaceStyle = useAnimatedStyle(() => {
    return {
      zIndex: Math.cos((rotation.value * Math.PI) / 180) > 0 ? 10 : -10,
    };
  });

  const backFaceStyle = useAnimatedStyle(() => {
    return {
      zIndex: Math.cos((rotation.value * Math.PI) / 180) < 0 ? 10 : -10,
    };
  });

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <Animated.View style={[rotate3dStyle.container, rotationStyle]}>
        <Animated.Text style={[rotate3dStyle.element, frontFaceStyle]}>
          {card.name}
        </Animated.Text>
        <Animated.Text
          style={[
            rotate3dStyle.element,
            backFaceStyle,
            {
              transform: [{ rotateY: "180deg" }],
            },
          ]}
        >
          ❓❓
        </Animated.Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const rotate3dStyle = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  element: {
    backgroundColor: "white",
    width: "100%",
    fontSize: 30,
    position: "absolute",
    textAlign: "center",
  },
});

export type cardProps = {
  blockCard: boolean;
  card: card;
  onCardSelection: (card: card, showing: boolean) => Promise<Boolean> | boolean;
};
