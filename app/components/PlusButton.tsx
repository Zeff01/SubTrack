import React from 'react';
import { TouchableOpacity, View, Text, GestureResponderEvent } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  onPress: (event: GestureResponderEvent) => void;
}

const PlusButton: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity
    className="absolute bottom-8 items-center justify-center"
    style={{
      left: '50%',
      transform: [{ translateX: -32 }],
    }}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View 
      className="w-16 h-16 rounded-full bg-[#3AABCC] items-center justify-center"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Ionicons name="add" size={30} color="#fff" />
    </View>
  </TouchableOpacity>
);

export default PlusButton;
