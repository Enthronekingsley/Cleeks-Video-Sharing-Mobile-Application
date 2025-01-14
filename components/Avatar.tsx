import React from 'react';
import {StyleSheet, View} from 'react-native';
import {hp} from "@/helpers/common";
import {theme} from "@/constants/theme";
import {Image} from "expo-image";
import {getUserImageSrc} from "@/services/imageService";

const Avatar = ({ uri, size=hp(4.5), rounded=theme.radius.md, style={} } : any) => {
  return (
    <View>
      <Image
        source={getUserImageSrc(uri)}
        transition={100}
        style={[styles.avatar, {height: size, width: size, borderRadius: rounded}, style]}
      />
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
    avatar: {
        borderCurve: "continuous",
        borderColor: theme.colors.darkLight,
        borderWidth: 1,
    }
})