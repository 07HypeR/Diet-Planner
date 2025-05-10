import { GenerateRecipe } from "@/services/AiModel";
import Colors from "@/shared/Colors";
import Prompt from "@/shared/Prompt";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LoadingDialog from "../shared/LoadingDialog";

export default function RecipeOptionList({ RecipeOption }) {
  const [loading, setLoading] = useState();
  const onRecipeOptionSelect = async (recipe) => {
    setLoading(true);
    const PROMPT =
      "RecipeName:" +
      recipe?.recipeName +
      " Description:" +
      recipe?.description +
      Prompt.GENERATE_COMPLETE_RECIPE_PROMPT;

    try {
      const result = await GenerateRecipe(PROMPT);
      const extractJson = result.choices[0].message.content
        ?.replace("```json", "")
        .replace("```", "");
      const parsedJsonResp = JSON.parse(extractJson ?? "{}");
      console.log(parsedJsonResp);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Select Recipe</Text>

      <View>
        {RecipeOption?.map((item, index) => (
          <TouchableOpacity
            onPress={() => onRecipeOptionSelect(item)}
            key={index}
            style={{
              padding: 15,
              borderWidth: 1,
              borderRadius: 15,
              marginTop: 15,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {item?.recipeName}
            </Text>
            <Text style={{ color: Colors.GRAY }}>{item?.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <LoadingDialog loading={loading} />
    </View>
  );
}
