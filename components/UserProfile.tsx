import { Colors } from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { numberFormat } from '@/utils/followerNum';
import { useQuery } from 'convex/react';
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type UserProfileProps = {
    userId?: string;
    isSelf?: boolean;
}

const UserProfile = ({ userId, isSelf = true }: UserProfileProps) => {
    const profile = useQuery(api.users.getUserById, { userId: userId as Id<"users"> });
    // console.log(profile?.bio, profile?.websiteUrl, profile?._id, profile?.imageUrl);

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.profileTextContainer}>
                    <Text style={styles.profileName}>{profile?.first_name} {profile?.last_name}</Text>
                    <Text style={styles.profileUsername}>@{profile?.username}</Text>
                </View>
                <View style={styles.profileImageContainer}>
                    <Image source={{ uri: profile?.imageUrl! }} style={styles.profileImage} />
                </View>
            </View>
            <Text style={styles.profileBio}>{profile?.bio || "No bio"}</Text>
            <Text style={styles.profileBio}>
                {numberFormat(profile?.followersCount)} {profile?.followersCount === 1 ? "follower" : "followers"} • {profile?.websiteUrl || "No website"}</Text>


            <View style={styles.profileButtonContainer}>
                {isSelf ? (
                    <>
                        <Link href={`/(auth)/(modal)/edit-profile?biostring=${profile?.bio ? encodeURIComponent(profile?.bio) : ""}&linkstring=${profile?.websiteUrl ? encodeURIComponent(profile?.websiteUrl) : ""}&userId=${profile?._id}&imageUrl=${profile?.imageUrl ? encodeURIComponent(profile?.imageUrl) : ""}`} asChild>
                            <TouchableOpacity style={styles.profileButton}>
                                <Text style={styles.profileButtonText}>Edit Profile</Text>
                            </TouchableOpacity>
                        </Link>

                        <TouchableOpacity style={styles.profileButton}>
                            <Text style={styles.profileButtonText}>Share Profile</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity style={styles.fullButton}>
                            <Text style={styles.fullButtonText}>Follow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.fullButton}>
                            <Text style={styles.fullButtonText}>Mention</Text>
                        </TouchableOpacity>
                    </>
                )}

            </View>

        </View>
    )
}

export default UserProfile

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        flex: 1,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        justifyContent: "space-between",
    },
    profileImageContainer: {
        width: 50,
        height: 50,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    profileTextContainer: {
        flex: 1,
        gap: 6,
    },
    profileName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    profileUsername: {
        fontSize: 14,
        color: "gray",
    },
    profileBio: {
        fontSize: 14,
        marginVertical: 8,
    },
    profileButtonContainer: {
        flexDirection: "row",
        gap: 16,
        justifyContent: "space-evenly",
        marginVertical: 8,
    },
    profileButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    profileButtonText: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: "bold",
    },
    fullButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        backgroundColor: Colors.text,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    fullButtonText: {
        fontSize: 14,
        color: Colors.background,
        fontWeight: "bold",
    },
})