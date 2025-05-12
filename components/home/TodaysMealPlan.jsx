import { RefreshDataContext } from "@/context/RefreshDataContex";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import { CalendarAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useConvex } from "convex/react";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Button from "../shared/Button";
import MealPlanCard from "./MealPlanCard";

export default function TodaysMealPlan() {
  const [mealPlan, setMealPlan] = useState();
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const { refreshData, setRefreshData } = useContext(RefreshDataContext);

  useEffect(() => {
    user && GetTodaysMealPlan();
  }, [user, refreshData]);
  const GetTodaysMealPlan = async () => {
    const result = await convex.query(api.MealPlan.GetTodaysMealPlan, {
      date: moment().format("DD/MM/YYYY"),
      uid: user?._id,
    });
    console.log("-->", result);
    setMealPlan(result);
  };
  return (
    <View style={{ marginTop: 15 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Today's Meal Plan
      </Text>

      {!mealPlan == null ? (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            padding: 20,
            backgroundColor: Colors.WHITE,
            marginTop: 15,
            borderRadius: 15,
          }}
        >
          <HugeiconsIcon
            icon={CalendarAdd01Icon}
            size={40}
            color={Colors.PRIMARY}
          />
          <Text
            style={{
              fontSize: 18,
              color: Colors.GRAY,
              marginBottom: 20,
            }}
          >
            You Don't have any meal plan for Today
          </Text>

          <Button title={"Create New Meal Plan"} />
        </View>
      ) : (
        <View>
          <FlatList
            data={mealPlan}
            renderItem={({ item }) => <MealPlanCard mealPlanInfo={item} />}
          />
        </View>
      )}
    </View>
  );
}
