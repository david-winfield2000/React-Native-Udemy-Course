import React from "react";
import { Button } from "react-native";
import { View, Text, StyleSheet } from "react-native";

const ChatListScreen = (props) => {
    return (
        <View style={styles.container}>
            <Text>Chat list screen</Text>
            <Button
                title="Go to chat screen"
                onPress={() => {
                    props.navigation.navigate("ChatScreen");
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ChatListScreen;
