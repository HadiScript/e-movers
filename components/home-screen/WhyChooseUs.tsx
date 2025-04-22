// @ts-nocheck
import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const WhyChooseUs = ({ fadeAnim }) => {
  return (
    <Animated.View style={{ opacity: fadeAnim, marginTop: 30 }}>
      <Text style={styles.sectionTitle}>Why Choose Us</Text>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <FontAwesome5 name="clock" size={24} color="#af1f23" />
          <Text style={styles.featureTitle}>Time-Efficient</Text>
        </View>

        <View style={styles.featureItem}>
          <FontAwesome5 name="shield-alt" size={24} color="#af1f23" />
          <Text style={styles.featureTitle}>Safe & Secure</Text>
        </View>

        <View style={styles.featureItem}>
          <FontAwesome5 name="hand-holding-usd" size={24} color="#af1f23" />
          <Text style={styles.featureTitle}>Affordable</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  featureItem: {
    alignItems: "center",
    width: "30%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
  },
  featureTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default WhyChooseUs;
