import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, Share, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {theme} from "@/constants/theme";
import {hp, stripHTMLTags, wp} from "@/helpers/common";
import Avatar from "@/components/Avatar";
import Loading from './Loading';
import Icon from '@/assets/icons';
import {useVideoPlayer, VideoView} from "expo-video";
import {Image} from "expo-image";
import moment from "moment";
import RenderHTML from "react-native-render-html";
import {downloadFile, getSupabaseFileUrl} from '@/services/imageService';
import {createPostLike, removePostLike} from "@/services/postService";

type Props = {
    item: any;
    currentUser: any;
    router: any;
    hasShadow?: boolean;
    playingIndex?: any;
    index?: any;
    showMoreIcon?: boolean;
    showDelete?: boolean;
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
}
const textStyle = {
    color: theme.colors.textWhite,
    fontSize: hp(1.75),
}
const tagStyles = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: {
        color: theme.colors.dark,
    },
    h4: {
        color: theme.colors.dark,
    }
}
const {height: screenHeight} = Dimensions.get("screen")
const PostCard = ({
                      item,
                      currentUser,
                      router,
                      hasShadow=true,
                      showMoreIcon=true,
                      showDelete=false,
                      index,
                      playingIndex,
                      onEdit=()=>{},
                      onDelete=()=>{}
} : Props) => {
    const [likes, setLikes] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const shadowStyles = {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    }
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setLikes(item?.postLikes)
    }, []);

    const openPostDetails = () => {
        if (!showMoreIcon) return null;
        router.push({pathname: "postDetails", params: {postId: item?.id}})
    }

    const onLike = async () => {
        if (liked) {
            let updatedLikes = likes.filter((like) => like.userId !== currentUser?.id);
            setLikes([...updatedLikes])
            let res = await removePostLike(item?.id, currentUser?.id);
            if (!res.success) {
                Alert.alert("Post", "Something went wrong!");
            }
        }else {
            let data = {
                userId: currentUser?.id,
                postId: item?.id
            }
            setLikes([...likes, data])
            let res: any = await createPostLike(data);
            if (!res.success) {
                Alert.alert("Post", "Something went wrong!");
            }
        }
    }

    const onShare = async () => {
        let content: any = {message: stripHTMLTags(item?.body)};
        if (item?.file) {
            // download the file and share the local uri
            setLoading(true);
            let url = await downloadFile(getSupabaseFileUrl(item?.file)?.uri);
            setLoading(false);
            content.url = url;
        }
        Share.share(content)
    }

    const handlePostDelete = () => {
        Alert.alert("Confirm", "Are you sure you want to do this?", [
            {
                text: "Cancel",
                onPress: () => console.log("modal cancelled"),
                style: "cancel"
            },
            {
                text: "Delete",
                onPress: () => onDelete(item),
                style: "destructive",
            }
        ])
    }

    const videoSource = getSupabaseFileUrl(item?.file);
    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = true;
    });

    useEffect(() => {
        if (playingIndex === index) {
            player.replay()
            player.pause();
        } else {
            player.pause();
        }


    }, [playingIndex]);


    const createdAt: string = moment(item?.created_at).format("MMM DD YYYY");
    const liked: boolean = likes.filter((like: any) => like.userId == currentUser.id)[0] ? true : false;
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
          {/*user info and post time*/}
          <View style={styles.userInfo}>
              <Avatar
                uri={item?.users?.image}
                size={hp(4.5)}
                rounded={theme.radius.md}
              />
              <View style={{gap: 2}}>
                  <Text style={{color: "white"}}>{item?.users?.name}</Text>
                  <Text style={styles.postTime}>{createdAt}</Text>
              </View>
          </View>

          {
              showMoreIcon && (
                  <TouchableOpacity onPress={openPostDetails}>
                      <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.textWhite} />
                  </TouchableOpacity>
              )
          }

          {
              showDelete && currentUser.id == item?.userId && (
                  <View style={styles.actions}>
                      <TouchableOpacity onPress={() =>onEdit(item)}>
                          <Icon name="edit" size={hp(2.5)} color={theme.colors.text} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handlePostDelete}>
                          <Icon name="delete" size={hp(2.5)} color={theme.colors.rose} />
                      </TouchableOpacity>
                  </View>
              )
          }

      </View>

        {/*post body and media*/}
        <View style={styles.content}>
            <View style={styles.postBody}>
                {
                    item?.body && (
                        <RenderHTML
                            contentWidth={wp(100)}
                            source={{html: item?.body}}
                            tagsStyles={tagStyles}
                        />
                    )
                }
            </View>

            {/*post image*/}
            {
                item?.file && item?.file?.includes("postImages") && (
                    <Image
                        source={getSupabaseFileUrl(item?.file)}
                        transition={100}
                        style={styles.postMedia}
                        contentFit="contain"
                    />
                )
            }

            {/*post video*/}
            {
                item?.file && item?.file?.includes("postVideos") && (
                    <VideoView
                        player={player}
                        style={{ flex: 1, height: hp(40), width: "100%", }}
                        allowsFullscreen
                        allowsPictureInPicture
                        contentFit="cover"
                    />
                )
            }
        </View>

        {/*like, comment and share*/}
        <View style={styles.footer}>
            <View style={styles.footerButton}>
                <TouchableOpacity onPress={onLike}>
                    <Icon
                        name="heart"
                        size={24}
                        fill={liked ? theme.colors.rose : "transparent"}
                        strokeWidth={2}
                        color={liked ? theme.colors.rose : theme.colors.textLight}
                    />
                </TouchableOpacity>
                <Text style={styles.count}>
                    {
                        likes?.length
                    }
                </Text>
            </View>
            <View style={styles.footerButton}>
                <TouchableOpacity onPress={openPostDetails}>
                    <Icon
                        name="comment"
                        size={24}
                        strokeWidth={2}
                        color={theme.colors.textLight}
                    />
                </TouchableOpacity>
                <Text style={styles.count}>
                    {
                        item?.comments[0]?.count
                    }
                </Text>
            </View>
            <View style={styles.footerButton}>
                {
                    loading? (
                        <Loading size="small" />
                    ): (
                        <TouchableOpacity onPress={onShare}>
                            <Icon
                                name="share" size={24}
                                strokeWidth={2}
                                color={theme.colors.textLight}
                            />
                        </TouchableOpacity>
                    )
                }

            </View>
        </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 50,
        borderRadius: theme.radius.xxl*1.1,
        borderCurve: "continuous",
        padding: 10,
        paddingVertical: 12,
        backgroundColor: "black",
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: "#ffffff",
        height: hp(95),
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    username: {
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium as any,
    },
    postTime: {
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium as any,
    },
    content: {
        gap: 5,
        height: screenHeight * 0.7,
    },
    postMedia: {
        height: hp(40),
        width: "100%",
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
    },
    videoPlayer: {
        flex: 1,
        height: hp(40),
        width: "100%",
    },
    postBody: {
        marginLeft: 5,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    footerButton: {
        marginLeft: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },
    count: {
        color: theme.colors.text,
        fontSize: hp(1.8),
    }
});
