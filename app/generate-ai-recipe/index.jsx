import Button from "@/components/shared/Button";
import { GenerateRecipe } from "@/services/AiModel";
import Colors from "@/shared/Colors";
import Prompt from "@/shared/Prompt";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Animated,
} from "react-native";
import EmptyRecipeState from "../../components/recipe/EmptyRecipeState";
import RecipeOptionList from "../../components/recipe/RecipeOptionList";

export default function GenerateAiRecipe() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeOption, setRecipeOption] = useState(null);
  const paddingAnim = useRef(new Animated.Value(0)).current;

  const GenerateRecipeOptions = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const PROMPT = input + Prompt.GENERATE_RECIPE_OPTION_PROMPT;
      const result = await GenerateRecipe(PROMPT);
      const extractJson =
        result.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const jsonMatch = extractJson.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error("Ai response dose not contain JSON");
      }
      const jsonString = jsonMatch[1];
      const parsedJsonResp = JSON.parse(jsonString || "{}");

      console.log(parsedJsonResp);
      setRecipeOption(parsedJsonResp);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.timing(paddingAnim, {
        toValue: e.endCoordinates.height,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    });
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      Animated.timing(paddingAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [paddingAnim]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: Colors.WHITE }}
    >
      <Animated.View style={{ flex: 1, paddingBottom: paddingAnim }}>
        <ScrollView
          style={{ backgroundColor: Colors.WHITE, height: "100%" }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              paddingTop: 55,
              padding: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginBottom: 10 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                <Text style={{ marginLeft: 5, fontSize: 20 }}>Back</Text>
              </View>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              Ai Recipe Generator ✨
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontSize: 16,
                color: Colors.GRAY,
              }}
            >
              Generate Personalized recipes using AI
            </Text>
            <TextInput
              style={[styles.textArea, { color: Colors.PRIMARY }]}
              placeholder="Enter your ingrdient or recipe name"
              placeholderTextColor={"#ccc"}
              onChangeText={(value) => setInput(value)}
              multiline
              textAlignVertical="top"
              returnKeyType="done"
            />
            <View style={{ marginTop: 25 }}>
              <Button
                title={"Generate Recipe"}
                onPress={GenerateRecipeOptions}
                loading={loading}
              />
            </View>
            {recipeOption && recipeOption.length > 0 ? (
              <RecipeOptionList RecipeOption={recipeOption} />
            ) : (
              <EmptyRecipeState />
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textArea: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    marginTop: 15,
    height: 150,
    backgroundColor: Colors.WHITE,
  },
});
