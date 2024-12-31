import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import ScreenWrapper from "@/components/ScreenWrapper";
import {StatusBar} from "expo-status-bar";
import {hp, wp} from "@/helpers/common";
import Button from "@/components/Button";
import {theme} from "@/constants/theme";
import {useRouter} from "expo-router";

const welcome = () => {
    const router = useRouter();
  return (
        <ScreenWrapper bg="black">
            <StatusBar style="dark" />
            <View style={styles.container}>

                {/*Cleeks logo*/}
                <Image
                    source={require("@/assets/images/cleeksLogoBlue.png")}
                    resizeMode="contain"
                    style={styles.logo}
                />

                {/*title*/}
                <View style={{ gap: 10 }}>
                    <Text style={styles.welcome}>Welcome to Cleeks</Text>
                    <Text style={styles.tagline}>
                        Where you get seen, get heard and get discovered.
                    </Text>
                </View>

                {/*footer*/}
                <View style={styles.footer}>
                    <Button
                        title="Get Started"
                        buttonStyle={{ marginHorizontal: wp(3) }}
                        handlePress={() => router.push("/signUp")}
                        hasShadow={false}
                    />
                    <View style={styles.buttonTextContainer}>
                        <Text style={styles.loginText}>
                            Already have an account!
                        </Text>
                        <Pressable
                            onPress={() => router.push("/login")}
                        >
                            <Text style={[styles.loginText, {color: theme.colors.primary, fontWeight: theme.fonts.semiBold as any}]}>
                                Login
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
  );
};

export default welcome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'black',
        paddingHorizontal: wp(4),
    },
    logo: {
        height: hp(40),
        width: wp(70),
        alignSelf: "center",
    },
    tagline: {
        textAlign: "center",
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: "white",
    },
    footer: {
        gap: 30,
        width: "100%",
    },
    welcome: {
        textAlign: "center",
        fontSize: hp(4),
        color: "white",
        fontWeight: theme.fonts.extraBold as any,
    },
    buttonTextContainer : {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        color: "white"
    },
    loginText: {
        textAlign: "center",
        color: "white",
        fontSize: hp(1.6)
    }
})