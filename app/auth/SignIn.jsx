import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { auth } from "@/services/FirebaseConfig";
import { useConvex } from "convex/react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const convex = useConvex();
  const { user, setUser } = useContext(UserContext);
  const onSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields!", "Enter All field Value");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userData = await convex.query(api.Users.GetUser, {
          email: email,
        });
        console.log(userData);
        setLoading(true);
        setUser(userData);
        router.replace("/(tabs)/Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        setLoading(false);
        Alert.alert(
          "Incorrect Email & Password",
          "Please enter valid email & password"
        );
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
          <Button
            title={"Sign In"}
            onPress={() => onSignIn()}
            loading={loading}
          />

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
    </ScrollView>
  );
}
