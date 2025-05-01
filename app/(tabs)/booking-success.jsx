//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import ConfettiCannon from "react-native-confetti-cannon"; // Import confetti cannon

const { width, height } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

const BookingSuccessScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const confettiRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  // Trigger confetti again after initial explosion
  const [confettiKey, setConfettiKey] = useState(0);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade in button with slight delay
    setTimeout(() => {
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1200);

    // Reset confetti every 5 seconds for continuous celebration
    const intervalId = setInterval(() => {
      setConfettiKey((prevKey) => prevKey + 1);
    }, 5000);

    // Clean up interval
    return () => clearInterval(intervalId);
  }, []);

  const handleExploreMore = () => {
    // Scale button animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to tabs (replacing the current screen)
      router.replace("/(tabs)");
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#af1f23", "#d8373b"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Success Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <LinearGradient
            colors={["#27ae60", "#2ecc71"]}
            style={styles.successIconBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark" size={60} color="#ffffff" />
          </LinearGradient>
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Request Confirmed!</Text>
        <Text style={styles.successMessage}>
          Thank you for using our services! Our team will contact you soon to
          confirm your delivery details.
        </Text>

        {/* Booking ID if provided */}
        {params.bookingId && (
          <View style={styles.bookingIdContainer}>
            <Text style={styles.bookingIdLabel}>Booking Reference:</Text>
            <Text style={styles.bookingId}>{params.bookingId}</Text>
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Contact Info */}
        {/* <View style={styles.contactInfoContainer}>
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color="#af1f23" />
            <Text style={styles.contactText}>+971 12 345 6789</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color="#af1f23" />
            <Text style={styles.contactText}>support@yourapp.com</Text>
          </View>
        </View> */}
      </Animated.View>

      {/* Call to Action Button */}
      <Animated.View
        style={[styles.buttonContainer, { opacity: buttonFadeAnim }]}
      >
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={handleExploreMore}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#af1f23", "#d8373b"]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Explore More</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Confetti Animation */}
      <ConfettiCannon
        key={confettiKey}
        count={100}
        origin={{ x: width / 2, y: -10 }}
        autoStart={true}
        fadeOut={true}
        colors={["#af1f23", "#d8373b", "#f8d568", "#5cb3ff", "#ffffff"]}
        explosionSpeed={350}
        fallSpeed={2500}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  contentContainer: {
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  successIconContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  successIconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  bookingIdContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  bookingIdLabel: {
    fontSize: 14,
    color: "#777777",
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 18,
    fontWeight: "600",
    color: "#af1f23",
    letterSpacing: 0.5,
  },
  divider: {
    width: "90%",
    height: 1,
    backgroundColor: "#eeeeee",
    marginVertical: 20,
  },
  contactInfoContainer: {
    width: "100%",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: isIOS ? 50 : 30,
    width: "85%",
  },
  exploreButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#af1f23",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginRight: 8,
  },
});

export default BookingSuccessScreen;
