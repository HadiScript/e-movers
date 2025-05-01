// // @ts-nocheck
// // components/Slider.js
// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   Animated,
//   ScrollView,
//   Platform,
//   TouchableOpacity,
//   Image,
//   ImageBackground,
// } from "react-native";
// import { FontAwesome5 } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";

// const { width } = Dimensions.get("window");
// const ITEM_WIDTH = width * 0.89;
// const ITEM_HEIGHT = 250;
// const SPACING = 1;
// // import '../../as'

// const sliderItems = [
//   {
//     id: 1,
//     gradientColors: ["#820014", "#d9534f"],
//     title: "International Moving",
//     subtitle: "International Moving Services in 32+ Countries",
//     iconName: "truck-moving",
//     stats: [
//       { label: "Moves", value: "2000+" },
//       { label: "Experience", value: "10 Yrs" },
//       { label: "Rating", value: "4.9" },
//     ],
//     image: require("../../assets/slider/international.jpg"),
//   },
//   {
//     id: 2,
//     gradientColors: ["#820014", "#d9534f"],
//     title: "Premium Packing",
//     subtitle: "High-quality materials for ultimate protection",
//     iconName: "box-open",
//     stats: [
//       { label: "Items", value: "50k+" },
//       { label: "Insurance", value: "100%" },
//       { label: "Quality", value: "A+" },
//     ],
//     image: require("../../assets/slider/Villa.jpg"),
//   },
//   {
//     id: 3,
//     gradientColors: ["#820014", "#d9534f"],
//     title: "Express Delivery",
//     subtitle: "Same-day moving services available",
//     iconName: "shipping-fast",
//     stats: [
//       { label: "On Time", value: "99%" },
//       { label: "Trucks", value: "50+" },
//       { label: "Speed", value: "Fast" },
//     ],
//     image: require("../../assets/slider/Office.jpg"),
//   },
// ];

// const Slider = () => {
//   const [activeSlide, setActiveSlide] = useState(0);
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const slidesRef = useRef(null);
//   const autoScrollTimer = useRef(null);

//   useEffect(() => {
//     startAutoScroll();
//     return () => {
//       if (autoScrollTimer.current) {
//         clearInterval(autoScrollTimer.current);
//       }
//     };
//   }, []);

//   const startAutoScroll = () => {
//     if (autoScrollTimer.current) {
//       clearInterval(autoScrollTimer.current);
//     }
//     autoScrollTimer.current = setInterval(() => {
//       const nextSlide = (activeSlide + 1) % sliderItems.length;
//       scrollToIndex(nextSlide);
//     }, 5000);
//   };

//   const scrollToIndex = (index) => {
//     if (slidesRef.current) {
//       slidesRef.current.scrollTo({
//         x: index * (ITEM_WIDTH + SPACING),
//         animated: true,
//       });
//       setActiveSlide(index);
//     }
//   };

//   const handleScroll = (event) => {
//     const slideIndex = Math.round(
//       event.nativeEvent.contentOffset.x / (ITEM_WIDTH + SPACING)
//     );
//     if (slideIndex !== activeSlide) {
//       setActiveSlide(slideIndex);
//       startAutoScroll(); // Reset timer on manual scroll
//     }
//   };

//   const renderPagination = () => {
//     return sliderItems.map((_, index) => {
//       const inputRange = [
//         (index - 1) * (ITEM_WIDTH + SPACING),
//         index * (ITEM_WIDTH + SPACING),
//         (index + 1) * (ITEM_WIDTH + SPACING),
//       ];

//       const dotScale = scrollX.interpolate({
//         inputRange,
//         outputRange: [1, 1.5, 1],
//         extrapolate: "clamp",
//       });

//       const dotOpacity = scrollX.interpolate({
//         inputRange,
//         outputRange: [0.5, 1, 0.5],
//         extrapolate: "clamp",
//       });

//       return (
//         <TouchableOpacity
//           key={index}
//           onPress={() => scrollToIndex(index)}
//           activeOpacity={0.7}
//         >
//           <Animated.View
//             style={[
//               styles.paginationDot,
//               {
//                 transform: [{ scale: dotScale }],
//                 opacity: dotOpacity,
//                 backgroundColor: index === activeSlide ? "#af1f23" : "#ddd",
//               },
//             ]}
//           />
//         </TouchableOpacity>
//       );
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Animated.ScrollView
//         ref={slidesRef}
//         horizontal
//         pagingEnabled={false}
//         decelerationRate="fast"
//         snapToInterval={ITEM_WIDTH + SPACING}
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: false, listener: handleScroll }
//         )}
//         scrollEventThrottle={16}
//       >
//         {sliderItems.map((item, index) => {
//           const inputRange = [
//             (index - 1) * (ITEM_WIDTH + SPACING),
//             index * (ITEM_WIDTH + SPACING),
//             (index + 1) * (ITEM_WIDTH + SPACING),
//           ];

//           const scale = scrollX.interpolate({
//             inputRange,
//             outputRange: [0.85, 1, 0.85],
//             extrapolate: "clamp",
//           });

//           const opacity = scrollX.interpolate({
//             inputRange,
//             outputRange: [0.5, 1, 0.5],
//             extrapolate: "clamp",
//           });

//           const rotate = scrollX.interpolate({
//             inputRange,
//             outputRange: ["8deg", "0deg", "-8deg"],
//             extrapolate: "clamp",
//           });

//           return (
//             <Animated.View
//               key={item.id}
//               style={[
//                 styles.slideWrapper,
//                 {
//                   transform: [{ scale }, { rotate }],
//                   opacity,
//                 },
//               ]}
//             >
//               <ImageBackground
//                 source={item.image}
//                 style={styles.backgroundImage}
//                 resizeMode="cover"
//               >
//                 <LinearGradient
//                   colors={item.gradientColors}
//                   style={styles.card}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   opacity={0.85}
//                 >
//                   <View style={styles.cardContent}>
//                     <View style={styles.iconContainer}>
//                       <BlurView intensity={20} style={styles.iconBlur}>
//                         <FontAwesome5
//                           name={item.iconName}
//                           size={28}
//                           color="#fff"
//                         />
//                       </BlurView>
//                     </View>

//                     <Text style={styles.cardTitle}>{item.title}</Text>
//                     <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

//                     <View style={styles.statsContainer}>
//                       {item.stats.map((stat, idx) => (
//                         <View key={idx} style={styles.statItem}>
//                           <Text style={styles.statValue}>{stat.value}</Text>
//                           <Text style={styles.statLabel}>{stat.label}</Text>
//                         </View>
//                       ))}
//                     </View>
//                   </View>
//                 </LinearGradient>
//               </ImageBackground>
//             </Animated.View>
//           );
//         })}
//       </Animated.ScrollView>

//       <View style={styles.paginationContainer}>{renderPagination()}</View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: ITEM_HEIGHT + 20,
//     marginVertical: 10,
//   },
//   scrollContent: {
//     paddingHorizontal: (width - ITEM_WIDTH) / 2,
//   },
//   slideWrapper: {
//     width: ITEM_WIDTH,
//     height: ITEM_HEIGHT,
//     marginHorizontal: SPACING / 2,
//     overflow: "hidden",
//   },
//   backgroundImage: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//     borderRadius: 25,
//     overflow: "hidden",
//   },
//   card: {
//     flex: 1,
//     borderRadius: 25,
//     padding: 20,
//     ...Platform.select({
//       ios: {
//         shadowOffset: { width: 0, height: 10 },
//         shadowOpacity: 0.3,
//         shadowRadius: 15,
//       },
//       android: {
//         // elevation: 15,
//       },
//     }),
//   },
//   cardContent: {
//     flex: 1,
//     alignItems: "center",
//   },
//   iconContainer: {
//     marginBottom: 5,
//   },
//   iconBlur: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//     backgroundColor: "rgba(255, 255, 255, 0.15)",
//   },
//   cardTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 5,
//     textAlign: "center",
//   },
//   cardSubtitle: {
//     fontSize: 14,
//     color: "rgba(255, 255, 255, 0.9)",
//     textAlign: "center",
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//     marginTop: "auto",
//   },
//   statItem: {
//     alignItems: "center",
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "rgba(255, 255, 255, 0.8)",
//     marginTop: 2,
//   },
//   paginationContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 1,
//   },
//   paginationDot: {
//     width: 8,
//     height: 2,
//     borderRadius: 4,
//     marginHorizontal: 6,
//   },
// });

// export default Slider;

// @ts-nocheck
// components/Slider.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.89;
const ITEM_HEIGHT = 250;
const SPACING = 1;

const sliderImages = [
  require("../../assets/slider/international.jpg"),
  require("../../assets/slider/Villa.jpg"),
  require("../../assets/slider/Office.jpg"),
  require("../../assets/slider/movers.jpg"),
  require("../../assets/slider/discounts.jpg"),
];

const Slider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const autoScrollTimer = useRef(null);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, []);

  const startAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    autoScrollTimer.current = setInterval(() => {
      const nextSlide = (activeSlide + 1) % sliderImages.length;
      scrollToIndex(nextSlide);
    }, 5000);
  };

  const scrollToIndex = (index) => {
    if (slidesRef.current) {
      slidesRef.current.scrollTo({
        x: index * (ITEM_WIDTH + SPACING),
        animated: true,
      });
      setActiveSlide(index);
    }
  };

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / (ITEM_WIDTH + SPACING)
    );
    if (slideIndex !== activeSlide) {
      setActiveSlide(slideIndex);
      startAutoScroll(); // Reset timer on manual scroll
    }
  };

  const renderPagination = () => {
    return sliderImages.map((_, index) => {
      const inputRange = [
        (index - 1) * (ITEM_WIDTH + SPACING),
        index * (ITEM_WIDTH + SPACING),
        (index + 1) * (ITEM_WIDTH + SPACING),
      ];

      const dotScale = scrollX.interpolate({
        inputRange,
        outputRange: [1, 1.5, 1],
        extrapolate: "clamp",
      });

      const dotOpacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.5, 1, 0.5],
        extrapolate: "clamp",
      });

      return (
        <TouchableOpacity
          key={index}
          onPress={() => scrollToIndex(index)}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.paginationDot,
              {
                transform: [{ scale: dotScale }],
                opacity: dotOpacity,
                backgroundColor: index === activeSlide ? "#af1f23" : "#ddd",
              },
            ]}
          />
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={slidesRef}
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + SPACING}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
      >
        {sliderImages.map((image, index) => {
          const inputRange = [
            (index - 1) * (ITEM_WIDTH + SPACING),
            index * (ITEM_WIDTH + SPACING),
            (index + 1) * (ITEM_WIDTH + SPACING),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: "clamp",
          });

          const rotate = scrollX.interpolate({
            inputRange,
            outputRange: ["8deg", "0deg", "-8deg"],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.slideWrapper,
                {
                  transform: [{ scale }, { rotate }],
                  opacity,
                },
              ]}
            >
              <Image source={image} style={styles.image} resizeMode="cover" />
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.paginationContainer}>{renderPagination()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT + 20,
    marginVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
  },
  slideWrapper: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginHorizontal: SPACING / 2,
    overflow: "hidden",
    borderRadius: 25,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 1,
  },
  paginationDot: {
    width: 8,
    height: 2,
    borderRadius: 4,
    marginHorizontal: 6,
  },
});

export default Slider;
