import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import {
  Coffee02Icon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useMutation } from "convex/react";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import Button from "../shared/Button";

export default function AddToMealActionSheet({
  recipeDetail,
  hideActionSheet,
}) {
  const [dateList, setDateList] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedMeal, setSelectedMeal] = useState();
  const createMealPlan = useMutation(api.MealPlan.CreateMealPlan);
  const { user } = useContext(UserContext);
  const mealOption = [
    {
      title: "Breakfast",
      icon: Coffee02Icon,
    },
    {
      title: "Lunch",
      icon: Sun03Icon,
    },
    {
      title: "Dinner",
      icon: Moon02Icon,
    },
  ];

  useEffect(() => {
    GenerateDates();
  }, []);

  const GenerateDates = () => {
    const result = [];

    for (let i = 0; i < 4; i++) {
      const nextdate = moment().add(i, "days").format("DD/MM/YYYY");
      result.push(nextdate);
    }
    console.log(result);

    setDateList(result);
  };

  const AddToMealPlan = async () => {
    if (!selectedDate && !selectedMeal) {
      Alert.alert("Error!", "Please Select All Details");
      return;
    }

    const result = await createMealPlan({
      date: selectedDate,
      mealType: selectedMeal,
      recipeId: recipeDetail?._id,
      uid: user?._id,
    });

    console.log(result);

    Alert.alert("Added!", "Added to Meal Plan");
    hideActionSheet();
  };

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>
        Add To Meal
      </Text>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 15,
        }}
      >
        Select Date
      </Text>
      <FlatList
        data={dateList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setSelectedDate(item)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              padding: 7,
              borderWidth: 1,
              borderRadius: 10,
              margin: 5,
              borderColor: selectedDate == item ? Colors.PRIMARY : Colors.GRAY,
              backgroundColor:
                selectedDate == item ? Colors.SECONDARY : Colors.WHITE,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
              }}
            >
              {moment(item, "DD/MM/YYYY").format("ddd")}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {moment(item, "DD/MM/YYYY").format("DD")}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {moment(item, "DD/MM/YYYY").format("MMM")}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 15,
        }}
      >
        Select Meal
      </Text>
      <FlatList
        data={mealOption}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setSelectedMeal(item?.title)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              padding: 7,
              borderWidth: 1,
              borderRadius: 10,
              margin: 5,
              borderColor:
                selectedMeal == item.title ? Colors.PRIMARY : Colors.GRAY,
              backgroundColor:
                selectedMeal == item.title ? Colors.SECONDARY : Colors.WHITE,
            }}
          >
            <HugeiconsIcon icon={item.icon} />

            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View
        style={{
          marginTop: 15,
        }}
      >
        <Button title={"+ Add to Meal Plan"} onPress={AddToMealPlan} />
        <TouchableOpacity
          onPress={() => hideActionSheet()}
          style={{
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
