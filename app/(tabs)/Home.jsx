import GanerateRecipeCard from "@/components/home/GanerateRecipeCard";
import HomeHeader from "@/components/home/HomeHeader";
import TodayProgress from "@/components/home/TodayProgress";
import TodaysMealPlan from "@/components/home/TodaysMealPlan";
import { UserContext } from "@/context/UserContext";
import Colors from "@/shared/Colors";
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { FlatList, Platform, View } from "react-native";

export default function Home() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user?.weight) {
      router.replace("/preferance");
    }
  }, [user]);
  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      style={{
        backgroundColor: Colors.SECONDARY,
        height: "100%",
      }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View
          style={{ padding: 20, marginTop: Platform.OS === "ios" ? 40 : 40 }}
        >
          <HomeHeader />
          <TodayProgress />
          <GanerateRecipeCard />
          <TodaysMealPlan />
        </View>
      }
    />
  );
}
