import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {theme} from "@/constants/theme";

const RichTextEditor = ({editorRef, onChange} : any) => {
  return (
    <View style={{minHeight: 285}}>
        <RichToolbar
            actions={[
                actions.setStrikethrough,
                actions.removeFormat,
                actions.setBold,
                actions.setItalic,
                actions.insertOrderedList,
                actions.blockquote,
                actions.alignLeft,
                actions.alignCenter,
                actions.alignFull,
                actions.alignRight,
                actions.code,
                actions.line,
                actions.heading1,
                actions.heading4,
            ]}
            iconMap={{
                [actions.heading1]: ({tintColor} : any) => <Text style={{color: tintColor}}>H1</Text>,
                [actions.heading4]: ({tintColor} : any) => <Text style={{color: tintColor}}>H4</Text>
            }}
            style={styles.richBar}
            flatContainerStyle={styles.flatStyle}
            selectedIconTint={theme.colors.primary}
            editor={editorRef}
            disabled={false}
        />

        <RichEditor
            ref={editorRef}
            containerStyle={styles.rich}
            editorStyle={styles.contentStyle}
            onChange={onChange}
            placeholder={"Start Writing Here"}
        />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
    richBar: {
        borderTopRightRadius: theme.radius.xl,
        borderTopLeftRadius: theme.radius.xl,
        backgroundColor: theme.colors.gray,
    },
    rich: {
        minHeight: 240,
        flex: 1,
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderBottomLeftRadius: theme.radius.xl,
        borderBottomRightRadius: theme.radius.xl,
        borderColor: theme.colors.gray,
        padding: 5,
    },
    contentStyle: {
        color: theme.colors.textDark,
        // placeholderColor: "gray",
    },
    flatStyle: {
        paddingHorizontal: 8,
        gap: 3,
    }
})