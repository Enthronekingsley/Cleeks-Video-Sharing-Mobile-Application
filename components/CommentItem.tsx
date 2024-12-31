import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import moment from "moment";
import {theme} from '@/constants/theme';
import {hp} from "@/helpers/common";
import Avatar from "@/components/Avatar";
import Icon from '@/assets/icons';

const CommentItem = ({item, canDelete=false, onDelete=()=>{}, highlight=false}: any) => {
    const createdAt = moment(item?.created_at).format("MMM d YYYY");

    const handleDelete = () => {
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
            ],
        )
    }
  return (
    <View style={styles.container}>
      <Avatar
        uri={item?.user?.image}
      />
        <View style={[styles.content, highlight && styles.highlight]}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <View style={styles.nameContainer}>
                    <Text style={styles.text}>
                        {
                            item?.user?.name
                        }
                    </Text>
                    <Text>.</Text>
                    <Text style={[styles.text, {color: theme.colors.textLight}]}>
                        {
                            createdAt
                        }
                    </Text>
                </View>
                {
                    canDelete && (
                        <TouchableOpacity onPress={handleDelete}>
                            <Icon name="delete" size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                    )
                }
            </View>
            <Text style={[styles.text, {fontWeight: "normal"}]}>
                {item?.text}
            </Text>
        </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        gap: 7,
    },
    content: {
        // backgroundColor: "rgba(0, 0, 0, 0.06)",
        backgroundColor: theme.colors.text,
        flex: 1,
        gap: 5,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: theme.radius.md,
        borderCurve: "continuous",
    },
    highlight: {
        borderWidth: 0.2,
        backgroundColor: "black",
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.textWhite,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    nameContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    text: {
        fontSize: hp(1.6),
        fontWeight: theme.fonts.medium as any,
        color: theme.colors.textWhite,
    }
})