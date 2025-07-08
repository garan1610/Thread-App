import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {

  function handleLoginWithGoogle() {
    console.log("Login with Google");
  }

  return (
    <View
      style={styles.container}
    >
      <Image
        source={require("../assets/images/react-logo.png")}
        style={styles.loginImage} />
      <ScrollView style={{}}>
        <Text style={styles.title}>Login to your account</Text>
        <View style={styles.buttonContainer}>
          <CustomButton title="Login with Google" icon={require("../assets/images/google-logo.png")} onPress={handleLoginWithGoogle} />
          <TouchableOpacity style={styles.loginButton}>
            <View style={styles.buttonContent}>
              <Image source={require("../assets/images/google-logo.png")} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Login with Google</Text>
              <Ionicons name="chevron-forward" size={24} color={Colors.border} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loginImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontFamily: "DMSans_700Bold",
  },
  loginButton: {
    backgroundColor: '#FFF',
    padding: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
  },
  buttonSubtitle: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  buttonContainer: {
    gap: 20,
    paddingVertical: 20,
  },
  buttonContent: {
    gap: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    backgroundColor: "#FFF"
  }
});