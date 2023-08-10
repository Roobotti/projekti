import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useState, useEffect, useContext, useRef } from "react";
import LottieView from "lottie-react-native";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export const LottieLoad = () => {
  return (
    <AnimatedLottieView
      source={require("./HourGlass.json")}
      autoPlay
      loop
      speed={10}
      style={{ width: 100 }}
    />
  );
};

export const ControllingAnimationProgress = () => {
  const animationProgress = useRef(new Animated.Value(0));
  const animationProgress1 = useRef(new Animated.Value(0));
  const [state, setState] = useState(0);

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setState(1);
    });
  }, []);

  useEffect(() => {
    if (state === 1) {
      Animated.timing(animationProgress1.current, {
        toValue: 0.9,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        setState(2);
      });
    }
  }, [state]);

  return (
    <View>
      {state === 0 && (
        <AnimatedLottieView
          source={require("./HourGlass.json")}
          progress={animationProgress.current}
          style={{ width: 100 }}
        />
      )}
      {state === 1 && (
        <AnimatedLottieView
          source={require("./HourGlass.json")}
          progress={animationProgress1.current}
          style={{ width: 100 }}
        />
      )}
    </View>
  );
};
