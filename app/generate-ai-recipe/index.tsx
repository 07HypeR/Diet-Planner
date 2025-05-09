import Button from "@/components/shared/Button";
import { GenerateRecipe } from "@/services/AiModel";
import Colors from "@/shared/Colors";
import Prompt from "@/shared/Prompt";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import EmptyRecipeState from "../../components/recipe/EmptyRecipeState";
import RecipeOptionList from "../../components/recipe/RecipeOptionList";

export default function GenerateAiRecipe() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeOption, setRecipeOption] = useState<any[]>([]);
  const GenerateRecipeOptions = async () => {
    setLoading(true);

    try {
      const PROMPT = input + Prompt.GENERATE_RECIPE_OPTION_PROMPT;
      const result = await GenerateRecipe(PROMPT);
      // console.log(result.choices[0].message);
      const extractJson = result.choices[0].message.content
        ?.replace("```json", "")
        .replace("```", "");
      const parsedJsonResp = JSON.parse(extractJson ?? "{}");
      console.log(parsedJsonResp);
      setRecipeOption(parsedJsonResp);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  return (
    <View
      style={{
        paddingTop: Platform.OS == "ios" ? 50 : 50,
        padding: 20,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
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
        style={styles.textArea}
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
