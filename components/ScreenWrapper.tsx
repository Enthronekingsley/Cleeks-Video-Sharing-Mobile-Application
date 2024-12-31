import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";

type Props = {
    children: any;
    bg?: any
}

const ScreenWrapper = ({ children, bg="black" } : Props) => {
    const {top} = useSafeAreaInsets();
    const paddingTop = top > 0 ? top: 5;
    return (
        <View style={{ flex: 1, paddingTop, backgroundColor: bg}}>
            {
                children
            }
        </View>
    )
};

export default ScreenWrapper;