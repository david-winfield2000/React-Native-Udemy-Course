import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";
import commonStyles from "../constants/commonStyles";
import { authenticate, setDidTryAutoLogin } from "../store/authSlice";
import { getUserData } from "../utils/actions/userActions";

const StartUpScreen = (props) => {
    const dispatch = useDispatch();

    // only execute this code if dispatch changes
    useEffect(() => {
        const tryLogin = async () => {
            const storedAuthInfo = await AsyncStorage.getItem("userData");

            // Nothing found for the key
            if (!storedAuthInfo) {
                dispatch(setDidTryAutoLogin());
                return;
            }

            const parsedData = JSON.parse(storedAuthInfo);
            const { token, userId, expirationDate: expirationDateString } = parsedData;

            const expirationDate = new Date(expirationDateString);
            if (expirationDate <= new Date() || !token || !userId) {
                dispatch(setDidTryAutoLogin());
                return;
            }

            const userData = await getUserData(userId);
            dispatch(authenticate({ token: token, userData: userData }));
        };
        tryLogin();
    }, [dispatch]);

    return (
        <View style={commonStyles.center}>
            <ActivityIndicator size={"large"} color={colors.primary} />
        </View>
    );
};

export default StartUpScreen;
