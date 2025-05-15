import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { auth } from "@/services/FirebaseConfig";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const createNewUser = useMutation(api.Users.CreateNewUser);
  const router = useRouter();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { user, setUser } = useContext(UserContext);

  const onSignUp = () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Fields!", "Enter All field Value");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        if (user) {
          const result = await createNewUser({
            name: name,
            email: email,
          });
          console.log(result);
          setUser(result);
          router.replace("/(tabs)/Home");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
          Create New Account
        </Text>
        <View style={{ width: "100%", marginTop: 20 }}>
          <Input placeholder={"Full Name"} onChangeText={setName} />
          <Input placeholder={"Email"} onChangeText={setEmail} />
          <Input
            placeholder={"Password"}
            password={true}
            onChangeText={setPassword}
          />
        </View>
        <View style={{ width: "100%", marginTop: 15 }}>
          <Button title={"Create Account"} onPress={() => onSignUp()} />

          <Text style={{ textAlign: "center", fontSize: 16, marginTop: 15 }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                marginTop: 5,
                fontWeight: "bold",
              }}
            >
              Sign In Here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
