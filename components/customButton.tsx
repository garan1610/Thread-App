import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'  
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'

type Props = {  
  title: string;
  icon: any; // Use 'any' for now, or ImageSourcePropType for stricter typing
  onPress: () => void;
} 

const CustomButton = (props: Props) => {
  const { title, icon, onPress } = props;
  return (
      <TouchableOpacity style={styles.loginButton} onPress={onPress}>
        <View style={styles.buttonContent}>
          <Image source={icon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{title}</Text>
          <Ionicons name="chevron-forward" size={24} color={Colors.border} />
        </View>
      </TouchableOpacity>
  )
}

export default CustomButton;

const styles = StyleSheet.create({
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