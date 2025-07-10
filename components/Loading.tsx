import { Colors } from '@/constants/Colors'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

const Loading = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.border} />
            <Text style={styles.text}>Loading...</Text>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightgray",
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
})


