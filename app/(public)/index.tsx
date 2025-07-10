import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAuth, useSignUp, useSSO, useUser } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SignUpScreenProps {
  onSignIn?: () => void;
}

// Browser optimization hook
export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Index({ onSignIn }: SignUpScreenProps) {
  useWarmUpBrowser();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const { startSSOFlow } = useSSO();
  const { signOut } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);


  const handleSocialSignUp = useCallback(
    async (strategy: "oauth_google" | "oauth_github" | "oauth_facebook") => {
      setSocialLoading(true);
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });

        if (createdSessionId) {
          setActive!({ session: createdSessionId });
          router.replace("/");
        }
      } catch (err: any) {
        console.error("Social sign up error:", JSON.stringify(err, null, 2));
        Alert.alert("Social sign up failed. Please try again.");
      } finally {
        setSocialLoading(false);
      }
    },
    []
  );


  const handleButtonPress = async () => {
    router.replace("/(auth)/(tabs)/profile");
  }

  return (
    <View
      style={styles.container}
    >
      <Image
        source={require("../../assets/images/react-logo.png")}
        style={styles.loginImage} />
      <Text style={styles.title}>Login to your account</Text>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Login with Google" icon={require("../../assets/images/google-logo.png")}
          onPress={() => handleSocialSignUp("oauth_google")}
          loading={socialLoading}
        />
        <CustomButton
          title="Login with Facebook"
          icon={require("../../assets/images/Facebook_logo_(square).png")}
          onPress={() => handleSocialSignUp("oauth_facebook")}
          icon_style={{ width: 30, height: 30, marginHorizontal: 8 }}
          loading={socialLoading}
        />
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.switchAccountText}>Switch Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleButtonPress}>
          <Text style={styles.switchAccountText}>Test Button</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  loginImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "DMSans_700Bold",
  },
  buttonContainer: {
    gap: 20,
    paddingVertical: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  switchAccountText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: Colors.border,
    alignSelf: "center",
  },
});