import Colors from "@/shared/Colors";
import moment from "moment";
import { useContext } from "react";
import { Text, View } from "react-native";
import { UserContext } from "../../context/UserContext";

export default function TodayProgress() {
  const { user } = useContext(UserContext);
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

      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          color: Colors.PRIMARY,
          marginTop: 10,
          textAlign: "center",
        }}
      >
        1500/{user?.calories}
      </Text>
      <Text style={{ textAlign: "center", marginTop: 2, fontSize: 16 }}>
        You'r doing great!
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
            width: "70%",
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
  );
}
