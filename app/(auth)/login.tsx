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

const Login = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!emailRef.current && !passwordRef.current) {
            Alert.alert("Login", "Please fill all the fields!");
            return;
        }
        if (!emailRef.current) {
            Alert.alert("Login", "Please enter your email!");
            return;
        }
        if (!passwordRef.current) {
            Alert.alert("Login", "Please enter your password!");
            return;
        }

        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        setLoading(true);

        const {error} = await supabase.auth.signInWithPassword({
            email,
            password
        })

        setLoading(false);

        if (error) {
            Alert.alert("Login", error.message);
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
                    <Text style={styles.welcomeText}>Hey,</Text>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                </View>

                {/*form*/}
                <View style={styles.form}>
                    <Text style={{fontSize: hp(1.5), color: theme.colors.textWhite}}>
                        Please login to continue
                    </Text>
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
                    <Pressable
                        onPress={() => router.push("/forgotPassword")}
                    >
                        <Text style={styles.forgotPassword}>
                            Forgot Password?
                        </Text>
                    </Pressable>

                    {/*button*/}
                    <Button
                        title="Login"
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
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Pressable
                        onPress={() => router.push("/signUp")}
                    >
                        <Text style={[styles.footerText, {color: theme.colors.primary, fontWeight: theme.fonts.semiBold as any}]}>Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    </ScreenWrapper>
  );
};

export default Login;

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