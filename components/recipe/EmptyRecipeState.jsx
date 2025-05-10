import { Image, StyleSheet, Text, View } from "react-native";

const EmptyRecipeState = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/recipe.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>No Recipes Generated Yet</Text>
      <Text style={styles.subtitle}>
        Start by generating your recipes with AI so you can easily access them
        later!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default EmptyRecipeState;
