import { RefreshDataContext } from "@/context/RefreshDataContex";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import { CalendarAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useConvex } from "convex/react";
import { useRouter } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Button from "../shared/Button";
import MealPlanCard from "./MealPlanCard";

export default function TodaysMealPlan({ selectedDate }) {
  const [mealPlan, setMealPlan] = useState();
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const { refreshData, setRefreshData } = useContext(RefreshDataContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && selectedDate !== undefined) {
      GetTodaysMealPlan();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (user) {
      convex
        .query(api.MealPlan.GetTodaysMealPlan, {
          date: selectedDate ?? moment().format("DD/MM/YYYY"),
          uid: user?._id,
        })
        .then((result) => setMealPlan(result));
    }
  }, [refreshData]);

  const GetTodaysMealPlan = async () => {
    setLoading(true);
    try {
      const result = await convex.query(api.MealPlan.GetTodaysMealPlan, {
        date: selectedDate ?? moment().format("DD/MM/YYYY"),
        uid: user?._id,
      });
      setMealPlan(result);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{ marginTop: 15 }}>
      {!selectedDate && (
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Today's Meal Plan
        </Text>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.PRIMARY}
          style={{ marginTop: 20 }}
        />
      ) : !mealPlan || mealPlan.length === 0 ? (
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
            You don't have any meal plan for{" "}
            {selectedDate
              ? moment(selectedDate, "DD/MM/YYYY").isSame(moment(), "day")
                ? "Today"
                : moment(selectedDate, "DD/MM/YYYY").isSame(
                      moment().add(1, "day"),
                      "day"
                    )
                  ? "Tomorrow"
                  : "this day"
              : "Today"}
          </Text>

          <Button
            title={"Create New Meal Plan"}
            onPress={() => router.push("/(tabs)/Meals")}
          />
        </View>
      ) : (
        <View>
          <FlatList
            data={mealPlan}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <MealPlanCard
                mealPlanInfo={item}
                showCheckbox={
                  !selectedDate ||
                  moment(selectedDate, "DD/MM/YYYY").isSame(moment(), "day")
                }
              />
            )}
          />
        </View>
      )}
    </View>
  );
}
