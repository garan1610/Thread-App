import { Colors } from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Page = () => {
    const { biostring, linkstring, userId, imageUrl, usernameString } = useLocalSearchParams<{
        usernameString: string;
        biostring: string;
        linkstring: string;
        userId: string;
        imageUrl: string;
    }>();

    const [bio, setBio] = useState(biostring);
    const [link, setLink] = useState(linkstring);
    const [username, setUsername] = useState(usernameString);
    const updateUser = useMutation(api.users.updateUser);
    const generateUploadUrl = useMutation(api.users.generateUploadUrl);
    const updateImage = useMutation(api.users.updateImage);

    const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const router = useRouter();

    const onDone = async () => {
        updateUser({ _id: userId as Id<'users'>, bio, websiteUrl: link, username });
        if (selectedImage) {
            await updateProfilePicture();
        }
        router.dismiss();
    };

    const updateProfilePicture = async () => {
        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

        // Convert URI to blob
        const response = await fetch(selectedImage!.uri);
        const blob = await response.blob();

        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
            method: 'POST',
            headers: { 'Content-Type': selectedImage!.mimeType! },
            body: blob,
        });
        const { storageId } = await result.json();
        console.log('🚀 ~ updateProfilePicture ~ storageId:', storageId);
        // Step 3: Save the newly allocated storage id to the database
        await updateImage({ storageId, _id: userId as Id<'users'> });
    };

    const pickImage = async ( ) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
        }
    }

    return (
        <View>
            <Stack.Screen options={{
                headerRight: () => (
                    <TouchableOpacity onPress={onDone}>
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                ),
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.dismiss()}>
                        <Text style={[styles.buttonText, { color: Colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                )
            }} />
            <ScrollView>
                <TouchableOpacity onPress={pickImage}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage.uri }} style={styles.image} />
                    ) : (
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    )}
                </TouchableOpacity>
                <View style={styles.section}>
                    <Text style={styles.label}>User Name</Text>
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="My Username"
                        autoCapitalize='none'
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={styles.input}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us about yourself"
                        multiline={true}
                        numberOfLines={4}
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Link</Text>
                    <TextInput
                        value={link}
                        onChangeText={setLink}
                        placeholder="https://www.example.com"
                        autoCapitalize='none'
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    buttonText: {
        color: "blue",
        fontSize: 16,
        fontWeight: "500",
    },
    section: {
        padding: 8,
        margin: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 4,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        alignSelf: "center",
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    input: {
        fontSize: 14,
        height: 100,
    }
})