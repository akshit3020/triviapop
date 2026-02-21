import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getSavedFacts,
  removeFactFromDB,
} from "../../database/db";

export default function Saved() {
  const [savedFacts, setSavedFacts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Refresh when tab is focused
  useFocusEffect(
    useCallback(() => {
      setSavedFacts(getSavedFacts());
    }, [])
  );

  const removeFact = (id) => {
    removeFactFromDB(id);
    setSavedFacts(getSavedFacts());
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const anim = new Animated.Value(isExpanded ? 1 : 0);

    const toggle = () => {
      setExpandedId(isExpanded ? null : item.id);
    };

    return (
      <View className="bg-white/10 border border-white/20 rounded-3xl p-5 mb-4">
        {/* Fact */}
        <Text className="text-white text-base leading-6">
          {item.fact}
        </Text>

        {/* Expand Button */}
        <Pressable onPress={toggle} className="mt-3">
          <Text className="text-grey-400 font-semibold">
            {isExpanded ? "Hide ▲" : "Expand ▼"}
          </Text>
        </Pressable>

        {/* Description */}
        {isExpanded && (
          <Text className="text-white/70 mt-2 leading-6">
            {item.description}
          </Text>
        )}

        {/* Remove Button */}
        <View className="flex-row justify-end mt-4">
          <Pressable
            onPress={() => removeFact(item.id)}
            className="h-10 w-10 rounded-full bg-red-500/20 items-center justify-center"
          >
            <Ionicons name="heart" size={18} color="#F43F5E" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#00A3FF", "#8E2DE2"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-6">
        <StatusBar barStyle="light-content" backgroundColor="#00A3FF" />

        {/* Title */}
        <View className="my-12">
          <Text className="text-4xl font-bold text-white">
            Saved Facts ❤️
          </Text>
          <Text className="text-white/70 mt-2">
            Your favorite useless knowledge.
          </Text>
        </View>

        <FlatList
          data={savedFacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-white/50 mt-10 text-center">
              No saved facts yet.
            </Text>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}