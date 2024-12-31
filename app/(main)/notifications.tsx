import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {fetchNotifications} from "@/services/notificationService";
import {useAuth} from "@/context/AuthContext";
import {hp, wp} from "@/helpers/common";
import {theme} from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import {useRouter} from "expo-router";
// import NotificationItem from "@/components/NotificationItem";
import Header from "@/components/Header";
import NotificationItem from "@/components/NotificationItem";

const Notifications = () => {
    const [notifications, setNotifications] = useState<any>([]);
    const {user} = useAuth();
    const router = useRouter();

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        let res = await fetchNotifications(user?.id);
        if (res.success) setNotifications(res?.data);
    }
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Header title="Notifications" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listStyle}
                >
                    {
                        notifications.map((item: any) => {
                            return (
                                <NotificationItem
                                    item={item}
                                    key={item?.id}
                                    router={router}
                                />
                            )
                        })
                    }
                    {
                        notifications.length == 0 && (
                            <Text style={styles.noData}>No notifications yet</Text>
                        )
                    }
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}
export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    listStyle: {
        paddingVertical: 20,
        gap: 10
    },
    noData: {
        fontSize: hp(1.8),
        fontWeight: theme.fonts.medium as any,
        color: theme.colors.textWhite,
        textAlign: "center",
    },
})