// //@ts-nocheck
// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Platform,
//   KeyboardAvoidingView,
//   Modal,
//   Animated,
//   ActivityIndicator,
//   Keyboard,
//   Dimensions,
//   TouchableWithoutFeedback,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";

// const ServiceForm = () => {
//   const router = useRouter();
//   const scrollViewRef = useRef(null);
//   // Refs for text inputs to enable direct focus
//   const nameInputRef = useRef(null);
//   const emailInputRef = useRef(null);
//   const phoneInputRef = useRef(null);
//   const pickupLocationInputRef = useRef(null);
//   const dropLocationInputRef = useRef(null);
//   const messageInputRef = useRef(null);

//   const [keyboardHeight, setKeyboardHeight] = useState(0);
//   const [keyboardVisible, setKeyboardVisible] = useState(false);

//   // Animation values
//   const fadeAnim = useState(new Animated.Value(0))[0];
//   const slideAnim = useState(new Animated.Value(50))[0];

//   useEffect(() => {
//     // Animation
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Keyboard listeners
//     const keyboardWillShowListener = Keyboard.addListener(
//       Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
//       (e) => {
//         setKeyboardVisible(true);
//         setKeyboardHeight(e.endCoordinates.height);
//       }
//     );

//     const keyboardWillHideListener = Keyboard.addListener(
//       Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
//       () => {
//         setKeyboardVisible(false);
//         setKeyboardHeight(0);
//       }
//     );

//     // Cleanup listeners on unmount
//     return () => {
//       keyboardWillShowListener.remove();
//       keyboardWillHideListener.remove();
//     };
//   }, []);

//   // Form state
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     pickupLocation: "",
//     dropLocation: "",
//     message: "",
//     service: "",
//   });

//   // Validation state
//   const [errors, setErrors] = useState({});

//   // Success state
//   const [showSuccess, setShowSuccess] = useState(false);

//   // UI States
//   const [showServiceModal, setShowServiceModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentFocus, setCurrentFocus] = useState(null);

//   // Dummy service data
//   const services = [
//     {
//       id: 1,
//       name: "Premium Delivery",
//       icon: "rocket",
//       description: "Fast and secure delivery within 24 hours",
//     },
//     {
//       id: 2,
//       name: "Standard Delivery",
//       icon: "truck",
//       description: "Regular delivery within 2-3 business days",
//     },
//     {
//       id: 3,
//       name: "Economy Delivery",
//       icon: "package",
//       description: "Budget-friendly option with 3-5 day delivery",
//     },
//     {
//       id: 4,
//       name: "International Shipping",
//       icon: "globe",
//       description: "Worldwide shipping with customs handling",
//     },
//   ];

//   const validateForm = () => {
//     let tempErrors = {};
//     if (!formData.name) tempErrors.name = "Name is required";
//     if (!formData.email) {
//       tempErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       tempErrors.email = "Email is invalid";
//     }
//     if (!formData.phone) tempErrors.phone = "Phone is required";
//     if (!formData.pickupLocation)
//       tempErrors.pickupLocation = "Pickup location is required";
//     if (!formData.dropLocation)
//       tempErrors.dropLocation = "Drop location is required";
//     if (!formData.service) tempErrors.service = "Please select a service";

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     // Only dismiss keyboard after validation to prevent unnecessary hide/show
//     if (validateForm()) {
//       Keyboard.dismiss();
//       setIsSubmitting(true);

//       // Simulate API call
//       setTimeout(() => {
//         console.log("Form submitted:", formData);
//         setIsSubmitting(false);
//         setShowSuccess(true);

//         // Hide success message after 3 seconds
//         setTimeout(() => {
//           setShowSuccess(false);

//           // Reset form
//           setFormData({
//             name: "",
//             email: "",
//             phone: "",
//             pickupLocation: "",
//             dropLocation: "",
//             message: "",
//             service: "",
//           });
//         }, 3000);
//       }, 1500);
//     } else {
//       console.log("Form validation failed");
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData({
//       ...formData,
//       [field]: value,
//     });

//     // Clear error when user types
//     if (errors[field]) {
//       setErrors({
//         ...errors,
//         [field]: null,
//       });
//     }
//   };

//   const selectService = (service) => {
//     handleChange("service", service.id);
//     setShowServiceModal(false);
//   };

//   // Direct focus function to explicitly focus on a specific input
//   const focusInput = (fieldName) => {
//     // Map field names to refs
//     const refMap = {
//       name: nameInputRef,
//       email: emailInputRef,
//       phone: phoneInputRef,
//       pickupLocation: pickupLocationInputRef,
//       dropLocation: dropLocationInputRef,
//       message: messageInputRef,
//     };

//     // Focus the input using its ref
//     if (refMap[fieldName]?.current) {
//       refMap[fieldName].current.focus();
//     }

//     handleFocus(fieldName);
//   };

//   const handleFocus = (fieldName) => {
//     setCurrentFocus(fieldName);

//     // Use requestAnimationFrame to ensure smoother scrolling with keyboard
//     requestAnimationFrame(() => {
//       if (scrollViewRef.current) {
//         const yOffset = getScrollPosition(fieldName);
//         scrollViewRef.current.scrollTo({
//           y: yOffset,
//           animated: true,
//         });
//       }
//     });
//   };

//   const getScrollPosition = (fieldName) => {
//     // Adjust positions based on whether keyboard is visible
//     const basePositions = {
//       name: 0,
//       email: 80,
//       phone: 80,
//       pickupLocation: 180,
//       dropLocation: 250,
//       service: 350,
//       message: 450,
//     };

//     // Add extra offset when keyboard is visible for lower fields
//     const keyboardOffset = keyboardVisible
//       ? fieldName === "message"
//         ? 100
//         : fieldName === "dropLocation"
//         ? 80
//         : fieldName === "pickupLocation"
//         ? 60
//         : 0
//       : 0;

//     return (basePositions[fieldName] || 0) + keyboardOffset;
//   };

//   // Get icon for each field
//   const getFieldIcon = (field) => {
//     const color = currentFocus === field ? "#af1f23" : "#aaa";

//     switch (field) {
//       case "name":
//         return <Ionicons name="person-outline" size={22} color={color} />;
//       case "email":
//         return <Ionicons name="mail-outline" size={22} color={color} />;
//       case "phone":
//         return <Ionicons name="call-outline" size={22} color={color} />;
//       case "pickupLocation":
//         return <Ionicons name="location-outline" size={22} color={color} />;
//       case "dropLocation":
//         return <MaterialIcons name="location-on" size={22} color={color} />;
//       case "message":
//         return <Ionicons name="chatbox-outline" size={22} color={color} />;
//       case "service":
//         return <Ionicons name="list-outline" size={22} color={color} />;
//       default:
//         return null;
//     }
//   };

//   // Get icon for service
//   const getServiceIcon = (iconName) => {
//     switch (iconName) {
//       case "rocket":
//         return <Ionicons name="rocket" size={20} color="#fff" />;
//       case "truck":
//         return <Ionicons name="car" size={20} color="#fff" />;
//       case "package":
//         return <Ionicons name="cube-outline" size={20} color="#fff" />;
//       case "globe":
//         return <Ionicons name="globe-outline" size={20} color="#fff" />;
//       default:
//         return <Ionicons name="apps" size={20} color="#fff" />;
//     }
//   };

//   // Handle service modal open - don't dismiss keyboard if already focused
//   const handleServicePress = () => {
//     // If keyboard is visible, store current focus before showing modal
//     const wasFocused = keyboardVisible;
//     if (wasFocused) {
//       // Set a flag to return focus after modal closes
//       setReturnFocusAfterModal(currentFocus);
//     }
//     setShowServiceModal(true);
//   };

//   const [returnFocusAfterModal, setReturnFocusAfterModal] = useState(null);

//   // Handle modal close - restore focus if needed
//   const handleModalClose = () => {
//     setShowServiceModal(false);

//     // If we had a field focused before, return focus to it
//     if (returnFocusAfterModal) {
//       // Use small timeout to ensure modal is fully closed
//       setTimeout(() => {
//         setCurrentFocus(returnFocusAfterModal);
//         focusInput(returnFocusAfterModal);
//         setReturnFocusAfterModal(null);
//       }, 300);
//     }
//   };

//   // Function to handle click on input wrapper (ensure focus works on outer container)
//   const handleWrapperPress = (fieldName) => {
//     focusInput(fieldName);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "padding"} // Use padding for both platforms
//       keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 40} // Adjusted for Android
//       enabled={true}
//     >
//       <StatusBar style="light" backgroundColor="#af1f23" />

//       {/* Header with back button */}
//       <LinearGradient
//         colors={["#af1f23", "#d8373b"]}
//         style={styles.header}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//           activeOpacity={0.7}
//         >
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Request Service</Text>
//         <View style={styles.rightHeaderSpace} />
//       </LinearGradient>

//       {/* Main Form */}
//       <View style={styles.formWrapper}>
//         <ScrollView
//           ref={scrollViewRef}
//           contentContainerStyle={styles.scrollContainer}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="always" // Changed to always to ensure focus isn't lost
//           bounces={false}
//         >
//           <Animated.View
//             style={[
//               styles.formContainer,
//               { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
//             ]}
//           >
//             <View style={styles.formHeader}>
//               <LinearGradient
//                 colors={["#af1f23", "#d8373b"]}
//                 style={styles.iconCircle}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <Ionicons name="car" size={28} color="#fff" />
//               </LinearGradient>
//               <Text style={styles.formTitle}>Delivery Details</Text>
//               <Text style={styles.formSubtitle}>
//                 Please fill in your information below
//               </Text>
//             </View>

//             {/* Name Field */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Full Name</Text>
//               <TouchableWithoutFeedback
//                 onPress={() => handleWrapperPress("name")}
//               >
//                 <View
//                   style={[
//                     styles.inputWrapper,
//                     currentFocus === "name" && styles.focusedInput,
//                     errors.name && styles.errorInput,
//                   ]}
//                 >
//                   {getFieldIcon("name")}
//                   <TextInput
//                     ref={nameInputRef}
//                     style={styles.input}
//                     placeholder="Enter your name"
//                     placeholderTextColor="#aaa"
//                     value={formData.name}
//                     onChangeText={(text) => handleChange("name", text)}
//                     onFocus={() => handleFocus("name")}
//                     onBlur={() => setCurrentFocus(null)}
//                     autoCapitalize="words"
//                     returnKeyType="next"
//                     blurOnSubmit={false}
//                     autoFocus={true} // Add autoFocus to first field
//                     onSubmitEditing={() => focusInput("email")}
//                   />
//                 </View>
//               </TouchableWithoutFeedback>
//               {errors.name && (
//                 <Text style={styles.errorText}>{errors.name}</Text>
//               )}
//             </View>

//             {/* Contact Info Row */}
//             <View style={styles.rowContainer}>
//               {/* Email Field */}
//               <View
//                 style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}
//               >
//                 <Text style={styles.inputLabel}>Email</Text>
//                 <TouchableWithoutFeedback
//                   onPress={() => handleWrapperPress("email")}
//                 >
//                   <View
//                     style={[
//                       styles.inputWrapper,
//                       currentFocus === "email" && styles.focusedInput,
//                       errors.email && styles.errorInput,
//                     ]}
//                   >
//                     {getFieldIcon("email")}
//                     <TextInput
//                       ref={emailInputRef}
//                       style={styles.input}
//                       placeholder="Email address"
//                       placeholderTextColor="#aaa"
//                       value={formData.email}
//                       onChangeText={(text) => handleChange("email", text)}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                       onFocus={() => handleFocus("email")}
//                       onBlur={() => setCurrentFocus(null)}
//                       returnKeyType="next"
//                       blurOnSubmit={false}
//                       onSubmitEditing={() => focusInput("phone")}
//                     />
//                   </View>
//                 </TouchableWithoutFeedback>
//                 {errors.email && (
//                   <Text style={styles.errorText}>{errors.email}</Text>
//                 )}
//               </View>

//               {/* Phone Field */}
//               <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
//                 <Text style={styles.inputLabel}>Phone</Text>
//                 <TouchableWithoutFeedback
//                   onPress={() => handleWrapperPress("phone")}
//                 >
//                   <View
//                     style={[
//                       styles.inputWrapper,
//                       currentFocus === "phone" && styles.focusedInput,
//                       errors.phone && styles.errorInput,
//                     ]}
//                   >
//                     {getFieldIcon("phone")}
//                     <TextInput
//                       ref={phoneInputRef}
//                       style={styles.input}
//                       placeholder="Phone number"
//                       placeholderTextColor="#aaa"
//                       value={formData.phone}
//                       onChangeText={(text) => handleChange("phone", text)}
//                       keyboardType="phone-pad"
//                       onFocus={() => handleFocus("phone")}
//                       onBlur={() => setCurrentFocus(null)}
//                       returnKeyType="next"
//                       blurOnSubmit={false}
//                       onSubmitEditing={() => focusInput("pickupLocation")}
//                     />
//                   </View>
//                 </TouchableWithoutFeedback>
//                 {errors.phone && (
//                   <Text style={styles.errorText}>{errors.phone}</Text>
//                 )}
//               </View>
//             </View>

//             {/* Locations Section */}
//             <View style={styles.sectionDivider}>
//               <View style={styles.dividerLine} />
//               <View style={styles.sectionHeader}>
//                 <Ionicons name="location" size={16} color="#fff" />
//               </View>
//               <View style={styles.dividerLine} />
//             </View>
//             <Text style={styles.sectionTitle}>Pickup & Delivery Locations</Text>

//             {/* Pick up location Field */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Pickup Location</Text>
//               <TouchableWithoutFeedback
//                 onPress={() => handleWrapperPress("pickupLocation")}
//               >
//                 <View
//                   style={[
//                     styles.inputWrapper,
//                     currentFocus === "pickupLocation" && styles.focusedInput,
//                     errors.pickupLocation && styles.errorInput,
//                   ]}
//                 >
//                   {getFieldIcon("pickupLocation")}
//                   <TextInput
//                     ref={pickupLocationInputRef}
//                     style={styles.input}
//                     placeholder="Enter pickup address"
//                     placeholderTextColor="#aaa"
//                     value={formData.pickupLocation}
//                     onChangeText={(text) =>
//                       handleChange("pickupLocation", text)
//                     }
//                     onFocus={() => handleFocus("pickupLocation")}
//                     onBlur={() => setCurrentFocus(null)}
//                     returnKeyType="next"
//                     blurOnSubmit={false}
//                     onSubmitEditing={() => focusInput("dropLocation")}
//                   />
//                 </View>
//               </TouchableWithoutFeedback>
//               {errors.pickupLocation && (
//                 <Text style={styles.errorText}>{errors.pickupLocation}</Text>
//               )}
//             </View>

//             {/* Drop Location Field */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Drop-off Location</Text>
//               <TouchableWithoutFeedback
//                 onPress={() => handleWrapperPress("dropLocation")}
//               >
//                 <View
//                   style={[
//                     styles.inputWrapper,
//                     currentFocus === "dropLocation" && styles.focusedInput,
//                     errors.dropLocation && styles.errorInput,
//                   ]}
//                 >
//                   {getFieldIcon("dropLocation")}
//                   <TextInput
//                     ref={dropLocationInputRef}
//                     style={styles.input}
//                     placeholder="Enter delivery address"
//                     placeholderTextColor="#aaa"
//                     value={formData.dropLocation}
//                     onChangeText={(text) => handleChange("dropLocation", text)}
//                     onFocus={() => handleFocus("dropLocation")}
//                     onBlur={() => setCurrentFocus(null)}
//                     returnKeyType="next"
//                     blurOnSubmit={false}
//                   />
//                 </View>
//               </TouchableWithoutFeedback>
//               {errors.dropLocation && (
//                 <Text style={styles.errorText}>{errors.dropLocation}</Text>
//               )}
//             </View>

//             {/* Service Section */}
//             <View style={styles.sectionDivider}>
//               <View style={styles.dividerLine} />
//               <View style={styles.sectionHeader}>
//                 <Ionicons name="settings-outline" size={16} color="#fff" />
//               </View>
//               <View style={styles.dividerLine} />
//             </View>
//             <Text style={styles.sectionTitle}>Service Details</Text>

//             {/* Service Selection */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Select Service Type</Text>
//               <TouchableOpacity
//                 style={[
//                   styles.serviceSelector,
//                   errors.service && styles.errorInput,
//                 ]}
//                 onPress={handleServicePress}
//                 activeOpacity={0.7}
//               >
//                 <View style={styles.serviceSelectorContent}>
//                   {getFieldIcon("service")}
//                   <Text
//                     style={[
//                       styles.serviceSelectorText,
//                       !formData.service && styles.placeholderText,
//                     ]}
//                   >
//                     {formData.service
//                       ? services.find((s) => s.id === formData.service)?.name
//                       : "Select a Service"}
//                   </Text>
//                 </View>
//                 <View style={styles.chevronContainer}>
//                   <AntDesign name="down" size={16} color="#777" />
//                 </View>
//               </TouchableOpacity>
//               {errors.service && (
//                 <Text style={styles.errorText}>{errors.service}</Text>
//               )}
//             </View>

//             {/* Message Field */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>
//                 Special Instructions (Optional)
//               </Text>
//               <TouchableWithoutFeedback
//                 onPress={() => handleWrapperPress("message")}
//               >
//                 <View
//                   style={[
//                     styles.messageWrapper,
//                     currentFocus === "message" && styles.focusedInput,
//                   ]}
//                 >
//                   <View style={styles.messageIconContainer}>
//                     {getFieldIcon("message")}
//                   </View>
//                   <TextInput
//                     ref={messageInputRef}
//                     style={styles.messageInput}
//                     placeholder="Add any special requirements or notes"
//                     placeholderTextColor="#aaa"
//                     value={formData.message}
//                     onChangeText={(text) => handleChange("message", text)}
//                     multiline={true}
//                     numberOfLines={4}
//                     textAlignVertical="top"
//                     onFocus={() => handleFocus("message")}
//                     onBlur={() => setCurrentFocus(null)}
//                     returnKeyType="done"
//                   />
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>

//             {/* Submit Button */}
//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 isSubmitting && styles.disabledButton,
//               ]}
//               onPress={handleSubmit}
//               disabled={isSubmitting}
//               activeOpacity={0.8}
//             >
//               <LinearGradient
//                 colors={
//                   isSubmitting ? ["#bbbbbb", "#999999"] : ["#af1f23", "#d8373b"]
//                 }
//                 style={styles.gradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 {isSubmitting ? (
//                   <ActivityIndicator color="#ffffff" size="small" />
//                 ) : (
//                   <>
//                     <Text style={styles.submitButtonText}>Submit Request</Text>
//                     <Ionicons name="arrow-forward" size={20} color="#ffffff" />
//                   </>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>

//             {/* Success message */}
//             {showSuccess && (
//               <Animated.View style={styles.successContainer}>
//                 <View style={styles.successIcon}>
//                   <AntDesign name="checkcircle" size={24} color="#27ae60" />
//                 </View>
//                 <Text style={styles.successText}>
//                   Your request has been submitted successfully!
//                 </Text>
//               </Animated.View>
//             )}

//             {/* Padding for keyboard */}
//             <View style={{ height: keyboardVisible ? keyboardHeight : 20 }} />
//           </Animated.View>
//         </ScrollView>
//       </View>

//       {/* Service Selection Modal */}
//       <Modal
//         visible={showServiceModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={handleModalClose}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select a Service</Text>
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={handleModalClose}
//               >
//                 <Ionicons name="close" size={24} color="#333" />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.modalDivider} />

//             <ScrollView
//               style={styles.serviceList}
//               showsVerticalScrollIndicator={false}
//             >
//               {services.map((service) => (
//                 <TouchableOpacity
//                   key={service.id}
//                   style={styles.serviceItem}
//                   onPress={() => selectService(service)}
//                   activeOpacity={0.7}
//                 >
//                   <View style={styles.serviceIconContainer}>
//                     {getServiceIcon(service.icon)}
//                   </View>
//                   <View style={styles.serviceInfo}>
//                     <Text style={styles.serviceItemText}>{service.name}</Text>
//                     <Text style={styles.serviceDescription}>
//                       {service.description}
//                     </Text>
//                   </View>
//                   <Ionicons name="chevron-forward" size={20} color="#af1f23" />
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// };

//@ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Animated,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiService from "@/config/ApiServices";
import { SafeAreaView } from "react-native-safe-area-context";
// import apiService from "../config/ApiServices";

const ServiceForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef(null);

  // Refs for text inputs to enable direct focus
  const pickupLocationInputRef = useRef(null);
  const dropLocationInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      try {
        // Check if userId is passed as params
        const userIdFromParams = params.userId;

        if (!userIdFromParams) {
          // If no userId in params, check AsyncStorage
          const storedUserData = await AsyncStorage.getItem("userData");
          if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            if (parsedData.userId) {
              setUserData(parsedData);
            } else {
              // No userId found, redirect to phone screen
              router.replace("/phone");
              return;
            }
          } else {
            // No stored data, redirect to phone screen
            router.replace("/phone");
            return;
          }
        } else {
          // Get user data from API using userId from params
          try {
            const response = await apiService.getUserById(userIdFromParams);
            if (response.success) {
              setUserData(response.data);
            } else {
              Alert.alert(
                "Error",
                "Failed to load user data. Please try again."
              );
              router.replace("/phone");
              return;
            }
          } catch (error) {
            console.error("API error:", error);
            Alert.alert(
              "Connection Error",
              "Unable to load user data. Please check your connection and try again."
            );
            router.replace("/phone");
            return;
          }
        }
        setIsLoading(false);

        // Animation
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
      } catch (error) {
        console.error("Error loading user data:", error);
        Alert.alert("Error", "Failed to load user data. Please try again.");
        router.replace("/phone");
      }
    };

    loadUserData();

    // Keyboard listeners
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    message: "",
    service: "",
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

  // UI States
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFocus, setCurrentFocus] = useState(null);

  // Dummy service data
  const services = [
    {
      id: 1,
      name: "International Moving",
      icon: "rocket",
      description: "Moving across 32+ countries",
    },
    {
      id: 2,
      name: "Domestic Moving",
      icon: "truck",
      description: "Moving Across All UAE States",
    },
    // {
    //   id: 3,
    //   name: "Economy Delivery",
    //   icon: "package",
    //   description: "Budget-friendly option with 3-5 day delivery",
    // },
    // {
    //   id: 4,
    //   name: "International Shipping",
    //   icon: "globe",
    //   description: "Worldwide shipping with customs handling",
    // },
  ];

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.pickupLocation)
      tempErrors.pickupLocation = "Pickup location is required";
    if (!formData.dropLocation)
      tempErrors.dropLocation = "Drop location is required";
    if (!formData.service) tempErrors.service = "Please select a service";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Only dismiss keyboard after validation to prevent unnecessary hide/show
    if (validateForm()) {
      Keyboard.dismiss();
      setIsSubmitting(true);

      try {
        // Call API to create booking
        const response = await apiService.createBooking({
          userId: userData.userId,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          pickupLocation: formData.pickupLocation,
          dropLocation: formData.dropLocation,
          service: formData.service,
          message: formData.message || "",
        });

        if (response.success) {
          console.log("Booking created successfully:", response.data);
          setShowSuccess(true);

          // Hide success message after 3 seconds
          setTimeout(() => {
            setShowSuccess(false);

            // Reset form
            setFormData({
              pickupLocation: "",
              dropLocation: "",
              message: "",
              service: "",
            });

            // Navigate to booking confirmation or listing
            router.replace({
              pathname: "/booking-success",
              // params: {
              //   bookingId: response.data.bookingId,
              // },
            });
          }, 2000);
        } else {
          Alert.alert(
            "Error",
            response.message || "Failed to create booking. Please try again."
          );
        }
      } catch (error) {
        console.error("API error:", error);
        Alert.alert(
          "Connection Error",
          "Unable to create booking. Please check your connection and try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const selectService = (service) => {
    handleChange("service", service.id);
    setShowServiceModal(false);
  };

  // Direct focus function to explicitly focus on a specific input
  const focusInput = (fieldName) => {
    // Map field names to refs
    const refMap = {
      pickupLocation: pickupLocationInputRef,
      dropLocation: dropLocationInputRef,
      message: messageInputRef,
    };

    // Focus the input using its ref
    if (refMap[fieldName]?.current) {
      refMap[fieldName].current.focus();
    }

    handleFocus(fieldName);
  };

  const handleFocus = (fieldName) => {
    setCurrentFocus(fieldName);

    // Use requestAnimationFrame to ensure smoother scrolling with keyboard
    requestAnimationFrame(() => {
      if (scrollViewRef.current) {
        const yOffset = getScrollPosition(fieldName);
        scrollViewRef.current.scrollTo({
          y: yOffset,
          animated: true,
        });
      }
    });
  };

  const getScrollPosition = (fieldName) => {
    // Adjust positions based on whether keyboard is visible
    const basePositions = {
      pickupLocation: 0,
      dropLocation: 80,
      service: 180,
      message: 280,
    };

    // Add extra offset when keyboard is visible for lower fields
    const keyboardOffset = keyboardVisible
      ? fieldName === "message"
        ? 100
        : fieldName === "dropLocation"
        ? 80
        : fieldName === "pickupLocation"
        ? 60
        : 0
      : 0;

    return (basePositions[fieldName] || 0) + keyboardOffset;
  };

  // Get icon for each field
  const getFieldIcon = (field) => {
    const color = currentFocus === field ? "#af1f23" : "#aaa";

    switch (field) {
      case "pickupLocation":
        return <Ionicons name="location-outline" size={22} color={color} />;
      case "dropLocation":
        return <MaterialIcons name="location-on" size={22} color={color} />;
      case "message":
        return <Ionicons name="chatbox-outline" size={22} color={color} />;
      case "service":
        return <Ionicons name="list-outline" size={22} color={color} />;
      default:
        return null;
    }
  };

  // Get icon for service
  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case "rocket":
        return <Ionicons name="rocket" size={20} color="#fff" />;
      case "truck":
        return <Ionicons name="car" size={20} color="#fff" />;
      case "package":
        return <Ionicons name="cube-outline" size={20} color="#fff" />;
      case "globe":
        return <Ionicons name="globe-outline" size={20} color="#fff" />;
      default:
        return <Ionicons name="apps" size={20} color="#fff" />;
    }
  };

  // Handle service modal open - don't dismiss keyboard if already focused
  const handleServicePress = () => {
    // If keyboard is visible, store current focus before showing modal
    const wasFocused = keyboardVisible;
    if (wasFocused) {
      // Set a flag to return focus after modal closes
      setReturnFocusAfterModal(currentFocus);
    }
    setShowServiceModal(true);
  };

  const [returnFocusAfterModal, setReturnFocusAfterModal] = useState(null);

  // Handle modal close - restore focus if needed
  const handleModalClose = () => {
    setShowServiceModal(false);

    // If we had a field focused before, return focus to it
    if (returnFocusAfterModal) {
      // Use small timeout to ensure modal is fully closed
      setTimeout(() => {
        setCurrentFocus(returnFocusAfterModal);
        focusInput(returnFocusAfterModal);
        setReturnFocusAfterModal(null);
      }, 300);
    }
  };

  // Function to handle click on input wrapper (ensure focus works on outer container)
  const handleWrapperPress = (fieldName) => {
    focusInput(fieldName);
  };

  // Show loading indicator while getting user data
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#af1f23" />
        <Text style={styles.loadingText}>Loading your information...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // behavior={Platform.OS === "ios" ? "padding" : "padding"} // Use padding for both platforms
      // keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 40} // Adjusted for Android
      // enabled={true}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" />
      {/* <StatusBar style="light" backgroundColor="#af1f23" /> */}

      {/* Header with back button */}
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
        <Text style={styles.headerTitle}>Request Service</Text>
        <View style={styles.rightHeaderSpace} />
      </LinearGradient>

      {/* Main Form */}
      {/* <View style={styles.formWrapper}>
       
      </View> */}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollViewStyle}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always" // Changed to always to ensure focus isn't lost
        bounces={false}
      >
        <Animated.View
          style={[
            styles.formContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.formHeader}>
            <LinearGradient
              colors={["#af1f23", "#d8373b"]}
              style={styles.iconCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="car" size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.formTitle}>Delivery Details</Text>
            <Text style={styles.formSubtitle}>
              Please fill in your delivery information below
            </Text>
          </View>

          {/* User Information Summary */}
          {/* <View style={styles.userInfoCard}>
              <View style={styles.userInfoHeader}>
                <Ionicons
                  name="person-circle-outline"
                  size={22}
                  color="#af1f23"
                />
                <Text style={styles.userInfoTitle}>User Information</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Name:</Text>
                <Text style={styles.userInfoValue}>{userData?.name}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Email:</Text>
                <Text style={styles.userInfoValue}>{userData?.email}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Phone:</Text>
                <Text style={styles.userInfoValue}>{userData?.phone}</Text>
              </View>
            </View> */}

          {/* Locations Section */}
          <View style={styles.sectionDivider}>
            <View style={styles.dividerLine} />
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={16} color="#fff" />
            </View>
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.sectionTitle}>Pickup & Delivery Locations</Text>

          {/* Pick up location Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pickup Location</Text>
            <TouchableWithoutFeedback
              onPress={() => handleWrapperPress("pickupLocation")}
            >
              <View
                style={[
                  styles.inputWrapper,
                  currentFocus === "pickupLocation" && styles.focusedInput,
                  errors.pickupLocation && styles.errorInput,
                ]}
              >
                {getFieldIcon("pickupLocation")}
                <TextInput
                  ref={pickupLocationInputRef}
                  style={styles.input}
                  placeholder="Enter pickup address"
                  placeholderTextColor="#aaa"
                  value={formData.pickupLocation}
                  onChangeText={(text) => handleChange("pickupLocation", text)}
                  onFocus={() => handleFocus("pickupLocation")}
                  onBlur={() => setCurrentFocus(null)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => focusInput("dropLocation")}
                  autoFocus={true} // First field gets focus
                />
              </View>
            </TouchableWithoutFeedback>
            {errors.pickupLocation && (
              <Text style={styles.errorText}>{errors.pickupLocation}</Text>
            )}
          </View>

          {/* Drop Location Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Drop-off Location</Text>
            <TouchableWithoutFeedback
              onPress={() => handleWrapperPress("dropLocation")}
            >
              <View
                style={[
                  styles.inputWrapper,
                  currentFocus === "dropLocation" && styles.focusedInput,
                  errors.dropLocation && styles.errorInput,
                ]}
              >
                {getFieldIcon("dropLocation")}
                <TextInput
                  ref={dropLocationInputRef}
                  style={styles.input}
                  placeholder="Enter delivery address"
                  placeholderTextColor="#aaa"
                  value={formData.dropLocation}
                  onChangeText={(text) => handleChange("dropLocation", text)}
                  onFocus={() => handleFocus("dropLocation")}
                  onBlur={() => setCurrentFocus(null)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
            </TouchableWithoutFeedback>
            {errors.dropLocation && (
              <Text style={styles.errorText}>{errors.dropLocation}</Text>
            )}
          </View>

          {/* Service Section */}
          <View style={styles.sectionDivider}>
            <View style={styles.dividerLine} />
            <View style={styles.sectionHeader}>
              <Ionicons name="settings-outline" size={16} color="#fff" />
            </View>
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.sectionTitle}>Service Details</Text>

          {/* Service Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select Service Type</Text>
            <TouchableOpacity
              style={[
                styles.serviceSelector,
                errors.service && styles.errorInput,
              ]}
              onPress={handleServicePress}
              activeOpacity={0.7}
            >
              <View style={styles.serviceSelectorContent}>
                {getFieldIcon("service")}
                <Text
                  style={[
                    styles.serviceSelectorText,
                    !formData.service && styles.placeholderText,
                  ]}
                >
                  {formData.service
                    ? services.find((s) => s.id === formData.service)?.name
                    : "Select a Service"}
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                <AntDesign name="down" size={16} color="#777" />
              </View>
            </TouchableOpacity>
            {errors.service && (
              <Text style={styles.errorText}>{errors.service}</Text>
            )}
          </View>

          {/* Message Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Special Instructions (Optional)
            </Text>
            <TouchableWithoutFeedback
              onPress={() => handleWrapperPress("message")}
            >
              <View
                style={[
                  styles.messageWrapper,
                  currentFocus === "message" && styles.focusedInput,
                ]}
              >
                <View style={styles.messageIconContainer}>
                  {getFieldIcon("message")}
                </View>
                <TextInput
                  ref={messageInputRef}
                  style={styles.messageInput}
                  placeholder="Add any special requirements or notes"
                  placeholderTextColor="#aaa"
                  value={formData.message}
                  onChangeText={(text) => handleChange("message", text)}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  onFocus={() => handleFocus("message")}
                  onBlur={() => setCurrentFocus(null)}
                  returnKeyType="done"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                isSubmitting ? ["#bbbbbb", "#999999"] : ["#af1f23", "#d8373b"]
              }
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Success message */}
          {showSuccess && (
            <Animated.View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <AntDesign name="checkcircle" size={24} color="#27ae60" />
              </View>
              <Text style={styles.successText}>
                Your booking has been submitted successfully!
              </Text>
            </Animated.View>
          )}

          {/* Padding for keyboard */}
          {/* <View
              style={{ height: keyboardVisible ? keyboardHeight * 0.3 : 0 }}
            /> */}
        </Animated.View>
      </ScrollView>

      {/* Service Selection Modal */}
      <Modal
        visible={showServiceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Service</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleModalClose}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />

            <ScrollView
              style={styles.serviceList}
              showsVerticalScrollIndicator={false}
            >
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceItem}
                  onPress={() => selectService(service)}
                  activeOpacity={0.7}
                >
                  <View style={styles.serviceIconContainer}>
                    {getServiceIcon(service.icon)}
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceItemText}>{service.name}</Text>
                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#af1f23" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },

  // formWrapper: {
  //   flex: 1,
  // },

  scrollViewStyle: {
    flex: 1,
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
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  rightHeaderSpace: {
    width: 40, // To balance the header layout
  },

  scrollContainer: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    // marginBottom: 20,
  },
  formHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  sectionHeader: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#af1f23",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
    marginLeft: 2,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#eeeeee",
    height: 50,
  },
  focusedInput: {
    borderColor: "#af1f23",
    backgroundColor: "#fff",
    shadowColor: "#af1f23",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorInput: {
    borderColor: "#af1f23",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 48, // Slightly reduced height to avoid clipping
    fontSize: 15,
    marginLeft: 10,
    color: "#333",
    padding: 0, // Remove default padding which can cause issues on Android
  },
  messageWrapper: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eeeeee",
    minHeight: 110,
    flexDirection: "row",
  },
  messageIconContainer: {
    paddingLeft: 16,
    paddingTop: 14,
  },
  messageInput: {
    flex: 1,
    fontSize: 15,
    paddingTop: 14,
    paddingRight: 16,
    paddingBottom: 14,
    paddingLeft: 10,
    textAlignVertical: "top",
    color: "#333",
    minHeight: 110, // Fixed minimum height
  },
  errorText: {
    color: "#af1f23",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  serviceSelector: {
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: "#eeeeee",
    height: 50,
  },
  serviceSelectorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceSelectorText: {
    fontSize: 15,
    marginLeft: 10,
    color: "#333",
  },
  chevronContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#aaa",
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
    height: 54,
    shadowColor: "#af1f23",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.8,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  successContainer: {
    marginTop: 24,
    backgroundColor: "#e6f7ef",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  successIcon: {
    marginRight: 12,
  },
  successText: {
    flex: 1,
    color: "#27ae60",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomPadding: {
    height: 100, // Adds space at the bottom for keyboard
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 8,
  },
  serviceList: {
    maxHeight: 400,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#af1f23",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: "#777",
  },
});

export default ServiceForm;
