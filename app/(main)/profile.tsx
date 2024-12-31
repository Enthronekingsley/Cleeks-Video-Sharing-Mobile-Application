import React, {useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import ScreenWrapper from "@/components/ScreenWrapper";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "expo-router";
import UserHeader from "@/components/userHeader";
import {supabase} from "@/lib/supabase";
import {fetchPosts} from '@/services/postService';
import PostCard from '@/components/PostCard';
import Loading from '@/components/Loading';
import {hp, wp} from "@/helpers/common";
import {theme} from '@/constants/theme';

var limit = 0;
const Profile = () => {
    const {user, setAuth} = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<any>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const onLogout = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Logout", error.message);
        }
    }

    const getPosts = async () => {
        // call the api here

        if (!hasMore) return null;
        limit = limit + 10;

        console.log("fetching posts: ", limit);
        let res = await fetchPosts(limit, user.id);
        if (res.success) {
            if (posts.length == res?.data?.length) setHasMore(false);
            setPosts(res?.data as any);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Confirm",                           // Title of the alert
            "Are you sure you want to logout",  // Message body
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Logout",
                    onPress: () => onLogout(),
                    style: "destructive",
                },
            ],
            { cancelable: true }
        )
    }

  return (
    <ScreenWrapper>
        <FlatList
            data={posts}
            ListHeaderComponent={
                <UserHeader user={user} router={router} handleLogout={handleLogout} />
            }
            ListHeaderComponentStyle={{marginBottom: 30}}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: any) => item?.id.toString()}
            renderItem={({item}: any) => (
                <PostCard item={item} currentUser={user} router={router} />
            )}
            onEndReached={() => {
                getPosts();
            }}
            onEndReachedThreshold={0}
            ListFooterComponent={
                hasMore ? (
                    <View style={{marginVertical: posts.length == 0 ? 100 : 30}}>
                        <Loading />
                    </View>
                ) : (
                    <View style={{ marginVertical: 30 }}>
                        <Text style={styles.noPosts}>No more posts</Text>
                    </View>
                )
            }
        />
    </ScreenWrapper>
  );
};

export default Profile;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        marginHorizontal: wp(4),
        marginBottom: 20,
    },
    headerShape: {
        width: wp(100),
        height: hp(20),
    },
    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: "center",
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: "white",
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },
    userName: {
        fontSize: hp(3),
        fontWeight: "500",
        color: theme.colors.textWhite,
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    infoText: {
        fontSize: hp(1.6),
        fontWeight: "500",
        color: theme.colors.textWhite,
    },
    logoutButton: {
        position: "absolute",
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: "#fee2e2",
    },
    listStyle: {
        paddingHorizontal: wp(4),
        paddingBottom: 30,
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: "center",
        color: theme.colors.textWhite,
    },
});
