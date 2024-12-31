import React, {useEffect, useRef, useState, useCallback} from 'react';
import {Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScreenWrapper from "@/components/ScreenWrapper";
import {useAuth} from "@/context/AuthContext";
import Icon from "@/assets/icons";
import {hp, wp} from "@/helpers/common";
import {theme} from "@/constants/theme";
import {useRouter} from 'expo-router';
import Avatar from "@/components/Avatar";
import PostCard from "@/components/PostCard";
import {fetchPosts} from "@/services/postService";
import Loading from "@/components/Loading";
import {supabase} from '@/lib/supabase';
import {getUserData} from "@/services/userService";

const { height } = Dimensions.get('window');
var limit = 0;
const Home = () => {
    const {user, setAuth} = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<any>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [notificationCount, setNotificationCount] = useState<number>(0);
    const [playingIndex, setPlayingIndex] = useState(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    const handleHeaderLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height); // Save the header height
    };

    const handlePostEvent = async (payload: any) => {
        if (payload.eventType == "INSERT" && payload?.new?.id) {
            let newPost = {...payload.new};
            let res = await getUserData(newPost.userId);
            newPost.postLikes = [];
            newPost.comments = [{count: 0}]
            newPost.user = res.success? res.data: {};
            setPosts((prevPosts: any) => [newPost, ...prevPosts])
        }
        if (payload.eventType == "DELETE" && payload?.old?.id) {
            setPosts((prevPosts: any) => {
                let updatedPosts = prevPosts.filter((post: any) => post.id!==payload?.old?.id);
                return updatedPosts;
            })
        }
        if (payload.eventType == "UPDATE" && payload?.new?.id) {
            setPosts((prevPosts: any) => {
                let updatedPosts= prevPosts.map((post: any) => {
                    if (post.id==payload.new.id) {
                        post.body = payload.new.body;
                        post.file = payload.new.file;
                    }
                    return post;
                })
                return updatedPosts;
            })
        }
    }

    const handleCommentCount = async (payload: any) => {
        if (payload.eventType == "INSERT" && payload.new.id) {
            let newComment = {...payload.new}
            setPosts((prevPosts: any) => {
                return prevPosts.map((post: any) => {
                    if (post.id === newComment.postId) {
                        // Increment the comment count
                        post.comments[0].count = post.comments[0].count + 1;
                    }
                    return post;
                });
            });
        }
        if (payload.eventType == "DELETE" && payload?.old?.id) {
            setPosts((prevPosts: any) => {
                let updatedPosts = prevPosts.map((post: any) => {
                    if (post.id==payload?.old?.postId) {
                        post.comments[0].count = post.comments[0].count - 1;
                    }
                    return post;
                })
                return updatedPosts;
            })
        }
    }

    const handleNewNotification = async (payload: any) => {
        if (payload.eventType == "INSERT" && payload.new.id) {
            setNotificationCount((prevCount: number) => prevCount + 1);
        }
    };


    useEffect(() => {

        let postChannel = supabase
            .channel("posts")
            .on("postgres_changes", {event: "*", schema: "public", table: "posts"}, handlePostEvent)
            .subscribe();


        let commentCount = supabase
            .channel("commentCount")
            .on("postgres_changes", {event: "*", schema: "public", table: "comments"}, handleCommentCount)
            .subscribe();


        let notificationChannel = supabase
            .channel("notifications")
            .on("postgres_changes", {event: "INSERT", schema: "public", table: "notifications", filter: `receiverId=eq.${user.id}`}, handleNewNotification)
            .subscribe();

        return () => {
            supabase.removeChannel(postChannel);
            supabase.removeChannel(commentCount);
            supabase.removeChannel(notificationChannel);
        }
    }, []);

    const getPosts = async () => {
        if (!hasMore) return null;
        limit += 10;

        let res = await fetchPosts(limit)
        if (res.success) {
            if (posts.length == res?.data?.length) setHasMore(false);
            setPosts(res?.data as any)
        }
    }

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0 && playingIndex !== null) {
            setPlayingIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 80, // Only consider items visible if 80% of the item is on the screen
    };

    const screenHeightAfterHeader = height - headerHeight;
  return (
    <ScreenWrapper bg="black">
        <View style={styles.container}>
            {/*header*/}
            <View style={styles.header}>
                <TouchableOpacity>
                <Image
                    source={require("@/assets/images/cleeksLogo.png")}
                    style={{width: hp(10), height: hp(8)}}
                    resizeMode="contain"
                />
                </TouchableOpacity>
                <View style={styles.icons}>
                    <Pressable
                        onPress={() => {
                            setNotificationCount(0);
                            router.push("/notifications")
                        }}
                    >
                        <Icon name="heart" size={hp(3.2)} strokeWidth={2} color="white" />
                        {
                            notificationCount > 0 && (
                                <View style={styles.pill}>
                                    <Text style={styles.pillText}>{notificationCount}</Text>
                                </View>
                            )
                        }
                    </Pressable>
                    <Pressable onPress={() => router.push("/newPost")}>
                        <Icon name="plus" size={hp(3.2)} strokeWidth={2} color="white" />
                    </Pressable>
                    <Pressable onPress={() => router.push("/profile")}>
                        <Avatar
                            uri={user?.image}
                            size={hp(4.3)}
                            rounded={theme.radius.sm}
                            style={{borderWidth: 2}}
                        />
                    </Pressable>
                </View>
            </View>

            <View style={[styles.body, { height: screenHeightAfterHeader }]}>
                {/*post*/}
                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item: any) => item?.id.toString()}
                    renderItem={({item, index} : any) =>
                        <PostCard item={item} currentUser={user} router={router} showMoreIcon={true} playingIndex={playingIndex} index={index} />}
                    pagingEnabled={true}
                    onEndReached={() => {
                        getPosts();
                        console.log("got to the end")
                    }}
                    onEndReachedThreshold={0}
                    ListFooterComponent={hasMore? (
                        <View style={{marginVertical: posts.length == 0? 200: 30}}>
                            <Loading />
                        </View>
                    ): (
                        <View style={{marginVertical: 30}}>
                            <Text style={styles.noPosts}>No more posts</Text>
                        </View>
                    )}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    getItemLayout={(data, index) => (
                        {length: height, offset: height * index, index}
                    )}
                    snapToInterval={height}
                    decelerationRate='fast'
                />
            </View>
        </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8*0.5
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        marginHorizontal: wp(4),
        height: 50,
    },
    body:{
        flex: 1
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold as any,
    },
    avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: "continuous",
        borderColor: theme.colors.gray,
        borderWidth: 3
    },
    icons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 18
    },
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4)
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: "center",
        color: theme.colors.textWhite,
    },
    pill: {
        position: "absolute",
        right: -10,
        top: -4,
        height: hp(2.2),
        width: hp(2.2),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: theme.colors.roseLight
    },
    pillText: {
        color: "white",
        fontSize: hp(1.2),
        fontWeight: theme.fonts.bold as any
    }
})