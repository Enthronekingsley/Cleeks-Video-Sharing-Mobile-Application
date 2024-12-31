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
import {supabase} from "@/lib/supabase";

const SignUp = () => {
    const router = useRouter();
    const nameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const passwordConfirmRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!emailRef.current && !passwordRef.current) {
            Alert.alert("Sign Up", "Please fill all the fields!");
            return;
        }
        if (!emailRef.current) {
            Alert.alert("Sign Up", "Please enter your email!");
            return;
        }
        if (!passwordRef.current) {
            Alert.alert("Sign Up", "Please enter your password!");
            return;
        }
        if (!passwordConfirmRef.current) {
            Alert.alert("Sign Up", "Please confirm your password!");
            return;
        }
        if (passwordConfirmRef.current && passwordRef.current !== passwordConfirmRef.current) {
            Alert.alert("Sign Up", "Passwords do not match!");
            return;
        }

        let name = nameRef.current.trim();
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        setLoading(true);


        const {data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        })

        setLoading(false);

        if (error) {
            Alert.alert("Sign Up", error.message);
        }
    }

    return (
        <ScreenWrapper bg="black">
            <ScrollView showsVerticalScrollIndicator={false}>
                <StatusBar style="dark" />
                <View style={styles.container}>
                    <BackButton router={router} />

                    {/*welcome*/}
                    <View>
                        <Text style={styles.welcomeText}>Let's</Text>
                        <Text style={styles.welcomeText}>Get Started</Text>
                    </View>

                    {/*form*/}
                    <View style={styles.form}>
                        <Text style={{fontSize: hp(1.5), color: theme.colors.textWhite}}>
                            Please fill the details to create an account
                        </Text>

                        <Input
                            title="User"
                            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                            placeholder="Enter your name"
                            onChangeText={(value: any) => nameRef.current = value}
                        />

                        <Input
                            title="Email"
                            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                            placeholder="Enter your email"
                            onChangeText={(value: any) => emailRef.current = value}
                        />

                        <Input
                            title="Password"
                            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                            placeholder="Enter your password"
                            onChangeText={(value: any) => passwordRef.current = value}
                        />

                        <Input
                            title="Confirm Password"
                            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                            placeholder="Confirm your password"
                            onChangeText={(value: any) => passwordConfirmRef.current = value}
                        />
                        <Pressable
                            onPress={() => router.push("/forgotPassword")}
                        >
                            <Text style={styles.forgotPassword}>
                                Forgot Password?
                            </Text>
                        </Pressable>

                        {/*button*/}
                        <Button
                            title="Sign Up"
                            handlePress={onSubmit}
                            loading={loading}
                        />
                    </View>

                    {/*footer*/}
                    <View style={styles.footer}>
                        <Image
                        source={require("@/assets/images/cleeksIconBlue.png")}
                        style={{height: 20, width: 20}}
                        />
                        <Text style={styles.footerText}>Already have an account?</Text>
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

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 30,
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
        color: theme.colors.primary,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
    footerText: {
        textAlign: "center",
        color: theme.colors.text,
        fontSize: hp(1.6)
    }
})