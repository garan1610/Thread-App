import { Colors } from '@/constants/Colors'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const Layout = () => {
    const router = useRouter();

    const handleDismiss = () => {
        console.log("dismissing");
        router.dismiss();
    }

    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: "white" },
                headerShown: false,
            }}>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='(modal)/create' options={{
                // presentation: "fullScreenModal",
                title: "New Thread",
                headerShadowVisible: false,
                headerShown: true,
            }} />
            <Stack.Screen name='(modal)/edit-profile' options={{
                // presentation: "modal",
                title: "Edit Profile",
                headerShown: true,
                headerStyle: {
                },
                headerShadowVisible: false,
            }} />
        </Stack>
    )
}

export default Layout

const styles = StyleSheet.create({

})