//@ts-nocheck

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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// OTP Input Box component
const OtpInput = ({ maxLength, onCodeChanged }) => {
  const [code, setCode] = useState("");
  const inputRef = useRef(null);
  const animatedValues = useRef(
    [...Array(maxLength)].map(() => new Animated.Value(0))
  ).current;
  const scaleValues = useRef(
    [...Array(maxLength)].map(() => new Animated.Value(1))
  ).current;

  // Shake animation for error
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const handleOnPress = () => {
    inputRef.current.focus();
  };

  const handleOnChange = (text) => {
    // Allow only digits
    const formattedText = text.replace(/[^0-9]/g, "");
    const previousLength = code.length;

    if (formattedText.length <= maxLength) {
      setCode(formattedText);
      onCodeChanged(formattedText);

      // Animate the digit that was just added
      if (formattedText.length > previousLength && formattedText.length > 0) {
        // Animate filling in the box
        Animated.spring(animatedValues[formattedText.length - 1], {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }).start();

        // Animate the "pop" effect
        Animated.sequence([
          Animated.timing(scaleValues[formattedText.length - 1], {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValues[formattedText.length - 1], {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }

      // When deleting, reset the animation value for the removed digit
      if (formattedText.length < previousLength) {
        for (let i = formattedText.length; i < maxLength; i++) {
          animatedValues[i].setValue(0);
          scaleValues[i].setValue(1);
        }
      }
    }
  };

  const shake = () => {
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

  // Expose shake method to parent component
  React.useImperativeHandle(React.createRef(), () => ({
    shake,
  }));

  // Create an array to render the animated placeholders
  const digits = new Array(maxLength).fill(0).map((_, index) => {
    const filled = index < code.length;
    const digit = filled ? code[index] : "";

    const backgroundColorInterpolation = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(255, 255, 255, 1)", "rgba(250, 240, 240, 1)"],
    });

    const borderColorInterpolation = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: ["#ccc", "#af1f23"],
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.digitBox,
          {
            backgroundColor: backgroundColorInterpolation,
            borderColor: borderColorInterpolation,
            transform: [{ scale: scaleValues[index] }],
          },
        ]}
      >
        <Text style={[styles.digit, filled && styles.digitFilled]}>
          {digit}
        </Text>
      </Animated.View>
    );
  });

  return (
    <View style={styles.otpContainer}>
      <Animated.View
        style={[
          styles.otpInputContainer,
          { transform: [{ translateX: shakeAnimation }] },
        ]}
      >
        <TouchableOpacity
          style={styles.otpTouchable}
          onPress={handleOnPress}
          activeOpacity={1}
        >
          {digits}
        </TouchableOpacity>
      </Animated.View>
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleOnChange}
        keyboardType="number-pad"
        maxLength={maxLength}
        style={styles.hiddenInput}
        autoFocus
      />
    </View>
  );
};

export default function OtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [error, setError] = useState("");
  const otpInputRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  // Circle progress animation for timer
  const timerAnimation = useRef(new Animated.Value(0)).current;

  // Timer for OTP resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      // Animate timer progress
      Animated.timing(timerAnimation, {
        toValue: (60 - timeLeft) / 60,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

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

  const handleVerifyOtp = () => {
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit code");
      if (otpInputRef.current && otpInputRef.current.shake) {
        otpInputRef.current.shake();
      }
      return;
    }

    setError("");
    Keyboard.dismiss();

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
      setIsLoading(true);

      // Mock OTP verification
      setTimeout(() => {
        setIsLoading(false);

        // Navigate to main app after successful verification
        router.replace("/(tabs)");
      }, 1500);
    });
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    // Reset timer and resend status
    setTimeLeft(60);
    setCanResend(false);
    timerAnimation.setValue(0);

    // Mock resending OTP with animation
    Animated.sequence([
      Animated.timing(timerAnimation, {
        toValue: 0.1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(timerAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    // Show feedback
    setError("A new code has been sent to your phone");
    setTimeout(() => setError(""), 3000);
  };

  const formatPhoneNumber = (phoneInput) => {
    // Enhanced formatting with consistent display
    if (typeof phoneInput === "string") {
      const cleanNum = phoneInput.replace(/\D/g, "");
      if (cleanNum.startsWith("971")) {
        return `+${cleanNum.slice(0, 3)} ${cleanNum.slice(
          3,
          5
        )} ${cleanNum.slice(5, 8)} ${cleanNum.slice(8)}`;
      } else if (cleanNum.startsWith("0")) {
        return `+971 ${cleanNum.slice(1, 3)} ${cleanNum.slice(
          3,
          6
        )} ${cleanNum.slice(6)}`;
      } else if (cleanNum.startsWith("5")) {
        return `+971 ${cleanNum.slice(0, 2)} ${cleanNum.slice(
          2,
          5
        )} ${cleanNum.slice(5)}`;
      }
      return phoneInput;
    }
    return phoneInput || "";
  };

  const renderTimer = () => {
    return (
      <View style={styles.timerContainer}>
        <Animated.View
          style={[
            styles.timerProgress,
            {
              width: timerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>
    );
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
        <Text style={styles.headerTitle}>Verify Your Number</Text>
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
          Enter the 4-digit code sent to
        </Text>

        <View style={styles.phoneContainer}>
          <Ionicons
            name="phone-portrait-outline"
            size={18}
            color="#666"
            style={styles.phoneIcon}
          />
          <Text style={styles.phoneNumberText}>{formatPhoneNumber(phone)}</Text>
        </View>

        <OtpInput
          ref={otpInputRef}
          maxLength={4}
          onCodeChanged={(code) => {
            setOtp(code);
            if (error) setError("");
          }}
        />

        <Animated.View
          style={{
            opacity: error ? 1 : 0,
            transform: [{ translateY: error ? 0 : -10 }],
            height: error ? "auto" : 0,
          }}
        >
          <Text
            style={[
              styles.errorText,
              error.includes("new code") && styles.successText,
            ]}
          >
            {error.includes("new code") ? (
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            ) : error ? (
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
              styles.verifyButton,
              (otp.length !== 4 || isLoading) && styles.disabledButton,
              isButtonPressed &&
                !isLoading &&
                otp.length === 4 &&
                styles.buttonPressed,
            ]}
            onPress={handleVerifyOtp}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            disabled={otp.length !== 4 || isLoading}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.verifyButtonText}>VERIFY</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#fff"
                  style={styles.buttonIcon}
                />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>

          {!canResend ? (
            <View style={styles.waitContainer}>
              <Text style={styles.waitText}>Wait </Text>
              {renderTimer()}
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={!canResend}
              style={styles.resendButtonContainer}
            >
              <Text style={styles.resendButton}>
                <Ionicons name="refresh-outline" size={14} /> Resend Code
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!keyboardVisible && (
          <Animated.View style={{ opacity: fadeAnim, marginTop: 30 }}>
            <View style={styles.securityContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#888"
              />
              <Text style={styles.securityText}>
                Your information is secure and protected
              </Text>
            </View>
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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "#f9f9f9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  phoneIcon: {
    marginRight: 8,
  },
  phoneNumberText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  otpContainer: {
    marginVertical: 20,
    alignItems: "center",
    width: "100%",
  },
  otpInputContainer: {
    width: "100%",
    alignItems: "center",
  },
  otpTouchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width > 380 ? 280 : 240,
  },
  digitBox: {
    height: 60,
    width: width > 380 ? 60 : 50,
    borderWidth: 1.5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  digit: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  digitFilled: {
    color: "#af1f23",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorText: {
    color: "#af1f23",
    marginVertical: 15,
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
  },
  successText: {
    color: "#4CAF50",
  },
  verifyButton: {
    backgroundColor: "#af1f23",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
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
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  resendContainer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  resendText: {
    color: "#666",
    fontSize: 14,
  },
  waitContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  waitText: {
    color: "#666",
    fontSize: 14,
  },
  timerContainer: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  timerProgress: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    backgroundColor: "rgba(175, 31, 35, 0.2)",
  },
  timerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    zIndex: 1,
  },
  resendButtonContainer: {
    backgroundColor: "rgba(175, 31, 35, 0.08)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginLeft: 4,
  },
  resendButton: {
    color: "#af1f23",
    fontSize: 14,
    fontWeight: "600",
  },
  resendButtonDisabled: {
    color: "#999",
  },
  securityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  securityText: {
    color: "#666",
    fontSize: 13,
    marginLeft: 8,
  },
});
