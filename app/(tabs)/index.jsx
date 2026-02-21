import { Feather, Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import facts from "../../data/data.json";
import { getSavedFacts, initDB, removeFactFromDB, saveFactToDB } from "../../database/db";

export default function Index() {

  const [index, setIndex] = useState(0);

  const [savedFacts, setSavedFacts] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    initDB();
    const data = getSavedFacts();
    setSavedFacts(data);
  }, []);

    const animateCard = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };  

  useEffect(() => {
    setExpanded(false);
    descriptionAnim.stopAnimation();
    descriptionAnim.setValue(0);
    animateCard();
  }, [index]);


  const nextFact = () => {
    setIndex((prev) => (prev + 1) % facts.length);
  };

  const prevFact = () => {
    setIndex((prev) =>
      prev === 0 ? facts.length - 1 : prev - 1
    );
  };

  const copyFact = async () => {
    await Clipboard.setStringAsync(facts[index].fact);
  };

  const saveFact = async () => {
    const current = facts[index];

    const exists = savedFacts.some(f => f.id === current.id);

    if (exists) {
      removeFactFromDB(current.id);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      saveFactToDB(current);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setSavedFacts(getSavedFacts());
  };

  const [expanded, setExpanded] = useState(false);
  const descriptionAnim = useRef(new Animated.Value(0)).current;

  const toggleDescription = () => {
    setExpanded(prev => {
      const newValue = !prev;

      Animated.timing(descriptionAnim, {
        toValue: newValue ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();

      return newValue;
    });
  };

  return (
    <LinearGradient
      // colors={["#00A3FF", "#7000FF", "#8E2DE2"]}
      colors={["#00A3FF", "#8E2DE2"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-6">
        <StatusBar barStyle="light-content" backgroundColor="#00A3FF" />

        {/* Title */}
        <View className="my-12">
          <Text className="text-4xl font-bold text-white">
            Trivia<Text className="text-yellow-300">Pop</Text>
          </Text>
          <Text className="text-white/70 mt-2">
            Completely useless. Surprisingly amazing Facts.
          </Text>
        </View>

        {/* Animated Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 min-h-48 justify-center"
        >
          <Text className="text-white text-lg leading-7">
            {facts[index].fact}
          </Text>
        </Animated.View>

        {/* Expand Button */}
        <TouchableOpacity
          onPress={toggleDescription}
          className="mt-4 self-start"
        >
          <Text className="text-yellow-300 font-semibold">
            {expanded ? "Hide explanation ▲" : "expand ▼"}
          </Text>
        </TouchableOpacity>

        {/* Animated Description */}
        <Animated.View
          style={{
            opacity: descriptionAnim,
            maxHeight: descriptionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200],
            }),
          }}
        >
          <Text className="text-white/80 mt-3 leading-6">
            {facts[index].description}
          </Text>
        </Animated.View>

        {/* Controls Row */}
        <View className="flex-row justify-between items-center mt-12 ">

          {/* Previous */}
          <TouchableOpacity
            onPress={prevFact}
            activeOpacity={0.8}
            className="h-16 w-16 rounded-full bg-white/10 border border-white/20 items-center justify-center"
          >
            <Feather name="arrow-left" size={20} color="white" />
          </TouchableOpacity>

          {/* Copy */}
          <TouchableOpacity
            onPress={copyFact}
            activeOpacity={0.8}
            className="h-16 w-16 rounded-full bg-white/10 border border-white/20 items-center justify-center"
          >
            <Feather name="copy" size={20} color="white" />
          </TouchableOpacity>

          {/* Save */}
          <Pressable
  onPress={saveFact}
  android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
  style={({ pressed }) => [
    {
      transform: [{ scale: pressed ? 0.92 : 1 }],
    },
  ]}
  className="h-16 w-16 rounded-full bg-white/10 border border-white/20 items-center justify-center overflow-hidden"
>
<Ionicons
  name={
    savedFacts.some(f => f.id === facts[index].id)
      ? "heart"
      : "heart-outline"
  }
  size={24}
  color={
    savedFacts.some(f => f.id === facts[index].id)
      ? "#F43F5E"
      : "white"
  }
/>
</Pressable>

          {/* Next (Primary Action) */}
          <TouchableOpacity
            onPress={nextFact}
            activeOpacity={0.85}
            className="h-16 w-16 rounded-full bg-yellow-400 items-center justify-center shadow-lg"
          >
            <Feather name="arrow-right" size={24} color="#111" />
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );

}