//@ts-nocheck
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const Logo = ({ fadeAnim, slideAnim }) => {
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
      <Text style={styles.logo}>E HOUSE</Text>
      <Text style={styles.tagline}>MOVERS & PACKERS</Text>
      {/* <View>
        <AntDesign name="profile" size={24} color="black" />
      </View> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#af1f23",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
    letterSpacing: 1,
  },
});

export default Logo;
