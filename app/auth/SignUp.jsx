import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { api } from "@/convex/_generated/api";
import { auth } from "@/services/FirebaseConfig";
import { useMutation, useConvex } from "convex/react";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  UIManager,
  LayoutAnimation,
} from "react-native";
import Toast from "react-native-toast-message";

export default function SignUp() {
  const router = useRouter();
  const convex = useConvex();
  const createNewUser = useMutation(api.Users.CreateNewUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showToastOrAlert = (title, message, icon) => {
    if (Platform.OS === "ios") {
      Alert.alert(title, message);
    } else {
      Toast.show({
        type: "custom",
        text1: title,
        text2: message,
        position: "bottom",
        visibilityTime: 2500,
        props: { icon: icon || "❗" },
      });
    }
  };

  const onSignUp = async () => {
    if (!name || !email || !password) {
      showToastOrAlert("Missing Fields!", "Please fill in all fields", "🙄");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await sendEmailVerification(user);

      await createNewUser({
        name: name,
        email: email,
      });

      showToastOrAlert(
        "Account Created ✅",
        "Verification email sent. Please check your inbox.",
        "📧"
      );

      router.replace("/auth/SignIn");
    } catch (error) {
      console.log("SignUp Error:", error.message);
      showToastOrAlert("Sign Up Failed", "Email address already exists", "❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const showSub = Keyboard.addListener("keyboardWillShow", () =>
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    );
    const hideSub = Keyboard.addListener("keyboardWillHide", () =>
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, alignItems: "center", padding: 25 }}>
            <Image
              source={require("./../../assets/images/logo.png")}
              style={{ width: 150, height: 150, marginTop: 60 }}
            />
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>
              Create Account
            </Text>

            <View style={{ width: "100%", marginTop: 20 }}>
              <Input placeholder="Name" onChangeText={setName} />
              <Input placeholder="Email" onChangeText={setEmail} />
              <Input
                placeholder="Password"
                password
                onChangeText={setPassword}
              />
            </View>

            <View style={{ width: "100%", marginTop: 15 }}>
              <Button
                title={loading ? "Creating Account..." : "Sign Up"}
                onPress={onSignUp}
                disabled={loading}
              />
              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#007AFF"
                  style={{ marginTop: 10 }}
                />
              )}

              <Text
                style={{ textAlign: "center", fontSize: 16, marginTop: 15 }}
              >
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
