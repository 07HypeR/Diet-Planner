import React from "react";
import { TextInput } from "react-native";

export default function Input({ placeholder, password = false, onChangeText }) {
  return (
    <TextInput
      secureTextEntry={password}
      placeholder={placeholder}
      placeholderTextColor={"#ccc"}
      onChangeText={(value) => onChangeText(value)}
      style={{
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 18,
        paddingVertical: 20,
        width: "100%",
        marginTop: 15,
      }}
    />
  );
}
