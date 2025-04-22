// @ts-nocheck
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Linking,
} from "react-native";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const Contact = () => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnims = useRef([
    new Animated.Value(0.8),
    new Animated.Value(0.8),
  ]).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Button staggered animations
    buttonScaleAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: index * 200,
        useNativeDriver: true,
      }).start();
    });

    // Continuous pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  const handlePhonePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Replace with actual phone number
    Linking.openURL("tel:+971501234567");
  };

  const handleWhatsAppPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Replace with actual WhatsApp number
    const whatsappUrl =
      "whatsapp://send?phone=971501234567&text=Hello! I need help with moving services.";
    Linking.openURL(whatsappUrl).catch(() => {
      alert("WhatsApp is not installed on your device");
    });
  };

  const animateButtonPress = (index, callback) => {
    Animated.sequence([
      Animated.timing(buttonScaleAnims[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => callback && callback());
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={["#fafafa", "#f5f5f5", "#f0f0f0"]}
        style={styles.gradientBackground}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="help-circle" size={32} color="#af1f23" />
          </View>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <Text style={styles.contactSubtitle}>
            We're here to assist you 24/7
          </Text>
        </View>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Phone Button */}
          <Animated.View
            style={[
              styles.buttonWrapper,
              {
                transform: [
                  { scale: buttonScaleAnims[0] },
                  { scale: pulseAnim },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => animateButtonPress(0, handlePhonePress)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#af1f23", "#c52d31"]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.buttonContent}>
                  <View style={styles.iconCircle}>
                    <FontAwesome5 name="phone-alt" size={18} color="#fff" />
                  </View>
                  <View style={styles.buttonTextContainer}>
                    <Text style={styles.buttonTitle}>Call Us</Text>
                    <Text style={styles.buttonSubtitle}>24/7 Support</Text>
                  </View>
                  <FontAwesome5 name="arrow-right" size={16} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* WhatsApp Button */}
          <Animated.View
            style={[
              styles.buttonWrapper,
              {
                transform: [{ scale: buttonScaleAnims[1] }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => animateButtonPress(1, handleWhatsAppPress)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#25D366", "#128C7E"]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.buttonContent}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                  >
                    <FontAwesome5 name="whatsapp" size={20} color="#fff" />
                  </View>
                  <View style={styles.buttonTextContainer}>
                    <Text style={styles.buttonTitle}>WhatsApp</Text>
                    <Text style={styles.buttonSubtitle}>Quick Response</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="message-processing"
                    size={16}
                    color="#fff"
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Additional Contact Info */}
        <View style={styles.additionalInfo}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#666"
            />
            <Text style={styles.infoText}>Available 24/7</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color="#666"
            />
            <Text style={styles.infoText}>Dubai, UAE</Text>
          </View>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  gradientBackground: {
    padding: 25,
    position: "relative",
    overflow: "hidden",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 25,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(175, 31, 35, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  contactSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  buttonsContainer: {
    gap: 15,
  },
  buttonWrapper: {
    marginBottom: 15,
  },
  mainButton: {
    borderRadius: 15,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  gradientButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  buttonTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 2,
  },
  additionalInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  infoDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#ddd",
    marginHorizontal: 20,
  },
  decorativeCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(175, 31, 35, 0.05)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(37, 211, 102, 0.05)",
  },
});

export default Contact;
