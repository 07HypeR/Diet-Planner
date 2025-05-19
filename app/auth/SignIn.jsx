import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { auth } from "@/services/FirebaseConfig";
import { useMutation, useConvex } from "convex/react";
import { useRouter } from "expo-router";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const [failedAttempt, setFailedAttempt] = useState(0);

  const convex = useConvex();
  const createNewUser = useMutation(api.Users.CreateNewUser);
  const { setUser } = useContext(UserContext);

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

  const onSignIn = async () => {
    if (!email || !password) {
      showToastOrAlert("Missing Fields!", "Enter all field values", "🙄");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      if (!firebaseUser.emailVerified) {
        setUnverifiedUser(firebaseUser);
        showToastOrAlert(
          "Email Not Verified ❌",
          "Please verify your email first.",
          "📭"
        );
        setLoading(false);
        return;
      }

      const userData = await convex.query(api.Users.GetUser, { email });

      let finalUserData = userData;
      if (!userData) {
        finalUserData = await createNewUser({
          name: firebaseUser.displayName ?? "New User",
          email: firebaseUser.email ?? email,
        });
      }

      setUser(finalUserData);
      showToastOrAlert("Login Successful ✅", "Start your Diet Track", "🫡");
      router.replace("/(tabs)/Home");
    } catch (error) {
      console.log("SignIn Error:", error.message);
      setFailedAttempt((prev) => prev + 1);

      if (error.code === "auth/user-not-found") {
        showToastOrAlert("User Not Found", "No account with this email", "❌");
      } else {
        showToastOrAlert(
          "Incorrect Email & Password!",
          "Please enter valid credentials",
          "🤨"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!unverifiedUser) return;

    try {
      await sendEmailVerification(unverifiedUser);
      showToastOrAlert(
        "Verification Email Sent ✅",
        "Check your inbox or spam folder",
        "📧"
      );
      setResendCooldown(60);
    } catch (error) {
      console.log("Resend error:", error.message);
      showToastOrAlert("Failed to Resend!", "Try again later", "❌");
    }
  };

  const forgotPassword = async () => {
    if (!email) {
      showToastOrAlert(
        "Email Required",
        "Please enter your email to reset password",
        "📧"
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showToastOrAlert(
        "Reset Link Sent ✅",
        "Check your email to reset your password",
        "📤"
      );
    } catch (error) {
      console.log("Forgot Password Error:", error.message);
      showToastOrAlert("Reset Failed", error.message, "❌");
    }
  };

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardWillShow", () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });
    const hideListener = Keyboard.addListener("keyboardWillHide", () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, alignItems: "center", padding: 25 }}>
            <Image
              source={require("./../../assets/images/logo.png")}
              style={{ width: 150, height: 150, marginTop: 60 }}
            />
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>
              Welcome Back
            </Text>

            <View style={{ width: "100%", marginTop: 20 }}>
              <Input placeholder="Email" onChangeText={setEmail} />
              <Input
                placeholder="Password"
                password
                onChangeText={setPassword}
              />
            </View>

            {failedAttempt >= 1 && (
              <View style={{ width: "100%", marginTop: 10 }}>
                <TouchableOpacity onPress={forgotPassword}>
                  <Text
                    style={{
                      color: "#007AFF",
                      textAlign: "right",
                      fontWeight: "500",
                    }}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ width: "100%", marginTop: 15 }}>
              <Button
                title={loading ? "Signing In..." : "Sign In"}
                onPress={onSignIn}
                disabled={loading}
              />
              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#007AFF"
                  style={{ marginTop: 10 }}
                />
              )}

              {unverifiedUser && (
                <View style={{ marginTop: 20 }}>
                  <TouchableOpacity
                    onPress={resendVerificationEmail}
                    disabled={resendCooldown > 0}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        color: resendCooldown > 0 ? "gray" : "#007AFF",
                        fontWeight: "bold",
                      }}
                    >
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend Verification Email"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text
                style={{ textAlign: "center", fontSize: 16, marginTop: 15 }}
              >
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
