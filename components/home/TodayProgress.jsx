import { RefreshDataContext } from "@/context/RefreshDataContex";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import { useConvex } from "convex/react";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { UserContext } from "../../context/UserContext";

export default function TodayProgress() {
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const [totalConsumedCalories, setTotalConsumedCalories] = useState();
  const [totalConsumedProteins, setTotalConsumedProteins] = useState();
  const { refreshData, setRefreshData } = useContext(RefreshDataContext);

  useEffect(() => {
    user && GetTotalCaloriesConsumed() && GetTotalProteinsConsumed();
  }, [user, refreshData]);

  const GetTotalCaloriesConsumed = async () => {
    const result = await convex.query(api.MealPlan.GetTotalCaloriesConsumed, {
      date: moment().format("DD/MM/YYYY"),
      uid: user?._id,
    });
    console.log(result);
    setTotalConsumedCalories(result);
  };
  const GetTotalProteinsConsumed = async () => {
    const result = await convex.query(api.MealPlan.GetTotalProteinsConsumed, {
      date: moment().format("DD/MM/YYYY"),
      uid: user?._id,
    });
    console.log(result);
    setTotalConsumedProteins(result);
  };

  const caloriesPercentage =
    user?.calories && totalConsumedCalories
      ? Math.min((totalConsumedCalories / user.calories) * 100, 100)
      : 0;

  const proteinsPercentage =
    user?.proteins && totalConsumedProteins
      ? Math.min((totalConsumedProteins / user.proteins) * 100, 100)
      : 0;

  return (
    <View
      style={{
        marginTop: 15,
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Today's Goal
        </Text>
        <Text style={{ fontSize: 18 }}>{moment().format("MMM DD, yyyy")}</Text>
      </View>
      <View>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: Colors.PRIMARY,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {totalConsumedCalories}/{user?.calories} Kcal
        </Text>
        <View
          style={{
            backgroundColor: Colors.GRAY,
            height: 10,
            borderRadius: 99,
            marginTop: 15,
            opacity: 0.7,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.PRIMARY,
              height: 10,
              borderRadius: 99,
              width: `${caloriesPercentage}%`,
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text>Calories Consumes</Text>
          <Text>Keep it up! 🔥</Text>
        </View>
      </View>
      <Text
        style={{
          textAlign: "center",
          marginTop: 15,
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        You're doing great! 😉
      </Text>
      <View>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: Colors.PRIMARY,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {totalConsumedProteins}/{user?.proteins} g
        </Text>
        <View
          style={{
            backgroundColor: Colors.GRAY,
            height: 10,
            borderRadius: 99,
            marginTop: 15,
            opacity: 0.7,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.PRIMARY,
              height: 10,
              borderRadius: 99,
              width: `${proteinsPercentage}%`,
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text>Proteins Consumes</Text>
          <Text>Keep it up! 🔥</Text>
        </View>
      </View>
    </View>
  );
}
