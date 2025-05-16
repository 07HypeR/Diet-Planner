import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, TextStyle } from "react-native";

type AnimatedCounterProps = {
  targetValue: number;
  duration?: number;
  precision?: number; // number of decimal places
  suffix?: string;
  style?: TextStyle;
};

export default function AnimatedCounter({
  targetValue,
  duration = 800,
  precision = 0,
  suffix = "",
  style,
}: AnimatedCounterProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: targetValue,
      duration,
      easing: Easing.out(Easing.quad), // smooth easing
      useNativeDriver: false,
    }).start();
  }, [targetValue]);

  useEffect(() => {
    const id = animatedValue.addListener(({ value }) => {
      setDisplayValue(parseFloat(value.toFixed(precision)));
    });

    return () => {
      animatedValue.removeListener(id);
    };
  }, [precision]);

  return (
    <Text style={style}>
      {displayValue}
      {suffix}
    </Text>
  );
}
