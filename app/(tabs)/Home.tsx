import GanerateRecipeCard from "@/components/home/GanerateRecipeCard";
import HomeHeader from "@/components/home/HomeHeader";
import TodayProgress from "@/components/home/TodayProgress";
import TodaysMealPlan from "@/components/home/TodaysMealPlan";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Platform, View } from "react-native";

export default function Home() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user?.weight) {
      router.replace("/preferance");
    }
  }, [user]);
  return (
    <View style={{ padding: 20, marginTop: Platform.OS === "ios" ? 40 : 30 }}>
      <HomeHeader />
      <TodayProgress />
      <GanerateRecipeCard />
      <TodaysMealPlan />
    </View>
  );
}
