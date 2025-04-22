// @ts-nocheck
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo/vector-icons if not already installed

const BookingBtn = ({ onBook }) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: animatedValue }],
  };

  return (
    <View style={styles.buttonContainer}>
      <Animated.View style={[styles.buttonWrapper, animatedStyle]}>
        <TouchableOpacity
          style={styles.button}
          onPress={onBook}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="calendar"
              size={22}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Book Your Slot</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 999,
  },
  buttonWrapper: {
    borderRadius: 15,
    shadowColor: "#af1f23",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    backgroundColor: "#af1f23",
    paddingVertical: 16,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  arrowContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BookingBtn;
