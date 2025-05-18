import Button from "@/components/shared/Button";
import { GenerateRecipe } from "@/services/AiModel";
import Colors from "@/shared/Colors";
import Prompt from "@/shared/Prompt";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmptyRecipeState from "../../components/recipe/EmptyRecipeState";
import RecipeOptionList from "../../components/recipe/RecipeOptionList";

export default function GenerateAiRecipe() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeOption, setRecipeOption] = useState();
  const GenerateRecipeOptions = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const PROMPT = input + Prompt.GENERATE_RECIPE_OPTION_PROMPT;
      const result = await GenerateRecipe(PROMPT);
      // console.log(result.choices[0].message);
      const extractJson =
        result.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const jsonMatch = extractJson.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error("Ai response dose not contain JSON");
      }
      const jsonString = jsonMatch[1];
      const parsedJsonResp = JSON.parse(jsonString ?? "{}");

      console.log(parsedJsonResp);
      setRecipeOption(parsedJsonResp);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  return (
    <ScrollView
      style={{ backgroundColor: Colors.WHITE, height: "100%" }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          paddingTop: Platform.OS == "ios" ? 40 : 40,
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={router.back} style={{ marginBottom: 10 }}>
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
          style={[styles.textArea, { color: "#3a6b33" }]}
          placeholder="Enter your ingrdient or recipe name"
          placeholderTextColor={"#ccc"}
          onChangeText={(value) => setInput(value)}
        />
        <View style={{ marginTop: 25 }}>
          <Button
            title={"Generate Recipe"}
            onPress={GenerateRecipeOptions}
            loading={loading}
          />
        </View>
        {recipeOption?.length > 0 ? (
          <RecipeOptionList RecipeOption={recipeOption} />
        ) : (
          <EmptyRecipeState />
        )}
      </View>
    </ScrollView>
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
    textAlignVertical: "top",
    backgroundColor: Colors.WHITE,
  },
});
