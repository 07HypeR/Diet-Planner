import GanerateRecipeCard from "@/components/home/GanerateRecipeCard";
import TodayProgress from "@/components/home/TodayProgress";
import TodaysMealPlan from "@/components/home/TodaysMealPlan";
import React, { useState } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import DateSelectionCard from "../../components/shared/DateSelectionCard";

export default function Progress() {
  const [selectedDate, setSelectedDate] = useState();
  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View
          style={{
            padding: 20,
            paddingTop: Platform?.OS == "ios" ? 55 : 55,
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
          <DateSelectionCard setSelectedDate={setSelectedDate} />
          <TodaysMealPlan selectedDate={selectedDate} />
          <TodayProgress />
          <GanerateRecipeCard />
        </View>
      }
    />
  );
}
