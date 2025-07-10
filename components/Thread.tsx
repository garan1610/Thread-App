import { Colors } from '@/constants/Colors'
import { Doc } from '@/convex/_generated/dataModel'
import { numberFormat } from '@/utils/followerNum'
import { formatTimeAgo } from '@/utils/timeFormat'
import { Feather, Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type ThreadProps = {
    thread: Doc<'messages'> & {
        creator: Doc<'users'>
    }
}



const Thread = ({ thread }: ThreadProps) => {


    const { content, mediaFiles, likeCount, commentCount, retweetCount, creator } = thread


    return (
        <View style={styles.container}>
            <Image source={{ uri: thread.creator.imageUrl }} style={styles.profileImage} />
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.username}>{creator.username}</Text>
                        <Text style={styles.timestamp}>
                            {formatTimeAgo(new Date(thread._creationTime))}</Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={20} color={Colors.border} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.content}>{content}</Text>

                {mediaFiles && mediaFiles.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {mediaFiles.map((file, index) => (
                            <Image key={index} source={{ uri: file }} style={styles.mediaImage} />
                        ))}
                    </ScrollView>
                )}

                <View style={styles.action}>
                    <TouchableOpacity
                        style={styles.actionButton}
                    // onPress={() => likeThread({ messageId: thread._id })}
                    >
                        <Ionicons name="heart-outline" size={22} color="black" />
                        <Text style={styles.actionText}>{numberFormat(likeCount)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={22} color="black" />
                        <Text style={styles.actionText}>{numberFormat(commentCount)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="repeat-outline" size={22} color="black" />
                        <Text style={styles.actionText}>{numberFormat(retweetCount)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Feather name="send" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export default Thread

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerText: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontWeight: 'bold',
        marginRight: 4,
        gap: 4,
    },
    timestamp: {
        color: "#777",
    },
    content: {
        marginBottom: 14,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        color: "#777",
        fontSize: 12,
    },
    mediaImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
        marginRight: 10,
    },
})