import GanerateRecipeCard from "@/components/home/GanerateRecipeCard";
import TodayProgress from "@/components/home/TodayProgress";
import TodaysMealPlan from "@/components/home/TodaysMealPlan";
import Colors from "@/shared/Colors";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  View,
} from "react-native";
import DateSelectionCard from "../../components/shared/DateSelectionCard";

export default function Progress() {
  const [selectedDate, setSelectedDate] = useState();
  const [loading, setLoading] = useState(false);

  const handleDateChange = (date) => {
    setLoading(true);
    setSelectedDate(date);

    // Simulate data loading delay (replace with real fetch if needed)
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View
          style={{
            padding: 20,
            paddingTop: Platform.OS === "ios" ? 40 : 40,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            Progress
          </Text>

          <DateSelectionCard setSelectedDate={handleDateChange} />

          {loading ? (
            <View style={{ paddingVertical: 40 }}>
              <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
          ) : (
            <>
              <TodaysMealPlan selectedDate={selectedDate} />
            </>
          )}
          <TodayProgress />
          <GanerateRecipeCard />
        </View>
      }
    />
  );
}
