import React from 'react';
import { TouchableOpacity, View, Text, GestureResponderEvent } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  onPress: (event: GestureResponderEvent) => void;
}

const PlusButton: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity
    className="absolute -translate-x-1/2 bottom-5 left-1/2 items-center justify-center"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className="w-16 h-16 rounded-full bg-[#3AABCC] items-center justify-center">
      <Text>
        <Ionicons name="add" size={30} color="#fff" />
      </Text>
    </View>
  </TouchableOpacity>
);

export default PlusButton;
