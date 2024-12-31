import React, {useState} from 'react';
import {Image, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {theme} from "@/constants/theme";
import {hp} from "@/helpers/common";
import icons from "@/constants/icons";

const Input = (props : any) => {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={[styles.container, props.containerStyle && props.containerStyle]}>
        {
            props.icon && props.icon
        }
        <TextInput
            style={{ flex: 1, color: theme.colors.textWhite }}
            placeholderTextColor={theme.colors.textLight}
            secureTextEntry={props.title === "Password" && !showPassword || props.title === "Confirm Password" && !showPassword}
            ref={props.inputRef && props.inputRef}
            keyboardType={props.title === "Email" ? "email-address" : "default"}
            {...props}
        />
        {props.title === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                    source={!showPassword ? icons.eye : (icons.eyeHide as any)}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        )}
        {props.title === "Confirm Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                    source={!showPassword ? icons.eye : (icons.eyeHide as any)}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: hp(7.2),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.4,
        borderColor: theme.colors.textWhite,
        borderRadius: theme.radius.xxl,
        borderCurve: "continuous",
        paddingHorizontal: 18,
        gap: 12,
    }
})