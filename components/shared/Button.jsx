import Colors from "@/shared/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function Button({ title, onPress, loading = false, icon = "" }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        padding: 13,
        backgroundColor: Colors.PRIMARY,
        width: "100%",
        borderRadius: 10,
      }}
    >
      {loading ? (
        <ActivityIndicator color={Colors.WHITE} />
      ) : (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: Colors.WHITE,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
          <Ionicons name={icon} size={18} color={Colors.WHITE} />
        </View>
      )}
    </TouchableOpacity>
  );
}
