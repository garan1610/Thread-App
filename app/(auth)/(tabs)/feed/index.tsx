import Thread from '@/components/Thread'
import ThreadComposer from '@/components/ThreadComposer'
import { Colors } from '@/constants/Colors'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { FontAwesome6 } from '@expo/vector-icons'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import { usePaginatedQuery } from 'convex/react'
import React, { useCallback, useState } from 'react'
import { RefreshControl, StyleSheet, Text, View } from 'react-native'
import Animated, { runOnJS, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Page = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    {
      initialNumItems: 5,
    }
  )
  const { top } = useSafeAreaInsets()

  const [refreshing, setRefreshing] = useState(false)

  // const navigation = useNavigation();
  // // Create a shared value to store the scroll offset
  // const scrollOffset = useSharedValue(0);
  // const tabBarHeight = useBottomTabBarHeight();
  // const isFocused = useIsFocused();

  // const updateTabbar = () => {
  //   let newMarginBottom = 0;
  //   if (scrollOffset.value >= 0 && scrollOffset.value <= tabBarHeight) {
  //     newMarginBottom = -scrollOffset.value;
  //   } else if (scrollOffset.value > tabBarHeight) {
  //     newMarginBottom = -tabBarHeight;
  //   }

  //   navigation.getParent()?.setOptions({ tabBarStyle: { marginBottom: newMarginBottom } });
  // };

  // // Create an animated scroll handler
  // const scrollHandler = useAnimatedScrollHandler({
  //   onScroll: (event) => {
  //     if (isFocused) {
  //       scrollOffset.value = event.contentOffset.y;
  //       runOnJS(updateTabbar)();
  //     }
  //   },
  // });

  // useFocusEffect(
  //   useCallback(() => {
  //     // Do something when the screen is focused

  //     return () => {
  //       navigation.getParent()?.setOptions({ tabBarStyle: { marginBottom: 0 } });
  //     };
  //   }, [])
  // );

  const onLoadMore = () => {
    loadMore(5)
  }

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  return (
    <Animated.FlatList
      data={results}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <Thread thread={item as Doc<'messages'> & { creator: Doc<'users'> }} />}
      keyExtractor={(item) => item._id}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ItemSeparatorComponent={() => <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: Colors.border }} />}
      ListEmptyComponent={() => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors.secondaryText }}>No threads found</Text>
      </View>}
      contentContainerStyle={{ paddingVertical: top }}
      ListHeaderComponent={() => <View style={{ paddingVertical: 8 }}>
        <FontAwesome6 name="threads" size={32} style={{ alignSelf: 'center' }} />
        <ThreadComposer isPreview={true} />
      </View>}
      // scrollEventThrottle={16}
      // onScroll={scrollHandler}
    />
  )
}

export default Page

const styles = StyleSheet.create({})