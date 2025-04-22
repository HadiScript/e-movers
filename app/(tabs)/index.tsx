// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Logo from "@/components/home-screen/Logo";
import Slider from "@/components/home-screen/Slider";
import Services from "@/components/home-screen/Services";
import WhyChooseUs from "@/components/home-screen/WhyChooseUs";
import Contact from "@/components/home-screen/Contact";
import BookingBtn from "@/components/home-screen/BookingBtn";
import { router } from "expo-router";

export default function HomeScreen({ navigation }) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Start animations when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const handleBooking = () => {
    router.push("/(tabs)/Booking");
    // Add your booking logic here, such as navigation.navigate('BookingScreen')
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Logo fadeAnim={fadeAnim} slideAnim={slideAnim} />
        <Slider />
        <Services fadeAnim={fadeAnim} slideAnim={slideAnim} />
        {/* <WhyChooseUs fadeAnim={fadeAnim} /> */}
        <Contact />
        <View style={styles.bottomPadding} />
      </ScrollView>

      <BookingBtn onBook={handleBooking} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 0,
  },
  bottomPadding: {
    height: 80, // Adjust this value based on your booking button height
  },
});
