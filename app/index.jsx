import Button from "@/components/shared/Button";
import Colors from "@/shared/Colors";
import { useRouter } from "expo-router";
import { Dimensions, Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Image
        source={require("../assets/images/landing.jpg")}
        style={{
          width: "100%",
          height: Dimensions.get("screen").height,
        }}
      />
      <View
        style={{
          position: "absolute",
          height: Dimensions.get("screen").height,
          backgroundColor: "#0707075e",
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={{ height: 150, width: 150, marginTop: 150 }}
        />
        <Text
          style={{
            fontSize: 30,
            color: Colors.WHITE,
            fontWeight: "bold",
          }}
        >
          AI Diet Planner
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: Colors.WHITE,
            fontSize: 20,
            marginTop: 15,
            marginHorizontal: 20,
            opacity: 0.8,
          }}
        >
          Craft delicious , Healthy ,mean plans tailored just for you.Achieve
          your goal with ease!
        </Text>
      </View>
      <View
        style={{ position: "absolute", bottom: 25, width: "100%", padding: 20 }}
      >
        <Button
          title={"Get Started"}
          onPress={() => router.push("/auth/SignIn")}
        />
      </View>
    </View>
  );
}
