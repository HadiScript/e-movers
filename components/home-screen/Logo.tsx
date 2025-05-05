//@ts-nocheck
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
// import '../../'

const Logo = ({ fadeAnim, slideAnim, white = false }) => {
  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {white ? (
        <Image
          source={require("../../assets/images/logo-white.png")}
          style={styles.logoImage}
        />
      ) : (
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logoImage}
        />
      )}
      {/* <Text style={styles.tagline}>MOVERS & PACKERS</Text> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  logoImage: {
    width: 150,
    height: 60,
    resizeMode: "contain", // keeps aspect ratio
  },
  tagline: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
    letterSpacing: 1,
  },
});

export default Logo;
