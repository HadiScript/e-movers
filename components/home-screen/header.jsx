import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Logo from "./Logo";

const Header = ({ fadeAnim, slideAnim }) => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <Animated.View
        style={[
          styles.headerContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Logo fadeAnim={1} slideAnim={0} />

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 50 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileButton: {
    backgroundColor: "#af1f23",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default Header;
