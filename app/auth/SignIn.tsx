import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const onSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields!", "Enter All field Value");
      return;
    }
  };
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        padding: 25,
      }}
    >
      <Image
        source={require("./../../assets/images/logo.png")}
        style={{
          width: 150,
          height: 150,
          marginTop: 60,
        }}
      />
      <Text
        style={{
          fontSize: 35,
          fontWeight: "bold",
        }}
      >
        Welcome Back
      </Text>
      <View style={{ width: "100%", marginTop: 20 }}>
        <Input placeholder={"Email"} onChangeText={setEmail} />
        <Input
          placeholder={"Password"}
          password={true}
          onChangeText={setPassword}
        />
      </View>
      <View style={{ width: "100%", marginTop: 15 }}>
        <Button title={"Sign In"} onPress={() => onSignIn()} />

        <Text style={{ textAlign: "center", fontSize: 16, marginTop: 15 }}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push("/auth/SignUp")}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginTop: 5,
              fontWeight: "bold",
            }}
          >
            Create New Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
