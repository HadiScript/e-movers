import React from "react";
import { Redirect } from "expo-router";

export default function Index() {
  // This redirects to the home screen in the (tabs) directory
  return <Redirect href="/(tabs)" />;
}
