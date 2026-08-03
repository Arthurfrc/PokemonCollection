// src/navigation/RootNavigator.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "@/navigation/TabNavigator";
import CardFormScreen from "@/screens/CardFormScreen";

export type RootStackParamList = {
  Tabs: undefined;
  CardForm: { cardId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="CardForm" component={CardFormScreen} options={{ title: "Carta" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}