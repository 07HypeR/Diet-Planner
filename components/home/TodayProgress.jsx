import { RefreshDataContext } from "@/context/RefreshDataContex";
import { api } from "@/convex/_generated/api";
import AnimatedCounter from "@/shared/AnimatedCounter";
import Colors from "@/shared/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useConvex } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { UserContext } from "../../context/UserContext";

// Animation hook
const useAnimatedProgress = (initial = 0) => {
  const [value] = useState(new Animated.Value(initial));

  const animateTo = (percentage) => {
    Animated.timing(value, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const width = value.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return { value, animateTo, width };
};

// Message logic
const getProgressMessage = (percentage) => {
  if (percentage < 50) return "You're doing good! 😉";
  if (percentage < 80) return "You're doing great! 😎";
  return "You're Awesome! 🫡";
};

// Reusable section with animated icon & polished styles
const ProgressSection = ({
  label,
  IconComponent,
  iconName,
  consumed,
  target,
  unit,
  progressWidth,
  percentage,
}) => {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [consumed]);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.iconCounterRow}>
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <IconComponent name={iconName} size={30} color={Colors.RED} />
        </Animated.View>
        <AnimatedCounter
          targetValue={consumed}
          suffix={`/${target} ${unit}`}
          precision={0}
          style={styles.counterText}
        />
      </View>

      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[styles.progressBarFill, { width: progressWidth }]}
        >
          <LinearGradient
            colors={[Colors.PRIMARY, Colors.BLUE]}
            start={[0, 0]}
            end={[1, 0]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.labelText}>{label} Consumed</Text>
        <Text style={styles.keepItUpText}>Keep it up! 🙌</Text>
      </View>

      <Text style={styles.progressMessageText}>
        {getProgressMessage(percentage)}
      </Text>
    </View>
  );
};

export default function TodayProgress() {
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const { refreshData } = useContext(RefreshDataContext);

  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProteins, setTotalProteins] = useState(0);

  const caloriesAnim = useAnimatedProgress();
  const proteinsAnim = useAnimatedProgress();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const date = moment().format("DD/MM/YYYY");

      const calories = await convex.query(
        api.MealPlan.GetTotalCaloriesConsumed,
        {
          date,
          uid: user._id,
        }
      );

      const proteins = await convex.query(
        api.MealPlan.GetTotalProteinsConsumed,
        {
          date,
          uid: user._id,
        }
      );

      setTotalCalories(calories);
      setTotalProteins(proteins);

      const calPct = user.calories
        ? Math.min((calories / user.calories) * 100, 100)
        : 0;
      const proPct = user.proteins
        ? Math.min((proteins / user.proteins) * 100, 100)
        : 0;

      caloriesAnim.animateTo(calPct);
      proteinsAnim.animateTo(proPct);
    };

    fetchData();
  }, [user, refreshData]);

  const caloriesPct = user?.calories
    ? Math.min((totalCalories / user.calories) * 100, 100)
    : 0;
  const proteinsPct = user?.proteins
    ? Math.min((totalProteins / user.proteins) * 100, 100)
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Today's Goal</Text>
        <Text style={styles.dateText}>{moment().format("MMM DD, YYYY")}</Text>
      </View>

      {/* Calories Header */}
      <Text style={styles.sectionHeader}>Calories</Text>
      {/* Calories Section */}
      <ProgressSection
        label="Calories"
        IconComponent={MaterialCommunityIcons}
        iconName="fire"
        consumed={totalCalories}
        target={user?.calories || 0}
        unit="Kcal"
        progressWidth={caloriesAnim.width}
        percentage={caloriesPct}
      />

      {/* Proteins Header */}
      <Text style={styles.sectionHeader}>Proteins</Text>
      {/* Proteins Section */}
      <ProgressSection
        label="Proteins"
        IconComponent={MaterialCommunityIcons}
        iconName="dumbbell"
        consumed={totalProteins}
        target={user?.proteins || 0}
        unit="g"
        progressWidth={proteinsAnim.width}
        percentage={proteinsPct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.GRAY,
    marginTop: 25,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 16,
    color: Colors.GRAY,
  },
  sectionContainer: {
    marginTop: 20,
  },
  iconCounterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  counterText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    textAlign: "center",
  },
  progressBarBackground: {
    backgroundColor: Colors.GRAY,
    height: 12,
    borderRadius: 99,
    marginTop: 15,
    opacity: 0.6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 12,
    borderRadius: 99,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },
  labelText: {
    fontSize: 15,
    color: Colors.DARK_GRAY,
    fontWeight: "600",
  },
  keepItUpText: {
    fontSize: 15,
    color: Colors.PRIMARY,
    fontWeight: "600",
  },
  progressMessageText: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 17,
    fontWeight: "700",
    color: Colors.PRIMARY,
  },
});
