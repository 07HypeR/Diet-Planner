import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { GenerateRecipe, RecipeImageApi } from "@/services/AiModel";
import Colors from "@/shared/Colors";
import Prompt from "@/shared/Prompt";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LoadingDialog from "../shared/LoadingDialog";

export default function RecipeOptionList({ RecipeOption }) {
  const [loading, setLoading] = useState();
  const CreateRecipe = useMutation(api.Recipes.CreateRecipe);
  const { user } = useContext(UserContext);
  const router = useRouter();

  const onRecipeOptionSelect = async (recipe) => {
    if (loading) return;

    setLoading(true);
    try {
      const PROMPT =
        "RecipeName:" +
        recipe?.recipeName +
        " Description:" +
        recipe?.description +
        Prompt.GENERATE_COMPLETE_RECIPE_PROMPT;

      const result = await GenerateRecipe(PROMPT);
      const extractJson = result.choices[0].message.content
        ?.replace("```json", "")
        .replace("```", "");
      const parsedJsonResp = JSON.parse(extractJson ?? "{}");
      console.log(parsedJsonResp);

      // Generate Recipe Image
      const aiImageresp = await RecipeImageApi.post("/generate-image", {
        prompt: parsedJsonResp?.imagePrompt,
      });
      console.log(aiImageresp.data.imageUrl);

      // Save to Db
      const saveRecipeResult = await CreateRecipe({
        jsonData: parsedJsonResp,
        imageUrl: aiImageresp.data.imageUrl,
        recipeName: parsedJsonResp?.recipeName,
        uid: user?._id,
      });
      console.log(saveRecipeResult);

      router.push({
        pathname: "/recipe-detail",
        params: { recipeId: saveRecipeResult },
      });
    } catch (e) {
      console.error("Error generating recipe:", e);
    } finally {
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
      <LoadingDialog loading={loading} title="Loading" />
    </View>
  );
}
