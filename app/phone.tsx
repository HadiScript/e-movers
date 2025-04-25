// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function PhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Focus input automatically after a short delay
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);

    // Cleanup
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleBack = () => {
    // Exit animation then navigate back
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  };

  const validatePhoneNumber = (phone) => {
    // Enhanced UAE phone validation
    const phoneRegex = /^((\+971|0)?5[0-9]{8})$/;

    // Clean phone number for validation (remove spaces, etc)
    const cleanPhone = phone.replace(/\s+/g, "");

    return phoneRegex.test(cleanPhone);
  };

  const formatPhoneInput = (text) => {
    // Remove any non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, "");

    // Auto-format with spaces for readability as user types
    // Format: XX XXX XXXX
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 5) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(
        5,
        9
      )}`;
    }
  };

  const handlePhoneChange = (text) => {
    const formattedPhone = formatPhoneInput(text);
    setPhoneNumber(formattedPhone);

    // Clear error when user starts typing again
    if (error) {
      setError("");
    }
  };

  const handleButtonPressIn = () => {
    setIsButtonPressed(true);
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    setIsButtonPressed(false);
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleContinue = () => {
    setError("");
    Keyboard.dismiss();

    // Clean phone number for validation
    const cleanedPhone = phoneNumber.replace(/\s+/g, "");

    if (!cleanedPhone) {
      setError("Please enter your phone number");
      shakeInput();
      return;
    }

    if (!validatePhoneNumber(cleanedPhone)) {
      setError("Please enter a valid UAE mobile number");
      shakeInput();
      return;
    }

    // Animate button press before API call
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Simulate API call to send OTP
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to OTP screen with the phone number
        router.push({
          pathname: "/otp",
          params: { phone: cleanedPhone },
        });
      }, 1500);
    });
  };

  // Animation for error shake
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const shakeInput = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(slideAnim, -1) }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="#af1f23" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Your Phone</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.instructionText}>
          We'll send a verification code to your phone number
        </Text>

        <Animated.View
          style={[
            styles.inputContainer,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          <View style={styles.countryCodeContainer}>
            <Text style={styles.countryCode}>+971</Text>
          </View>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="50 123 4567"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            maxLength={12} // Account for formatting spaces
            placeholderTextColor="#aaa"
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: error ? 1 : 0,
            transform: [{ translateY: error ? 0 : -10 }],
          }}
        >
          <Text style={styles.errorText}>
            {error ? (
              <Ionicons name="alert-circle" size={16} color="#af1f23" />
            ) : null}{" "}
            {error}
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ scale: buttonScaleAnim }],
            opacity: fadeAnim,
          }}
        >
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!phoneNumber || isLoading) && styles.disabledButton,
              isButtonPressed &&
                !isLoading &&
                phoneNumber &&
                styles.buttonPressed,
            ]}
            onPress={handleContinue}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            disabled={!phoneNumber || isLoading}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.continueButtonText}>CONTINUE</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#fff"
                  style={styles.buttonIcon}
                />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {!keyboardVisible && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.securityNote}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color="#888"
              />{" "}
              Your information is secure and will not be shared
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: isIOS ? 60 : StatusBar.currentHeight + 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(175, 31, 35, 0.08)",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 40,
    color: "#333",
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
    justifyContent: "flex-start",
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#af1f23",
    marginBottom: 20,
    paddingBottom: 8,
  },
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  countryCode: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    paddingHorizontal: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    paddingLeft: 12,
    paddingVertical: 8,
  },
  errorText: {
    color: "#af1f23",
    marginBottom: 20,
    fontSize: 14,
    alignItems: "center",
    flexDirection: "row",
    alignContent: "center",
  },
  continueButton: {
    backgroundColor: "#af1f23",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#af1f23",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    flexDirection: "row",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#d3a5a6",
    shadowOpacity: 0.1,
  },
  buttonPressed: {
    backgroundColor: "#941a1d",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  securityNote: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    marginTop: 40,
    opacity: 0.8,
  },
});
