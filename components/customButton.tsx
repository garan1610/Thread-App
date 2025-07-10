import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  title: string;
  icon: any; // Use 'any' for now, or ImageSourcePropType for stricter typing
  onPress: () => void;
  icon_style?: any;
  loading?: boolean;
}

const CustomButton = (props: Props) => {
  const { title, icon, onPress, icon_style, loading = false } = props;

  const isDisabled = loading;
  return (
    <TouchableOpacity style={styles.loginButton} onPress={onPress} disabled={isDisabled} className={`${isDisabled ? "opacity-50" : ""}`}>
      {loading ? (
        <ActivityIndicator size="small" color={Colors.border} />
      ) : (
        <View style={styles.buttonContent}>
          <Image source={icon} style={[styles.buttonIcon, icon_style]} />
          <Text style={styles.buttonText}>{title}</Text>
          <Ionicons name="chevron-forward" size={24} color={Colors.border} />
        </View>
      )}

    </TouchableOpacity>
  )
}

export default CustomButton;

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    height: 60,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
  },
  buttonSubtitle: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
  },
  buttonIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    backgroundColor: "#FFF",
  }
});