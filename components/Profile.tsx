import { Colors } from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePaginatedQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Loading from './Loading';
import Tabs from './Tabs';
import Thread from './Thread';
import UserProfile from './UserProfile';

type ProfileProps = {
    showBackButton?: boolean;
    userId?: Id<"users">;
}

const Profile = ({ showBackButton = false, userId }: ProfileProps) => {
    const { userProfile } = useUserProfile();
    const { top } = useSafeAreaInsets();
    const { signOut } = useAuth();
    const router = useRouter();

    const { results, status, loadMore } = usePaginatedQuery(
        api.messages.getThreads,
        {
            userId: userId || userProfile?._id,
        },
        {
            initialNumItems: 5,
        }
    )

    const handleSignOut = () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    try {
                        await signOut();
                    } catch (error) {
                        console.error("Sign out error:", error);
                    }
                },
            },
        ]);
    };


    if (!userProfile) {
        return (
            <Loading />
        );
    }

    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <FlatList
                data={results}
                renderItem={({ item }) => <Thread thread={item as Doc<'messages'> & { creator: Doc<'users'> }} />}
                ListEmptyComponent={<Text style={styles.tabContentText}>You haven't posted anything yet</Text>}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            {showBackButton ? (
                                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                    <Ionicons name="chevron-back" size={24} color="black" />
                                    <Text>Back</Text>
                                </TouchableOpacity>
                            ) : (
                                <MaterialCommunityIcons name="web" size={24} color="black" />
                            )}

                            <View style={styles.headerIcon}>
                                <Ionicons name="logo-instagram" size={24} color="black" />
                                <TouchableOpacity onPress={handleSignOut}>
                                    <Ionicons name="log-out-outline" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {userId ? <UserProfile userId={userId} isSelf={false} /> : <UserProfile userId={userProfile?._id} isSelf={true} />}
                        <Tabs onTabChange={() => { }} />
                    </>
                }
            />
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    separator: {
        height: 1,
        backgroundColor: "lightgray",
        marginVertical: 10,
    },
    header: {
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
        paddingBottom: 8,
    },
    headerIcon: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    tabContentText: {
        fontSize: 16,
        color: Colors.secondaryText,
        textAlign: "center",
        marginVertical: 16,
    },
})