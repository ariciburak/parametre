import React from "react";
import { StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { MainNavigator } from "./MainNavigator";

export const AppNavigator = () => {
  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </>
  );
};
