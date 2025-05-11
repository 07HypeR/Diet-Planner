import Colors from "@/shared/Colors";
import { FlatList, Text, View } from "react-native";

export default function RecipeIngredient({ recipeDetail }) {
  const ingredients = recipeDetail?.jsonData?.ingredients;
  console.log(ingredients);

  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Ingredients
        </Text>

        <Text
          style={{
            fontSize: 20,
          }}
        >
          {ingredients?.length} Items
        </Text>
      </View>

      <FlatList
        data={ingredients}
        renderItem={({ item, index }) => (
          <View
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                gap: 5,
              }}
            >
              <Text
                style={{
                  padding: 7,
                  fontSize: 23,
                  backgroundColor: Colors.SECONDARY,
                  borderRadius: 99,
                }}
              >
                {item?.icon}
              </Text>

              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "600",
                  flexShrink: 1,
                  flexWrap: "wrap",
                }}
              >
                {item?.ingredient}
              </Text>
            </View>
            <View
              style={{
                maxWidth: "40%",
                marginLeft: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.GRAY,
                  textAlign: "right",
                }}
              >
                {item?.quantity}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
