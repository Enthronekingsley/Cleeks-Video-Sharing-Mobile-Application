import React, {useRef, useState} from 'react';
import {Alert, Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import ScreenWrapper from "@/components/ScreenWrapper";
import {StatusBar} from "expo-status-bar";
import BackButton from "@/components/BackButton";
import {useRouter} from "expo-router";
import {theme} from '@/constants/theme';
import {hp, wp} from "@/helpers/common";
import Input from "@/components/Input";
import Icon from "@/assets/icons";
import Button from "@/components/Button";

const ForgotPassword = () => {
    const router = useRouter();
    const nameRef = useRef("");
    const emailRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onForgottenPassword = async () => {
        if (!nameRef.current && !emailRef.current) {
            Alert.alert("Login", "Please fill all the fields!");
            return;
        }
        if (!nameRef.current) {
            Alert.alert("Login", "Please enter your registered name!");
            return;
        }
        if (!emailRef.current) {
            Alert.alert("Login", "Please enter your registered email!");
            return;
        }
        // compare entered email with registered email

        let name = nameRef.current.trim();
        let email = emailRef.current.trim();

        setLoading(true);

        // const {error} = await supabase.auth.signInWithPassword({
        //     email,
        //     password
        // })

        setLoading(false);

        // if (error) {
        //     Alert.alert("Login", error.message);
        // }
    }

    return (
        <ScreenWrapper bg="black">
            <ScrollView showsVerticalScrollIndicator={false}>
                <StatusBar style="dark" />
                <View style={styles.container}>
                    <BackButton router={router} />


                    <View>
                        <Text style={styles.welcomeText}>Password</Text>
                        <Text style={styles.welcomeText}>Reset</Text>
                    </View>

                    {/*form*/}
                    <View style={styles.form}>
                        <Text style={{fontSize: hp(1.5), color: theme.colors.textWhite}}>
                            Please complete this form to reset your password
                        </Text>
                        <Input
                            title="Name"
                            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                            placeholder="Enter your registered name"
                            onChangText={(value: any) => nameRef.current = value}
                        />

                        <Input
                            title="Email"
                            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                            placeholder="Enter your registered email"
                            onChangeText={(value: any) => emailRef.current = value}
                        />

                        {/*button*/}
                        <View style={{paddingTop: 20}}>
                            <Button
                                title="Reset Password"
                                handlePress={onForgottenPassword}
                                loading={loading}
                            />
                        </View>
                    </View>

                    {/*footer*/}
                    <View style={styles.footer}>
                        <Image
                            source={require("@/assets/images/cleeksIconBlue.png")}
                            style={{height: 20, width: 20}}
                        />
                        <Text style={styles.footerText}>To login continue to</Text>
                        <Pressable
                            onPress={() => router.push("/login")}
                        >
                            <Text style={[styles.footerText, {color: theme.colors.primary, fontWeight: theme.fonts.semiBold as any}]}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        padding: wp(5),
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold as any,
        color: theme.colors.textWhite,
    },
    form: {
        gap: 25,
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: theme.fonts.semiBold as any,
        color: theme.colors.textWhite,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 0,
    },
    footerText: {
        textAlign: "center",
        color: theme.colors.text,
        fontSize: hp(1.6),
        paddingLeft: 5
    }
})