import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

export default function Input({
  placeholder,
  password = false,
  onChangeText,
  lable = "",
  rightIcon = null,
}) {
  return (
    <View style={styles.wrapper}>
      {lable ? <Text style={styles.label}>{lable}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          secureTextEntry={password}
          placeholder={placeholder}
          placeholderTextColor={"#ccc"}
          onChangeText={(value) => onChangeText(value)}
          style={styles.input}
        />
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
    width: "100%",
  },
  label: {
    fontWeight: "500",
    fontSize: 18,
    marginBottom: 5,
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 18,
    paddingRight: 45,
    paddingVertical: 20,
    width: "100%",
    color: "#3a6b33",
  },
  icon: {
    position: "absolute",
    right: 15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
