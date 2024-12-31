import React, {useEffect, useRef, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuth} from '@/context/AuthContext';
import {theme} from '@/constants/theme';
import {hp, wp} from '@/helpers/common';
import PostCard from "@/components/PostCard";
import Input from "@/components/Input";
import Icon from '@/assets/icons';
import Loading from "@/components/Loading";
import {createComment, fetchPostDetails, removeComment, removePost} from "@/services/postService";
import {createNotification} from '@/services/notificationService';
import {getUserData} from "@/services/userService";
import {supabase} from "@/lib/supabase";
import CommentItem from '@/components/CommentItem';

const postDetails = () => {
    const {postId, commentId} = useLocalSearchParams();
    const {user} = useAuth();
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(true);
    const inputRef = useRef<any>(null);
    const commentRef = useRef("");
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<any>();

    const handleNewComment = async (payload: any) => {
        if (payload.new) {
            let newComment = { ...payload.new };
            let res = await getUserData(newComment.userId);
            newComment.user = res.success ? res.data : {};
            setPost((prevPost: any) => {
                return {
                    ...prevPost,
                    comments: [newComment, ...prevPost?.comments],
                };
            });
        }
    };

    useEffect(() => {
        let commentChannel = supabase
            .channel("comments")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "comments",
                    filter: `postId=eq.${postId}`,
                },
                handleNewComment
            )
            .subscribe();

        getPostDetails();

        return () => {
            supabase.removeChannel(commentChannel);
        };
    }, []);

    const getPostDetails = async () => {
        // fetch post details
        let res = await fetchPostDetails(postId);
        if (res.success) setPost(res.data);
        setStartLoading(false);
    }

    const onNewComment = async () => {
        if (!commentRef.current) return null;
        let data = {
            userId: user?.id,
            postId: post?.id,
            text: commentRef.current
        }
        // create comment
        setLoading(true);
        let res = await createComment(data);
        setLoading(false);
        if (res.success) {
            if (user.id != post.userId) {
                // send notification
                let notify = {
                    senderId: user.id,
                    receiverId: post.userId,
                    title: "commented on your post",
                    data: JSON.stringify({ postId: post.id, commentId: res?.data?.id }),
                };
                createNotification(notify);
            }
            inputRef?.current?.clear();
            commentRef.current = "";
        } else {
            Alert.alert("Comment", res.msg);
        }
    }

    const onDeleteComment = async (comment: any) => {
        let res = await removeComment(comment?.id);
        if (res.success) {
            setPost((prevPost: any) => {
                let updatedPost = {...prevPost};
                updatedPost.comments = updatedPost?.comments?.filter(
                    (c: any) => c.id !== comment?.id
                );
                return updatedPost;
            });
        }else {
            Alert.alert("Comment", res.msg);
        }
    };

    const onDeletePost = async (item: any) => {
        // delete post here
        let res = await removePost(post?.id);
        if (res.success) {
            router.back();
        } else {
            Alert.alert("Post", res.msg);
        }
    };

    const onEditPost = async (item: any) => {
        router.back();
        router.push({ pathname: "/newPost", params: { ...item } });
    };

    if (startLoading) {
        return (
            <View style={styles.center}>
                <Loading />
            </View>
        )
    }

    if (!post) {
        return (
            <View style={[styles.center, {justifyContent: "flex-start", marginTop: 100}]}>
                <Text style={styles.notFound}>Post not found!</Text>
            </View>
        )
    }
  return (
    <View style={styles.container}>
      <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
      >
        <PostCard
            item={{...post, comments: [{count: post?.comments?.length}]}}
            currentUser={user}
            router={router}
            hasShadow={false}
            showMoreIcon={false}
            showDelete={true}
            onDelete={onDeletePost}
            onEdit={onEditPost}
        />

          {/*comment input*/}
          <View style={styles.inputContainer}>
            <Input
                inputRef={inputRef}
                placeholder="Type comment..."
                onChangeText={(value: any) => commentRef.current = value}
                placeholderTextColor={theme.colors.textLight}
                containerStyle={{flex: 1, height: hp(6.2), borderRadius: theme.radius.xl}}
            />

              {
                  loading? (
                      <View style={styles.loading}>
                          <Loading size="small" />
                      </View>
                  ): (
                      <TouchableOpacity
                          style={styles.sendIcon}
                          onPress={onNewComment}
                      >
                          <Icon name="send" size={hp(3)} color={theme.colors.primary} />
                      </TouchableOpacity>
                  )
              }
          </View>

          {/*comment list*/}
          <View style={{ marginVertical: 15, gap: 17 }}>
              {post?.comments?.map((comment: any) => (
                <CommentItem
                    item={comment}
                    key={comment?.id?.toString()}
                    onDelete={onDeleteComment}
                    highlight={comment.id == commentId}
                    canDelete={user.id == comment.userId || post.userId}
                />
              ))}

              {post?.comments?.length == 0 && (
                  <Text style={{color: theme.colors.textWhite, marginLeft: 5}}>
                      Be first to comment!
                  </Text>
              )}
          </View>
      </ScrollView>
    </View>
  );
};

export default postDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        paddingVertical: wp(7)
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    list: {
        paddingHorizontal: wp(4),
    },
    sendIcon: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.8,
        borderColor: theme.colors.textWhite,
        borderRadius: theme.radius.lg,
        borderCurve: "continuous",
        height: hp(5.8),
        width: hp(5.8)
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.textWhite,
        fontWeight: theme.fonts.medium as any,
    },
    loading: {
        height: hp(5.8),
        width: hp(5.8),
        justifyContent: "center",
        alignItems: "center",
        transform: [{scale: 1.3}]
    }
});