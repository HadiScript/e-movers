import { Stack } from "expo-router";
import React from "react";

export default function TabsLayout() {
  // Instead of Tabs, we'll use a Stack without any navigation UI
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Booking" />
    </Stack>
  );
}
