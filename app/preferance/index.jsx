import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/shared/Colors";
import {
  Dumbbell01Icon,
  FemaleSymbolFreeIcons,
  MaleSymbolIcon,
  PlusSignSquareIcon,
  WeightScaleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
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

  const OnContinue = async () => {
    if (!weight || !height || !gender) {
      Alert.alert("Fill all the fields", "Enter all details to continue");
      return;
    }

    const data = {
      uid: user?._id,
      weight: weight,
      height: height,
      gender: gender,
      goal: goal,
    };
    setLoading(true);

    //Calculate Calories using AI
    const PROMPT = JSON.stringify(data) + Prompt.CALOERIES_PROMPT;
    console.log(PROMPT);

    const AIResult = await CalculateCaloriesAi(PROMPT);
    console.log(AIResult.choices[0].message.content);
    const AIResp = AIResult.choices[0].message.content;
    console.log(AIResp);
    const JSONContent = JSON.parse(
      AIResp?.replace("```json", "").replace("```", "")
    );
    console.log(JSONContent);
    const result = await UpdateUserPref({
      ...data,
      ...JSONContent,
    });

    setUser((prev) => ({
      ...prev,
      ...data,
    }));
    router.replace("/(tabs)/Home");
    setLoading(false);
  };

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: 20 }}>
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
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder={"e.g 70"}
              lable="Weight (kg)"
              onChangeText={setWeight}
            />
          </View>
          <View style={{ flex: 1 }}>
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
              <HugeiconsIcon
                icon={MaleSymbolIcon}
                size={40}
                color={Colors.BLUE}
              />
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
              <HugeiconsIcon
                icon={FemaleSymbolFreeIcons}
                size={40}
                color={Colors.PINK}
              />
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
            <HugeiconsIcon icon={WeightScaleIcon} />
            <View>
              <Text style={styles.goalText}>Weight Loss</Text>
              <Text style={styles.goalSubText}>
                Reduce body fat & get leaner
              </Text>
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
            <HugeiconsIcon icon={Dumbbell01Icon} />
            <View>
              <Text style={styles.goalText}>Muscle Gain</Text>
              <Text style={styles.goalSubText}>
                Build Muscle & get Stronger
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
            <HugeiconsIcon icon={PlusSignSquareIcon} />
            <View>
              <Text style={styles.goalText}>Weight Gain</Text>
              <Text style={styles.goalSubText}>Increase healthy body mass</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 25 }}>
          <Button title={"Continue"} onPress={OnContinue} />
        </View>
        <LoadingDialog loading={loading} title="Please wait" />
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
