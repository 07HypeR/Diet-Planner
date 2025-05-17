import { RefreshDataContext } from "@/context/RefreshDataContex";
import { api } from "@/convex/_generated/api";
import AnimatedCounter from "@/shared/AnimatedCounter";
import Colors from "@/shared/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useConvex } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { UserContext } from "../../context/UserContext";

export default function TodayProgress() {
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const [totalConsumedCalories, setTotalConsumedCalories] = useState(0);
  const [totalConsumedProteins, setTotalConsumedProteins] = useState(0);
  const { refreshData } = useContext(RefreshDataContext);

  const [animatedCalories] = useState(new Animated.Value(0));
  const [animatedProteins] = useState(new Animated.Value(0));

  const [prevCalories, setPrevCalories] = useState(0);
  const [prevProteins, setPrevProteins] = useState(0);

  const fadeCalorieMessage = useRef(new Animated.Value(0)).current;
  const fadeProteinMessage = useRef(new Animated.Value(0)).current;

  // NEW: Scale Animated values for icons
  const [scaleCalorieIcon] = useState(new Animated.Value(1));
  const [scaleProteinIcon] = useState(new Animated.Value(1));

  useEffect(() => {
    user && GetTotalCaloriesConsumed() && GetTotalProteinsConsumed();
  }, [user, refreshData]);

  const fadeInOut = (fadeAnim) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // NEW: Bounce animation helper
  const bounceIcon = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.4,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const GetTotalCaloriesConsumed = async () => {
    const result = await convex.query(api.MealPlan.GetTotalCaloriesConsumed, {
      date: moment().format("DD/MM/YYYY"),
      uid: user?._id,
    });
    setTotalConsumedCalories(result);

    const percentage =
      user?.calories && result
        ? Math.min((result / user.calories) * 100, 100)
        : 0;

    const prevPercentage =
      user?.calories && prevCalories
        ? Math.min((prevCalories / user.calories) * 100, 100)
        : 0;

    if (percentage > prevPercentage) {
      fadeInOut(fadeCalorieMessage);
      bounceIcon(scaleCalorieIcon); // Animate calorie icon bounce
    }

    setPrevCalories(result);

    Animated.timing(animatedCalories, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const GetTotalProteinsConsumed = async () => {
    const result = await convex.query(api.MealPlan.GetTotalProteinsConsumed, {
      date: moment().format("DD/MM/YYYY"),
      uid: user?._id,
    });
    setTotalConsumedProteins(result);

    const percentage =
      user?.proteins && result
        ? Math.min((result / user.proteins) * 100, 100)
        : 0;

    const prevPercentage =
      user?.proteins && prevProteins
        ? Math.min((prevProteins / user.proteins) * 100, 100)
        : 0;

    if (percentage > prevPercentage) {
      fadeInOut(fadeProteinMessage);
      bounceIcon(scaleProteinIcon); // Animate protein icon bounce
    }

    setPrevProteins(result);

    Animated.timing(animatedProteins, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const animatedCaloriesWidth = animatedCalories.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const animatedProteinsWidth = animatedProteins.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

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
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Today's Goal</Text>
        <Text style={{ fontSize: 18 }}>{moment().format("MMM DD, yyyy")}</Text>
      </View>

      {/* Calories Section */}
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 10,
          }}
        >
          {/* Animated Icon */}
          <Animated.View
            style={{
              transform: [{ scale: scaleCalorieIcon }],
              marginTop: 10,
            }}
          >
            <MaterialCommunityIcons name="fire" size={30} color={Colors.RED} />
          </Animated.View>

          <AnimatedCounter
            targetValue={totalConsumedCalories}
            suffix={`/${user?.calories} Kcal`}
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: Colors.PRIMARY,
              marginTop: 10,
              textAlign: "center",
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: Colors.GRAY,
            height: 10,
            borderRadius: 99,
            marginTop: 15,
            opacity: 0.7,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              width: animatedCaloriesWidth,
              height: 10,
              borderRadius: 99,
            }}
          >
            <LinearGradient
              colors={[Colors.PRIMARY, Colors.BLUE]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                borderRadius: 99,
              }}
            />
          </Animated.View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text>Calories Consumed</Text>
          <Text>Keep it up! 🙌</Text>
        </View>

        <Animated.Text
          style={{
            opacity: fadeCalorieMessage,
            textAlign: "center",
            marginTop: 15,
            fontSize: 16,
            fontWeight: "bold",
            color: Colors.GREEN,
          }}
        >
          You're doing great! 😉
        </Animated.Text>
      </View>

      {/* Proteins Section */}
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginTop: 10,
          }}
        >
          {/* Animated Icon */}
          <Animated.View
            style={{
              transform: [{ scale: scaleProteinIcon }],
              marginTop: 10,
            }}
          >
            <MaterialCommunityIcons
              name="dumbbell"
              size={30}
              color={Colors.RED}
            />
          </Animated.View>

          <AnimatedCounter
            targetValue={totalConsumedProteins}
            suffix={`/${user?.proteins} g`}
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: Colors.PRIMARY,
              marginTop: 10,
              textAlign: "center",
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: Colors.GRAY,
            height: 10,
            borderRadius: 99,
            marginTop: 15,
            opacity: 0.7,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              width: animatedProteinsWidth,
              height: 10,
              borderRadius: 99,
            }}
          >
            <LinearGradient
              colors={[Colors.PRIMARY, Colors.BLUE]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                borderRadius: 99,
              }}
            />
          </Animated.View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text>Proteins Consumed</Text>
          <Text>Keep it up! 🙌</Text>
        </View>
      </View>
    </View>
  );
}
