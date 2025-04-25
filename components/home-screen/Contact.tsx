// @ts-nocheck
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Linking,
  ScrollView,
  Share
} from "react-native";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
  Feather,
  FontAwesome,
  AntDesign
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const ContactOption = ({ icon, title, subtitle, gradient, onPress, iconComponent }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const animatePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      })
    ]).start(() => onPress());
  };
  
  return (
    <Animated.View style={[styles.optionWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.contactOption}
        onPress={animatePress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={gradient}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.optionContent}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              {iconComponent || <FontAwesome5 name={icon} size={18} color="#fff" />}
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>{title}</Text>
              <Text style={styles.optionSubtitle}>{subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SocialButton = ({ icon, color, onPress, brand }) => {
  return (
    <TouchableOpacity 
      style={[styles.socialButton, { backgroundColor: color }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {brand === 'facebook' && <FontAwesome name="facebook" size={18} color="#fff" />}
      {brand === 'instagram' && <FontAwesome name="instagram" size={18} color="#fff" />}
      {brand === 'youtube' && <FontAwesome name="youtube-play" size={18} color="#fff" />}
      {brand === 'linkedin' && <FontAwesome name="linkedin" size={18} color="#fff" />}
      {brand === 'share' && <Feather name="share-2" size={18} color="#fff" />}
    </TouchableOpacity>
  );
};

const Contact = () => {
  const [activeTab, setActiveTab] = useState('contact');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
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

    // Pulse animation for call button
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
    Linking.openURL("tel:+971553928484");
  };

  const handleWhatsAppPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL("https://wa.me/971553928484?text=Hello! I need information about your moving services.");
  };

  const handleEmailPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL("mailto:info@ehousemovers.com?subject=Inquiry about Moving Services");
  };

  const handleLocationPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // This opens the address in maps app
    const address = "14 Al Tawaash Street - Jumeirah - Jumeirah 3 - Dubai";
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  const handleSocialPress = (url) => {
    Linking.openURL(url);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out E House Movers for your moving and storage needs! Contact: +971553928484, Website: https://ehousemovers.com',
      });
    } catch (error) {
      console.log(error);
    }
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
        colors={["#ffffff", "#f8f8f8"]}
        style={styles.gradientBackground}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="headset" size={32} color="#af1f23" />
          </View>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <Text style={styles.contactSubtitle}>
            We're ready to help with your moving needs
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'contact' && styles.activeTab]} 
            onPress={() => setActiveTab('contact')}
          >
            <Feather name="phone" size={16} color={activeTab === 'contact' ? "#af1f23" : "#666"} />
            <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'location' && styles.activeTab]} 
            onPress={() => setActiveTab('location')}
          >
            <Feather name="map-pin" size={16} color={activeTab === 'location' ? "#af1f23" : "#666"} />
            <Text style={[styles.tabText, activeTab === 'location' && styles.activeTabText]}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'social' && styles.activeTab]} 
            onPress={() => setActiveTab('social')}
          >
            <Feather name="share-2" size={16} color={activeTab === 'social' ? "#af1f23" : "#666"} />
            <Text style={[styles.tabText, activeTab === 'social' && styles.activeTabText]}>Connect</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'contact' && (
            <View style={styles.tabContent}>
              {/* Call Button */}
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <ContactOption 
                  icon="phone-alt"
                  title="Call Us"
                  subtitle="+971 55 392 8484"
                  gradient={["#af1f23", "#c52d31"]}
                  onPress={handlePhonePress}
                />
              </Animated.View>

              {/* WhatsApp Button */}
              <ContactOption 
                icon="whatsapp"
                title="WhatsApp"
                subtitle="Chat with us"
                gradient={["#25D366", "#128C7E"]}
                onPress={handleWhatsAppPress}
              />

              {/* Email Button */}
              <ContactOption 
                icon="envelope"
                title="Email Us"
                subtitle="info@ehousemovers.com"
                gradient={["#4285F4", "#34A853"]}
                onPress={handleEmailPress}
                iconComponent={<MaterialCommunityIcons name="email-outline" size={20} color="#fff" />}
              />
            </View>
          )}

          {activeTab === 'location' && (
            <View style={styles.tabContent}>
              {/* Address Card */}
              <View style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <MaterialCommunityIcons name="map-marker-radius" size={24} color="#af1f23" />
                  <Text style={styles.addressTitle}>Our Location</Text>
                </View>
                <Text style={styles.addressText}>
                  14 Al Tawaash Street - Jumeirah - Jumeirah 3 - Dubai
                </Text>
                <TouchableOpacity style={styles.mapButton} onPress={handleLocationPress}>
                  <LinearGradient
                    colors={["#af1f23", "#c52d31"]}
                    style={styles.mapButtonGradient}
                  >
                    <Text style={styles.mapButtonText}>Open in Maps</Text>
                    <MaterialCommunityIcons name="map-marker" size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Business Hours Card */}
              <View style={styles.hoursCard}>
                <View style={styles.hoursHeader}>
                  <MaterialCommunityIcons name="clock-outline" size={24} color="#333" />
                  <Text style={styles.hoursTitle}>Business Hours</Text>
                </View>
                <View style={styles.hourRow}>
                  <Text style={styles.dayText}>Monday - Friday</Text>
                  <Text style={styles.timeText}>8:00 AM - 8:00 PM</Text>
                </View>
                <View style={styles.hourRow}>
                  <Text style={styles.dayText}>Saturday</Text>
                  <Text style={styles.timeText}>9:00 AM - 6:00 PM</Text>
                </View>
                <View style={styles.hourRow}>
                  <Text style={styles.dayText}>Sunday</Text>
                  <Text style={styles.timeText}>10:00 AM - 4:00 PM</Text>
                </View>
                <View style={styles.supportRow}>
                  <MaterialCommunityIcons name="headset" size={16} color="#af1f23" />
                  <Text style={styles.supportText}>24/7 Customer Support Available</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'social' && (
            <View style={styles.tabContent}>
              <View style={styles.socialCard}>
                <Text style={styles.socialTitle}>Connect With Us</Text>
                <Text style={styles.socialSubtitle}>Follow us on social media for updates, tips and special offers</Text>
                
                <View style={styles.socialButtonsContainer}>
                  <SocialButton 
                    brand="facebook" 
                    color="#1877F2" 
                    onPress={() => handleSocialPress('https://www.facebook.com/ehousemoversllc')} 
                  />
                  <SocialButton 
                    brand="instagram" 
                    color="#E4405F" 
                    onPress={() => handleSocialPress('https://www.instagram.com/e_house_movers/')} 
                  />
                  <SocialButton 
                    brand="youtube" 
                    color="#FF0000" 
                    onPress={() => handleSocialPress('https://www.youtube.com/@EHouseMovers')} 
                  />
                  <SocialButton 
                    brand="linkedin" 
                    color="#0A66C2" 
                    onPress={() => handleSocialPress('https://www.linkedin.com/company/ehouse-movers')} 
                  />
                  <SocialButton 
                    brand="share" 
                    color="#333333" 
                    onPress={handleShare} 
                  />
                </View>
              </View>
              
              <View style={styles.newsletterCard}>
                <View style={styles.newsletterHeader}>
                  <MaterialCommunityIcons name="email-newsletter" size={24} color="#333" />
                  <Text style={styles.newsletterTitle}>Stay Updated</Text>
                </View>
                <Text style={styles.newsletterText}>
                  Subscribe to our newsletter for exclusive deals and moving tips
                </Text>
                <TouchableOpacity style={styles.subscribeButton} onPress={handleEmailPress}>
                  <Text style={styles.subscribeButtonText}>Email Us to Subscribe</Text>
                  <AntDesign name="arrowright" size={16} color="#af1f23" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>E House Movers LLC</Text>
          <Text style={styles.footerSubtext}>Premium Moving & Storage Solutions</Text>
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
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 15,
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
    padding: 20,
    position: "relative",
    overflow: "hidden",
    minHeight: 500,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
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
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabText: {
    marginLeft: 6,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#333",
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tabContent: {
    marginBottom: 20,
  },
  optionWrapper: {
    marginBottom: 15,
  },
  contactOption: {
    borderRadius: 15,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 15,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  optionSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    marginTop: 2,
  },
  // Address Card
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  addressText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 15,
  },
  mapButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  mapButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mapButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 8,
  },
  // Hours Card
  hoursCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  hoursHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dayText: {
    fontSize: 15,
    color: "#555",
  },
  timeText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  supportRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  supportText: {
    fontSize: 13,
    color: "#555",
    marginLeft: 8,
    fontStyle: "italic",
  },
  // Social Section
  socialCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  socialSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 5,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  // Newsletter Card
  newsletterCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  newsletterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  newsletterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  newsletterText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 15,
  },
  subscribeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  subscribeButtonText: {
    color: "#333",
    fontWeight: "600",
    marginRight: 8,
  },
  // Footer
  footer: {
    marginTop: 10,
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  footerSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
  },
  // Decorative elements
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