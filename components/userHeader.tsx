import React from 'react';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Header from "@/components/Header";
import {theme} from "@/constants/theme";
import Icon from '@/assets/icons';
import {hp, wp} from '@/helpers/common';
import Avatar from "@/components/Avatar";

const UserHeader = ({ user, router, handleLogout } : any) => {
  return (
    <View style={{ flex: 1, backgroundColor: "black", paddingHorizontal: wp(4) }}>
        <View>
            <Header title="Profile" mb={30} />
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="logout" color={theme.colors.textWhite} />
            </TouchableOpacity>
        </View>

        <View style={styles.container}>
            <View style={{ gap: 15 }}>
                <View style={styles.avatarContainer}>
                    <Avatar
                        uri={user?.image}
                        size={hp(12)}
                        rounded={theme.radius.xxl*1.4}
                    />
                    <Pressable
                        style={styles.editIcon}
                        onPress={() => router.push("editProfile")}
                    >
                        <Icon
                            name="edit"
                            strokeWidth={2.5}
                            size={20}
                            color={theme.colors.primary}
                        />
                    </Pressable>
                </View>

                {/*username and address*/}
                <View style={{ alignItems: "center", gap: 3 }}>
                    <Text style={styles.userName}>{user && user.name}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {user && user.star ? (
                            <Text style={styles.starContainer}>
                                {/* Display the stars inside brackets */}
                                {'('}
                                {Array.from({ length: user.star }).map((_, index) => (
                                    <Text key={index} style={styles.star}>
                                        ★
                                    </Text>
                                ))}
                                {')'}
                            </Text>
                        ) : (
                            <Text>No stars to display</Text>
                        )}
                    </View>

                    <Text style={styles.infoText}>{user && user.address}</Text>
                </View>

                {/*email, phone and bio*/}
                <View style={{ gap: 10 }}>
                    <View style={styles.info}>
                        <Icon
                            name="mail"
                            size={20}
                            color={theme.colors.textLight}
                        />
                        <Text style={styles.infoText}>{user && user?.email}</Text>
                    </View>

                    {user && user.phoneNumber && (
                        <View style={styles.info}>
                            <Icon
                                name="call"
                                size={20}
                                color={theme.colors.textLight}
                            />
                            <Text style={styles.infoText}>{user && user.phoneNumber}</Text>
                        </View>
                    )}

                    {user && user.bio && (
                        <View style={styles.info}>
                            <Icon
                                name="bio"
                                size={20}
                                color={theme.colors.textLight}
                            />
                            <Text style={styles.info}>{user?.bio}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    </View>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        marginHorizontal: wp(4),
        marginBottom: 20,
    },
    headerShape: {
        width: wp(100),
        height: hp(20),
    },
    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: "center",
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: theme.colors.textWhite,
        shadowColor: theme.colors.textLight,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },
    userName: {
        fontSize: hp(3),
        fontWeight: "500",
        color: theme.colors.textWhite,
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        color: theme.colors.textLight,
        maxWidth: wp(90),
    },
    infoText: {
        fontSize: hp(1.6),
        fontWeight: "500",
        color: theme.colors.textLight,
    },
    logoutButton: {
        position: "absolute",
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.primary,
    },
    listStyle: {
        paddingHorizontal: wp(4),
        paddingBottom: 30,
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: "center",
        color: theme.colors.text,
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: hp(2),
        color: theme.colors.textWhite,
    },
    star: {
        color: theme.colors.primary,
        fontSize: hp(1.4),
    }
})