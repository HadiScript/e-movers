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
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PhoneInput from "react-native-phone-number-input"; // Import phone input component
// import apiService from "../config/ApiServices";
import apiService from "@/config/ApiServices";

const { width, height } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

const ProfileScreen = () => {
  const router = useRouter();

  // Refs for animations and inputs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInput = useRef(null);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [currentFocus, setCurrentFocus] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
  });

  // Error handling state
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Shake animations for error fields
  const shakeAnimations = {
    name: useRef(new Animated.Value(0)).current,
    email: useRef(new Animated.Value(0)).current,
    phone: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    // Load user data
    loadUserData();

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
    ]).start();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
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

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const parsedData = JSON.parse(userData);
        setFormData({
          userId: parsedData.userId || "",
          name: parsedData.name || "",
          email: parsedData.email || "",
          phone: parsedData.phone || "",
        });
      } else {
        // No user data found, redirect to phone screen
        Alert.alert(
          "No User Information",
          "Please complete registration first.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/phone"),
            },
          ]
        );
        return;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", "Failed to load your profile information.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, revert to original data
      loadUserData();
    }

    setIsEditing(!isEditing);

    // If switching to edit mode, focus on name input
    if (!isEditing) {
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 300);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let hasError = false;

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
      shakeField("name");
      hasError = true;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
      shakeField("email");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      shakeField("email");
      hasError = true;
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = "Please enter your phone number";
      shakeField("phone");
      hasError = true;
    } else {
      // Simple validation for international phone numbers
      const digitsOnly = formData.phone.replace(/\D/g, "");
      if (digitsOnly.length < 7) {
        newErrors.phone = "Please enter a valid phone number";
        shakeField("phone");
        hasError = true;
      }
    }

    setErrors(newErrors);
    return !hasError;
  };

  const shakeField = (field) => {
    const animation = shakeAnimations[field];
    if (animation) {
      animation.setValue(0);
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleSave = async () => {
    // Validate the form first
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      // Call API to update user info
      const response = await apiService.registerUser(
        formData.name,
        formData.phone,
        formData.email
      );

      //   const response = await apiService.create(
      //     formData.userId,
      //     formData.name,
      //     formData.phone,
      //     formData.email
      //   );

      if (response.success) {
        const userData = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          userId: response.data._id, // Assuming the API returns a userId
        };
        // Update local storage with new data
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        // Show success message
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        // Exit edit mode
        setIsEditing(false);
      } else {
        Alert.alert(
          "Update Failed",
          response.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("API error:", error);
      Alert.alert(
        "Connection Error",
        "Unable to update your profile. Please check your connection and try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear specific error when user starts typing again
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const handleFocus = (field) => {
    setCurrentFocus(field);
  };

  const focusInput = (field) => {
    switch (field) {
      case "name":
        nameInputRef.current?.focus();
        break;
      case "email":
        emailInputRef.current?.focus();
        break;
      case "phone":
        phoneInput.current?.focus();
        break;
      default:
        break;
    }
  };

  // Function to handle click on input wrapper (ensure focus works on outer container)
  const handleWrapperPress = (fieldName) => {
    if (isEditing) {
      focusInput(fieldName);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#af1f23" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={["#af1f23", "#d8373b"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditToggle}
          activeOpacity={0.7}
          disabled={isSaving}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.profileContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={60} color="#af1f23" />
            </View>

            {isEditing && (
              <TouchableOpacity
                style={styles.changePhotoButton}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    "Coming Soon",
                    "Photo upload feature will be available soon."
                  )
                }
              >
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {/* User ID Display */}
          <View style={styles.userIdContainer}>
            <Text style={styles.userIdLabel}>User ID:</Text>
            <Text style={styles.userId}>{formData.userId}</Text>
          </View>

          {/* Success Message */}
          {successMessage ? (
            <View style={styles.successMessageContainer}>
              <Ionicons name="checkmark-circle" size={18} color="#27ae60" />
              <Text style={styles.successMessageText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            {/* Name Field */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <TouchableOpacity
              onPress={() => handleWrapperPress("name")}
              activeOpacity={isEditing ? 0.7 : 1}
              disabled={!isEditing}
            >
              <Animated.View
                style={[
                  styles.inputWrapper,
                  !isEditing && styles.disabledInput,
                  currentFocus === "name" && styles.focusedInput,
                  errors.name && styles.errorInput,
                  { transform: [{ translateX: shakeAnimations.name }] },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={currentFocus === "name" ? "#af1f23" : "#999"}
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={nameInputRef}
                  style={[styles.input, !isEditing && styles.disabledInputText]}
                  value={formData.name}
                  onChangeText={(text) => handleChange("name", text)}
                  onFocus={() => handleFocus("name")}
                  onBlur={() => setCurrentFocus(null)}
                  placeholder="Enter your name"
                  placeholderTextColor="#aaa"
                  editable={isEditing}
                  returnKeyType="next"
                  onSubmitEditing={() => focusInput("email")}
                  autoCapitalize="words"
                />
              </Animated.View>
            </TouchableOpacity>
            {errors.name && (
              <Text style={styles.errorText}>
                <Ionicons name="alert-circle" size={16} color="#af1f23" />{" "}
                {errors.name}
              </Text>
            )}

            {/* Email Field */}
            <Text style={styles.inputLabel}>Email Address</Text>
            <TouchableOpacity
              onPress={() => handleWrapperPress("email")}
              activeOpacity={isEditing ? 0.7 : 1}
              disabled={!isEditing}
            >
              <Animated.View
                style={[
                  styles.inputWrapper,
                  !isEditing && styles.disabledInput,
                  currentFocus === "email" && styles.focusedInput,
                  errors.email && styles.errorInput,
                  { transform: [{ translateX: shakeAnimations.email }] },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={currentFocus === "email" ? "#af1f23" : "#999"}
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={emailInputRef}
                  style={[styles.input, !isEditing && styles.disabledInputText]}
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => setCurrentFocus(null)}
                  placeholder="Enter your email"
                  placeholderTextColor="#aaa"
                  editable={isEditing}
                  returnKeyType="next"
                  onSubmitEditing={() => focusInput("phone")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Animated.View>
            </TouchableOpacity>
            {errors.email && (
              <Text style={styles.errorText}>
                <Ionicons name="alert-circle" size={16} color="#af1f23" />{" "}
                {errors.email}
              </Text>
            )}

            {/* Phone Field */}
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TouchableOpacity
              onPress={() => handleWrapperPress("phone")}
              activeOpacity={isEditing ? 0.7 : 1}
              disabled={!isEditing}
            >
              <Animated.View
                style={[
                  styles.inputWrapper,
                  !isEditing && styles.disabledInput,
                  currentFocus === "phone" && styles.focusedInput,
                  errors.phone && styles.errorInput,
                  { transform: [{ translateX: shakeAnimations.phone }] },
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={currentFocus === "phone" ? "#af1f23" : "#999"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, !isEditing && styles.disabledInputText]}
                  value={formData.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                  onFocus={() => handleFocus("phone")}
                  onBlur={() => setCurrentFocus(null)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#aaa"
                  editable={isEditing}
                  returnKeyType="done"
                  keyboardType="phone-pad"
                />
              </Animated.View>
            </TouchableOpacity>
            {errors.phone && (
              <Text style={styles.errorText}>
                <Ionicons name="alert-circle" size={16} color="#af1f23" />{" "}
                {errors.phone}
              </Text>
            )}
          </View>

          {/* Save Button (only visible in edit mode) */}
          {isEditing && (
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isSaving ? ["#bbbbbb", "#999999"] : ["#af1f23", "#d8373b"]
                }
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isSaving ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                    <Ionicons name="checkmark" size={20} color="#ffffff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* App Info */}
          {/* <View style={styles.appInfoContainer}>
            <Text style={styles.appVersion}>App Version: 1.0.0</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Terms & Privacy",
                  "View our terms of service and privacy policy."
                )
              }
            >
              <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
            </TouchableOpacity>
          </View> */}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    // paddingTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 45 : 50,
    paddingBottom: 16,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  editButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 0,
    right: width / 2 - 50,
    backgroundColor: "#af1f23",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  userIdContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  userIdLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  userId: {
    fontSize: 14,
    fontWeight: "500",
    color: "#af1f23",
  },
  successMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(39, 174, 96, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  successMessageText: {
    color: "#27ae60",
    fontSize: 14,
    marginLeft: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 12,
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
  },
  focusedInput: {
    borderColor: "#af1f23",
    shadowColor: "#af1f23",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  errorInput: {
    borderColor: "#e74c3c",
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    height: "100%",
  },
  disabledInputText: {
    color: "#777",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 13,
    marginTop: -8,
    marginBottom: 12,
  },
  saveButton: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 30,
    shadowColor: "#af1f23",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  accountSection: {
    marginBottom: 24,
  },
  accountOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  accountOptionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(175, 31, 35, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accountOptionText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  dangerOption: {
    borderWidth: 1,
    borderColor: "rgba(231, 76, 60, 0.2)",
  },
  dangerIcon: {
    backgroundColor: "#e74c3c",
  },
  dangerOptionText: {
    flex: 1,
    fontSize: 15,
    color: "#e74c3c",
    fontWeight: "500",
  },
  appInfoContainer: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  appVersion: {
    fontSize: 13,
    color: "#999",
    marginBottom: 8,
  },
  termsLink: {
    fontSize: 13,
    color: "#af1f23",
    textDecorationLine: "underline",
  },
});

export default ProfileScreen;
