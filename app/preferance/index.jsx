import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useConvex, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingDialog from "../../components/shared/LoadingDialog";
import { CalculateCaloriesAi } from "../../services/AiModel";
import Prompt from "../../shared/Prompt";

export default function Preferance() {
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [gender, setGender] = useState();
  const [goal, setGoal] = useState();
  const [loading, setLoading] = useState();
  const { user, setUser } = useContext(UserContext);
  const UpdateUserPref = useMutation(api.Users.UpdateUserPref);
  const router = useRouter();
  const convex = useConvex();

  const OnContinue = async () => {
    if (!weight || !height || !gender) {
      Alert.alert("Fill all the fields", "Enter all details to continue");
      return;
    }

    if (loading) return;

    setLoading(true);

    const data = {
      email: user?.email,
      weight,
      height,
      gender,
      goal,
    };

    try {
      const PROMPT = JSON.stringify(data) + Prompt.CALOERIES_PROMPT;
      const AIResult = await CalculateCaloriesAi(PROMPT);

      const aiResponse =
        AIResult.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error("AI response does not contain JSON");
      }

      const jsonString = jsonMatch[1];
      const JSONContent = JSON.parse(jsonString);

      console.log("AI JSON Content:", JSONContent);

      // Save to DB with full data
      await UpdateUserPref({
        ...data,
        ...JSONContent,
      });

      // ✅ Refetch full, latest user
      const latestUser = await convex.query(api.Users.GetUserByEmail, {
        email: user?.email,
      });

      setUser(latestUser);

      // Navigate
      router.replace("/(tabs)/Home");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.SECONDARY,
        height: "100%",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: 20 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={{
                height: 100,
                width: 100,
                marginTop: 8,
              }}
            />
            <Text
              style={{
                color: Colors.PRIMARY,
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Set Your Preferences
            </Text>
          </View>
        </View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: "bold",
            marginTop: 30,
          }}
        >
          Tell us about yourself
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            color: Colors.GRAY,
          }}
        >
          This help us create your personalized meal plan
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View style={{ display: "flex", width: "49%" }}>
            <Input
              placeholder={"e.g 70"}
              lable="Weight (kg)"
              onChangeText={setWeight}
            />
          </View>
          <View style={{ display: "flex", width: "49%" }}>
            <Input
              placeholder={"e.g 5.10"}
              lable="Height (ft)"
              onChangeText={setHeight}
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontWeight: "medium",
              fontSize: 18,
            }}
          >
            Gender
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => setGender("Male")}
              style={{
                borderWidth: 1,
                borderColor: gender == "Male" ? Colors.BLUE : Colors.GRAY,
                borderRadius: 10,
                padding: 15,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Ionicons name="male-outline" size={40} color={Colors.BLUE} />
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 5,
                  fontWeight: "500",
                }}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGender("Female")}
              style={{
                borderWidth: 1,
                borderColor: gender == "Female" ? Colors.PINK : Colors.GRAY,
                borderRadius: 10,
                padding: 15,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Ionicons name="female-outline" size={40} color={Colors.PINK} />
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 5,
                  fontWeight: "500",
                }}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={{ fontWeight: "medium", fontSize: 18 }}>
            What's Your Goal?
          </Text>
          <TouchableOpacity
            onPress={() => setGoal("Weight Loss")}
            style={[
              styles.goalContainer,
              {
                borderColor:
                  goal == "Weight Loss" ? Colors.PRIMARY : Colors.GRAY,
              },
            ]}
          >
            <View
              style={{
                backgroundColor: "#fae3e5",
                borderRadius: 99,
                height: 35,
                width: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome6 name="weight-scale" size={18} color={Colors.RED} />
            </View>
            <View>
              <Text style={styles.goalText}>Weight Loss</Text>
              <Text style={styles.goalSubText}>
                Reduce body fat & get leaner
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGoal("Weight Gain")}
            style={[
              styles.goalContainer,
              {
                borderColor:
                  goal == "Weight Gain" ? Colors.PRIMARY : Colors.GRAY,
              },
            ]}
          >
            <View
              style={{
                backgroundColor: "#e3e9ff",
                borderRadius: 99,
                height: 35,
                width: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={19}
                color={Colors.BLUE}
              />
            </View>
            <View>
              <Text style={styles.goalText}>Weight Gain</Text>
              <Text style={styles.goalSubText}>Increase healthy body mass</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGoal("Muscle Gain")}
            style={[
              styles.goalContainer,
              {
                borderColor:
                  goal == "Muscle Gain" ? Colors.PRIMARY : Colors.GRAY,
              },
            ]}
          >
            <View
              style={{
                backgroundColor: "#dcfae7",
                borderRadius: 99,
                height: 35,
                width: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome6 name="dumbbell" size={18} color={Colors.GREEN} />
            </View>
            <View>
              <Text style={styles.goalText}>Muscle Gain</Text>
              <Text style={styles.goalSubText}>
                Build Muscle & get Stronger
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 50 }}>
          <Button
            title={"Continue"}
            onPress={OnContinue}
            icon="arrow-forward"
          />
        </View>
        <LoadingDialog loading={loading} title="Loading" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  goalContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 15,
    marginTop: 10,
  },
  goalText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  goalSubText: {
    color: Colors.GRAY,
  },
});
