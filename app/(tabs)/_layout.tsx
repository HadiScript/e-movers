import { Stack } from "expo-router";
import React from "react";

export default function TabsLayout() {
  // Instead of Tabs, we'll use a Stack without any navigation UI
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* booking-success */}
      <Stack.Screen name="booking-success" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="Booking" />
    </Stack>
  );
}
