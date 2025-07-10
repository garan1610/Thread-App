import Ionicons from '@expo/vector-icons/build/Ionicons'
import { router, Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const Layout = () => {
    return (
        <Tabs
            screenOptions={{
                // tabBarShowLabel: false,
                tabBarActiveTintColor: "#000",
            }}>
            <Tabs.Screen
                name='feed'
                options={{
                    headerShown: false,
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
                    )
                }} />
            <Tabs.Screen
                name='search'
                options={{
                    headerShown: false,
                    title: "Search",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "search" : "search-outline"} size={size} color={color} />
                    )
                }} />
            <Tabs.Screen name='create' options={{
                title: "Create",
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={size} color={color} />
                ),
            }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/(auth)/(modal)/create");
                    }
                }}
            />
            <Tabs.Screen name='favorites' options={{
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons name={focused ? "heart" : "heart-outline"} size={size} color={color} />
                ),
                title: "Favorites",
            }} />
            <Tabs.Screen name='profile' options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
                ),
            }} />
        </Tabs>
    )
}

export default Layout

const styles = StyleSheet.create({})