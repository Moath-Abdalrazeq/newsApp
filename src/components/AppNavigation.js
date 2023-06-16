import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Livestream from "./LiveStream";
import HostPage from "./HostPage";
import AudiencePage from "./AudiancePage";


const Stack = createNativeStackNavigator();

export default function AppNavigation(props) {
    return (
        <Stack.Navigator initialRouteName="HomePage">
            <Stack.Screen options={{headerShown: false}} headerMode="none" name="HomePage" component={Livestream} />
            <Stack.Screen options={{headerShown: false}} name="HostPage" component={HostPage} />
            <Stack.Screen options={{headerShown: false}} name="AudiencePage" component={AudiencePage} />
        </Stack.Navigator>
    );
}