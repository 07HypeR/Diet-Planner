import { RefreshDataContext } from "@/context/RefreshDataContex";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import { CheckmarkSquare02Icon, SquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useMutation } from "convex/react";
import { useContext } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function MealPlanCard({ mealPlanInfo, showCheckbox }) {
  const UpdateStatus = useMutation(api.MealPlan.updateStatus);
  const { refreshData, setRefreshData } = useContext(RefreshDataContext);

  const onCheck = async (status) => {
    const result = await UpdateStatus({
      id: mealPlanInfo?.mealPlan?._id,
      status: status,
      calories: mealPlanInfo?.recipe?.jsonData?.calories,
      proteins: mealPlanInfo?.recipe?.jsonData?.proteins,
    });

    if (Platform.OS === "ios") {
      Alert.alert("Great!", "Status Updated");
    } else {
      Toast.show({
        type: "custom",
        text1: "Great!",
        text2: "Status Updated",
        position: "bottom",
        visibilityTime: 2500,
        props: {
          icon: "🤩",
        },
      });
    }

    setRefreshData(Date.now());
  };

  return (
    <View
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginTop: 10,
      }}
    >
      <Image
        source={{ uri: mealPlanInfo?.recipe?.imageUrl }}
        style={{
          width: 70,
          height: 70,
          borderRadius: 15,
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flex: 1,
          flexWrap: "wrap",
        }}
      >
        <View>
          <Text style={styles.mealTypeText}>
            {mealPlanInfo?.mealPlan?.mealType}
          </Text>
          <Text style={styles.recipeName}>
            {mealPlanInfo?.recipe?.recipeName}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={styles.calories}>
              {mealPlanInfo?.recipe?.jsonData?.calories} Kcal
            </Text>
            <Text style={styles.calories}>
              {mealPlanInfo?.recipe?.jsonData?.proteins} g
            </Text>
          </View>
        </View>
        <View>
          {showCheckbox && (
            <View>
              {mealPlanInfo?.mealPlan?.status != true ? (
                <TouchableOpacity onPress={() => onCheck(true)}>
                  <HugeiconsIcon icon={SquareIcon} color={Colors.GRAY} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => onCheck(false)}>
                  <HugeiconsIcon
                    icon={CheckmarkSquare02Icon}
                    color={Colors.GREEN}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mealTypeText: {
    backgroundColor: Colors.SECONDARY,
    color: Colors.PRIMARY,
    padding: 1,
    paddingHorizontal: 10,
    borderRadius: 99,
    flexWrap: "wrap",
    width: 90,
    textAlign: "center",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  calories: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 5,
    color: Colors.GREEN,
  },
});
