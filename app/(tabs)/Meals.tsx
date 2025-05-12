import GanerateRecipeCard from "@/components/home/GanerateRecipeCard";
import RecipeCard from "@/components/meals/RecipeCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { FlatList, Platform, Text, View } from "react-native";

export default function Meals() {
  //@ts-ignore
  const recipeList = useQuery(api.Recipes.GetAllRecipes);
  console.log(recipeList);

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
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            Discover Recipes 🥗
          </Text>
          <GanerateRecipeCard />
          <View>
            <FlatList
              data={recipeList}
              numColumns={2}
              renderItem={({ item, index }) => <RecipeCard recipe={item} />}
            />
          </View>
        </View>
      }
    />
  );
}
