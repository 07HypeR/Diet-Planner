import AddToMealActionSheet from "@/components/recipe/AddToMealActionSheet";
import RecipeIngredient from "@/components/recipe/RecipeIngredient";
import RecipeSteps from "@/components/recipe/RecipeSteps";
import Button from "@/components/shared/Button";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { FlatList, Platform, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import RecipeIntro from "../../components/recipe/RecipeIntro";

export default function RecipeDetail() {
  const { recipeId } = useLocalSearchParams();
  console.log(recipeId); //jd7ch37s9pfqje2vk90dn9rpm97fq0md
  const recipeDetail = useQuery(api.Recipes.GetRecipeById, {
    id: recipeId == undefined && "jd700zp1qvhsgnhtw5za3d76zs7fqjms",
  });
  console.log("recipeDetail", recipeDetail);
  const actionSheetRef = useRef(null);

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View
          style={{
            padding: 20,
            paddingTop: Platform.OS == "ios" ? 55 : 55,
            backgroundColor: Colors.WHITE,
            height: "100%",
          }}
        >
          {/* Recipe Intro */}
          <RecipeIntro recipeDetail={recipeDetail} />
          {/* Recipe Ingrdient */}
          <RecipeIngredient recipeDetail={recipeDetail} />
          {/* Cooking Steps */}
          <RecipeSteps recipeDetail={recipeDetail} />

          <View
            style={{
              marginTop: 15,
            }}
          >
            <Button
              title={"Add to Meal Plan"}
              onPress={() => actionSheetRef.current.show()}
            />
          </View>

          <ActionSheet ref={actionSheetRef}>
            <AddToMealActionSheet
              recipeDetail={recipeDetail}
              hideActionSheet={() => actionSheetRef.current.hide()}
            />
          </ActionSheet>
        </View>
      }
    />
  );
}
