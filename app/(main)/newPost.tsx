import React, {useEffect, useRef, useState} from 'react';
import {Alert, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import {theme} from '@/constants/theme';
import {hp, wp} from '@/helpers/common';
import Avatar from '@/components/Avatar';
import {useAuth} from "@/context/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";
import {useLocalSearchParams, useRouter} from "expo-router";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import {getSupabaseFileUrl} from "@/services/imageService";
import {useVideoPlayer, VideoView} from "expo-video";
import {createOrUpdatePost} from "@/services/postService";

const NewPost = () => {
    const post = useLocalSearchParams();
    const {user} = useAuth();
    const bodyRef = useRef<any>("");
    const editorRef= useRef<any>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<any>(null);

    useEffect(() => {
        console.log("Post Body: ", post);
        if (post && post?.id) {
            bodyRef.current = post?.body;
            setFile(post?.file || null);
            setTimeout(() => {
                editorRef?.current?.setContentHTML(post?.body);
            }, 30);
        }
    }, []);

    const onPick = async (isImage: any) => {
        let mediaConfig = {
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        };
        if (!isImage) {
            mediaConfig = {
                mediaTypes: ["videos"],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1.0,
            };
        }
        let result = await ImagePicker.launchImageLibraryAsync(mediaConfig as any);

        if (!result.canceled) {
            setFile(result.assets[0]);
        }
    };

    const isLocalFile = (file: any) => {
        if (!file) return null;
        if (typeof file == "object") return true;

        return false;
    };
    const getFileType = (file: any) => {
        if (!file) return null;
        if (isLocalFile(file)) {
            return file.type;
        }

        // check image or video for remote file
        if (file.includes("postImages")) {
            return "image";
        }

        return "video";
    };

    const getFileUri = (file: any) => {
        if (!file) return null;
        if (isLocalFile(file)) {
            return file.uri;
        }

        return getSupabaseFileUrl(file)?.uri;
    };

    const onSubmit = async () => {
        if (!bodyRef.current && !file) {
            Alert.alert("Post", "Please choose an image or post body");
            return;
        }

        let data = {
            file,
            body: bodyRef.current,
            userId: user?.id,
        };

        if (post && post.id) (data as any).id = post.id;

        // create post
        setLoading(true);
        let res = await createOrUpdatePost(data);
        setLoading(false);
        if (res.success) {
            setFile(null);
            bodyRef.current = "";
            editorRef.current?.setContentHTML("")
            router.back();
        }else {
            Alert.alert("Post", (res as any)?.msg);
        }
    }

    const videoSource = getFileUri(file)

    const player = useVideoPlayer(videoSource, (player: any) => {
        player.loop = true;
        player.pause;
    });

  return (
    <ScreenWrapper bg="black">
        <View style={styles.container}>
            <Header title="Create Post" />
            <ScrollView contentContainerStyle={{gap: 20}} showsVerticalScrollIndicator={false}>
                {/*avatar*/}
                <View style={styles.header}>
                    <Avatar
                        uri={user?.image}
                        size={hp(6.5)}
                        rounded={theme.radius.xl}
                    />
                    <View style={{gap: 2}}>
                        <Text style={styles.username}>
                            {
                                user && user?.name
                            }
                        </Text>
                        <Text style={styles.publicText}>
                            Public
                        </Text>
                    </View>
                </View>

                <View style={styles.textEditor}>
                    <RichTextEditor
                        editorRef={editorRef}
                        onChange={(body: any) => (bodyRef.current = body)}
                    />
                </View>

                {file && (
                    <View style={styles.file}>
                        {getFileType(file) == "video" ? (
                            <VideoView
                                player={player}
                                style={{ flex: 1, height: hp(40), width: "100%", }}
                                allowsFullscreen
                                allowsPictureInPicture
                                contentFit="cover"
                            />
                        ) : (
                            <Image
                                source={{ uri: getFileUri(file) }}
                                resizeMode="cover"
                                style={{ flex: 1 }}
                            />
                        )}

                        <Pressable
                            onPress={() => setFile(null)}
                            style={styles.closeIcons}
                        >
                            <Icon name="delete" size={20} color="white" />
                        </Pressable>
                    </View>
                )}

                <View style={styles.media}>
                    <Text style={styles.addImageText}>Add to your post</Text>
                    <View style={styles.mediaIcons}>
                        <TouchableOpacity onPress={() => onPick(true)}>
                            <Icon name="image" size={30} color={theme.colors.textWhite} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => onPick(false)}>
                            <Icon name="video" size={33} color={theme.colors.textWhite} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Button
                title={post && post?.id ? "Update" : "Post"}
                buttonStyle={{height: hp(6.2)}}
                handlePress={onSubmit}
                loading={loading}
                hasShadow={false}
            />
        </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "red"
        marginBottom: 30,
        paddingHorizontal: wp(4),
        gap: 15,
    },
    title: {
        // marginBottom: 10,
        fontSize: hp(2.5),
        fontWeight: theme.fonts.semiBold as any,
        color: theme.colors.text,
        textAlign: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    username: {
        fontSize: hp(2.2),
        fontWeight: theme.fonts.semiBold as any,
        color: theme.colors.textWhite,
    },
    avatar: {
        height: hp(6.5),
        width: hp(6.5),
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
    },
    publicText: {
        fontSize: hp(1.7),
        fontWeight: theme.fonts.medium as any,
        color: theme.colors.textLight,
    },
    textEditor: {
        // marginTop: 10
    },
    media: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1.5,
        padding: 12,
        paddingHorizontal: 18,
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
        borderColor: theme.colors.gray,
    },
    mediaIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    addImageText: {
        fontSize: hp(1.9),
        fontWeight: theme.fonts.semiBold as any,
        color: theme.colors.text,
    },
    imageIcon: {
        // backgroundColor: theme.colors.gray,
        borderRadius: theme.radius.md,
        // padding: 6,
    },
    file: {
        height: hp(30),
        width: "100%",
        borderRadius: theme.radius.xl,
        overflow: "hidden",
        borderCurve: "continuous",
    },
    video: {},
    closeIcons: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 7,
        borderRadius: 50,
        // backgroundColor: "rgba(255,0,0,0.6)",
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },
});
