import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {theme} from "@/constants/theme";


type Props = {
    size?: number | "small" | "large";
    color?: any;
}
const Loading = ({ size="large", color=theme.colors.primary } : Props) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({})