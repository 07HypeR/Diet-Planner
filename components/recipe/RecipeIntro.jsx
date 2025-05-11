import Colors from "@/shared/Colors";
import {
  Dumbbell01Icon,
  Fire03Icon,
  PlusSignSquareIcon,
  TimeQuarter02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image, StyleSheet, Text, View } from "react-native";

export default function RecipeIntro({ recipeDetail }) {
  const RecipeJson = recipeDetail?.jsonData;
  return (
    <View>
      <Image
        source={{ uri: recipeDetail?.imageUrl }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 15,
        }}
      />

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
          }}
        >
          {recipeDetail?.recipeName}
        </Text>
        <HugeiconsIcon
          icon={PlusSignSquareIcon}
          size={40}
          color={Colors.PRIMARY}
        />
      </View>
      <Text
        style={{
          fontSize: 16,
          marginTop: 6,
          color: Colors.GRAY,
          lineHeight: 25,
        }}
      >
        {RecipeJson?.description}
      </Text>

      <View
        style={{
          marginTop: 15,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View style={styles.propertyContainer}>
          <HugeiconsIcon
            icon={Fire03Icon}
            color={Colors.PRIMARY}
            style={styles.iconBg}
            size={27}
          />
          <Text style={styles.subText}>Calories</Text>
          <Text style={styles.counts}>{RecipeJson?.calories}</Text>
        </View>
        <View style={styles.propertyContainer}>
          <HugeiconsIcon
            icon={Dumbbell01Icon}
            style={styles.iconBg}
            color={Colors.PRIMARY}
            size={27}
          />
          <Text style={styles.subText}>Proteins</Text>
          <Text style={styles.counts}>{RecipeJson?.proteins}</Text>
        </View>
        <View style={styles.propertyContainer}>
          <HugeiconsIcon
            icon={TimeQuarter02Icon}
            style={styles.iconBg}
            color={Colors.PRIMARY}
            size={27}
          />
          <Text style={styles.subText}>Time</Text>
          <Text style={styles.counts}>{RecipeJson?.cookTime} Min</Text>
          {/* </View>
        <View style={styles.propertyContainer}>
          <HugeiconsIcon
            icon={ServingFoodIcon}
            style={styles.iconBg}
            color={Colors.PRIMARY}
            size={27}
          />
          <Text style={styles.subText}>Serve</Text>
          <Text style={styles.counts}>{RecipeJson?.serveTo}</Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBg: {
    padding: 6,
  },
  subText: {
    fontSize: 18,
  },
  propertyContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fbf5ff",
    padding: 6,
    borderRadius: 20,
    flex: 1,
  },
  counts: {
    fontSize: 22,
    color: Colors.PRIMARY,
    fontWeight: "bold",
    textAlign: "center",
  },
});
