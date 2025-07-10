import { Colors } from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUserProfile } from '@/hooks/useUserProfile';
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, InputAccessoryView, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type ThreadComposerProps = {
    threadId?: Id<'messages'>;
    isPreview?: boolean;
    isReply?: boolean;
}

const ThreadComposer = ({ threadId, isPreview, isReply }: ThreadComposerProps) => {
    const router = useRouter();

    const [threadContent, setThreadContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState<ImagePicker.ImagePickerAsset[]>([])
    const { userProfile } = useUserProfile()
    const addThread = useMutation(api.messages.addThreadMessage)

    const inputAccessoryViewID = "unique-id"

    const generateUploadUrl = useMutation(api.messages.generateUploadUrl)

    const handleSubmit = async () => {
        const mediaIds = await Promise.all(mediaFiles.map(uploadMedia))
        await addThread({
            threadId,
            content: threadContent,
            mediaFiles: mediaIds,
        })
        setThreadContent('')
        setMediaFiles([])
        router.dismiss()
    }

    const handleCancel = () => {
        Alert.alert('Discard Thread', 'Are you sure you want to discard thread?', [
            {
                text: 'Discard', style: 'destructive', onPress: () => {
                    router.dismiss()
                }
            },
            { text: 'Cancel', style: 'cancel' },

        ])
    }

    const removeThread = () => {
        setThreadContent('')
        setMediaFiles([])
        Keyboard.dismiss()
    }

    const uploadMedia = async (image: ImagePicker.ImagePickerAsset) => {
        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

        // Convert URI to blob
        const response = await fetch(image.uri);
        const blob = await response.blob();

        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
            method: 'POST',
            headers: { 'Content-Type': image.mimeType! },
            body: blob,
        });
        const { storageId } = await result.json();
        console.log('🚀 ~ updateProfilePicture ~ storageId:', storageId);
        // Step 3: Save the newly allocated storage id to the database
        return storageId;
    };

    const pickImage = async (type: 'library' | 'camera') => {
        const option: ImagePicker.ImagePickerOptions = {
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [1, 1],
        }

        let result = null;

        if (type === 'library') {
            result = await ImagePicker.launchImageLibraryAsync(option);
        } else {
            result = await ImagePicker.launchCameraAsync(option);
        }

        if (!result.canceled) {
            setMediaFiles([...mediaFiles, result.assets[0]]);
        }
    }

    return (
        <TouchableOpacity
            onPress={() => {
                if (isPreview) {
                    router.push('/(auth)/(modal)/create')
                }
            }}
            style={isPreview && {
                zIndex: 1000,
                height: 100,
                pointerEvents: 'box-only',
            }}
        >
            <Stack.Screen options={{
                headerLeft: () => (
                    <TouchableOpacity onPress={handleCancel}>
                        <Text style={{ fontSize: 16, color: Colors.text, fontWeight: '500' }}>Cancel</Text>
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal-circle" size={24} color={Colors.text} />
                    </TouchableOpacity>
                ),
            }} />
            <View style={styles.topRow}>
                {userProfile && (
                    <Image source={{ uri: userProfile?.imageUrl || '' }} style={styles.profileImage} />
                )}
                <View style={styles.centerContainer}>
                    <Text style={styles.username}>{userProfile?.username}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={isReply ? 'Reply to thread' : 'What\'s new?'}
                        value={threadContent}
                        onChangeText={setThreadContent}
                        multiline={true}
                        autoFocus={!isPreview}
                        inputAccessoryViewID={inputAccessoryViewID}

                    />
                    {mediaFiles.length > 0 && (
                        <ScrollView horizontal={true}>
                            {mediaFiles.map((file, index) => (
                                <View style={styles.mediaContainer} key={index}>
                                    <Image source={{ uri: file.uri }} style={styles.mediaImage} />
                                    <TouchableOpacity style={styles.removeMediaButton}
                                        onPress={() => {
                                            setMediaFiles(mediaFiles.filter((_, i) => i !== index))
                                        }}
                                    >
                                        <Ionicons name="close" size={24} color={Colors.border} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.iconRow}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => pickImage('library')}>
                            <Ionicons name="images-outline" size={24} color={Colors.border} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="camera-outline" size={24} color={Colors.border} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <MaterialIcons name="gif" size={24} color={Colors.border} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="mic-outline" size={24} color={Colors.border} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <FontAwesome6 name="hashtag" size={24} color={Colors.border} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="stats-chart-outline" size={24} color={Colors.border} />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.cancelButton} onPress={removeThread}>
                    <Ionicons name="close" size={24} color={Colors.border} opacity={isPreview ? 0 : 1} />
                </TouchableOpacity>
            </View>
            <InputAccessoryView nativeID={inputAccessoryViewID}>
                <View style={styles.keyboardAccessory}>
                    <Text style={styles.keyboardAccessoryText}>
                        {isReply ? 'Everyone can reply and quote'
                            : 'Profiles that you follow can reply and quote'}
                    </Text>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Ionicons name="send" size={24} color={Colors.text} />
                    </TouchableOpacity>
                </View>
            </InputAccessoryView>
        </TouchableOpacity>
    )
}

export default ThreadComposer

const styles = StyleSheet.create({
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
        padding: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.border,
    },
    profileImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignSelf: 'flex-start',
    },
    centerContainer: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 16,
        maxHeight: 100,
    },
    iconRow: {
        flexDirection: 'row',
        paddingTop: 12,
    },
    iconButton: {
        marginRight: 16,
    },
    cancelButton: {
        marginLeft: 12,
        alignSelf: 'flex-start',
    },
    submitButton: {
        padding: 12,
        color: Colors.secondaryText,
        marginRight: 12,
    },
    keyboardAccessory: {
        backgroundColor: Colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 64,
        gap: 12
    },
    keyboardAccessoryText: {
        fontSize: 16,
        color: Colors.border,
        flex: 1,
    },
    mediaImage: {
        width: 200,
        height: 200,
        borderRadius: 6,
        marginRight: 10,
        marginTop: 10,
    },
    mediaContainer: {
        marginRight: 10,
        marginTop: 10,
    },
    removeMediaButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: Colors.text,
        borderRadius: 12,
        opacity: 0.7,
    },
    removeMediaButtonIcon: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 4,
    },
})