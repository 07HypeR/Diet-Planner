import AddToMealActionSheet from "@/components/recipe/AddToMealActionSheet";
import Colors from "@/shared/Colors";
import {
  Dumbbell01Icon,
  Fire03Icon,
  PlusSignSquareIcon,
  TimeQuarter02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

export default function RecipeIntro({ recipeDetail }) {
  const RecipeJson = recipeDetail?.jsonData;
  const actionSheetRef = useRef(null);
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
            flex: 1,
            flexShrink: 1,
          }}
        >
          {recipeDetail?.recipeName}
        </Text>
        <TouchableOpacity onPress={() => actionSheetRef.current.show()}>
          <HugeiconsIcon
            icon={PlusSignSquareIcon}
            size={40}
            color={Colors.PRIMARY}
          />
        </TouchableOpacity>
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
          <Text style={styles.counts}>{RecipeJson?.calories} Kcal</Text>
        </View>
        <View style={styles.propertyContainer}>
          <HugeiconsIcon
            icon={Dumbbell01Icon}
            style={styles.iconBg}
            color={Colors.PRIMARY}
            size={27}
          />
          <Text style={styles.subText}>Proteins</Text>
          <Text style={styles.counts}>{RecipeJson?.proteins} g</Text>
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
        </View>
      </View>
      <ActionSheet ref={actionSheetRef}>
        <AddToMealActionSheet
          recipeDetail={recipeDetail}
          hideActionSheet={() => actionSheetRef.current.hide()}
        />
      </ActionSheet>
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
