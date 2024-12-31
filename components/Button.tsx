import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {theme} from "@/constants/theme";
import {hp} from "@/helpers/common";
import Loading from "@/components/Loading";

type Props = {
    buttonStyle?: any,
    textStyle?: any,
    title: string,
    handlePress: () => void,
    loading?: boolean,
    hasShadow?: boolean
}

const Button = ({ buttonStyle, textStyle, title, handlePress, loading=false, hasShadow=false } : Props) => {

    const shadowStyle = {
        shadowColor: theme.colors.dark,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
    }

    if (loading) {
        return (
            <View style={[styles.button, buttonStyle, {backgroundColor: "black"}]}>
                <Loading />
            </View>
        )
    }

  return (
    <Pressable
        onPress={handlePress}
        style={[styles.button, buttonStyle, hasShadow && shadowStyle]}
    >
        <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary,
        height: hp(6.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: "continuous",
        borderRadius: theme.radius.xl,
    },
    text: {
        fontSize: hp(2.5),
        color: "white",
        fontWeight: theme.fonts.bold as any
    },
})