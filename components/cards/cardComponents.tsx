import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function CardComponent({
  frontText,
}: {
  frontText: string;
}) {
  const rotation = useSharedValue(180);
  const rotate = (delta: number) => {
    rotation.value = withTiming(rotation.value + delta, {}, () =>
      rotation.value > 360 ? rotation.set(rotation.value % 360) : null
    );
  };

  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: rotation.value + "deg",
        },
      ],
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
    <TouchableWithoutFeedback onPress={() => rotate(180)}>
      <Animated.View style={[rotate3dStyle.container, rotationStyle]}>
        <Animated.Text style={[rotate3dStyle.element, frontFaceStyle]}>
          {frontText}
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
    width: 50,
    height: 50,
    backgroundColor: "white",
  },
  element: {
    width: "100%",
    position: "absolute",
    backgroundColor: "gray",
  },
});
