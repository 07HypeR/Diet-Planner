import GanerateRecipeCard from "@/components/home/GanerateRecipeCard";
import RecipeCard from "@/components/meals/RecipeCard";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import { useQuery } from "convex/react";
import React, { useContext } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  View,
} from "react-native";

export default function Meals() {
  const { user } = useContext(UserContext);
  //@ts-ignore
  const recipeList = useQuery(api.Recipes.GetAllRecipesByUser, {
    uid: user?._id,
  });
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
            {!recipeList ? (
              <View
                style={{
                  height: 600,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
              </View>
            ) : recipeList.length === 0 ? (
              <View
                style={{
                  height: 300,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  marginTop: 100,
                }}
              >
                <Text style={{ fontSize: 48, marginBottom: 10 }}>😕</Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#444",
                    textAlign: "center",
                  }}
                >
                  No delicious recipes yet!
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#777",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  Try generating a recipe from above or check back later.
                </Text>
              </View>
            ) : (
              <FlatList
                data={recipeList}
                numColumns={2}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <RecipeCard recipe={item} />}
                scrollEnabled={false} // Disable inner scroll
              />
            )}
          </View>
        </View>
      }
    />
  );
}
