import Colors from "@/shared/Colors";
import React from "react";
import { Text, TextInput, View } from "react-native";

export default function Input({
  placeholder,
  password = false,
  onChangeText,
  lable = "",
}) {
  return (
    <View style={{ marginTop: 15, width: "100%" }}>
      <Text style={{ fontWeight: "medium", fontSize: 18 }}>{lable}</Text>
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
          marginTop: 2,
          color: "#3a6b33",
        }}
      />
    </View>
  );
}
