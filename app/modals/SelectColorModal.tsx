import React, { useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ColorModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
};
const ColorModal = ({ visible, onClose, onSelect }: ColorModalProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (color : string ) => {
    setSelected(color);
    onSelect(color);
  };

const colorOptions = [
  '#F28C8C', // Soft Coral
  '#F7C873', // Warm Sand
  '#80CFA9', // Seafoam Green
  '#7FB3FF', // Soft Sky Blue
  '#B287FF', // Orchid
  '#FF9EBB', // Soft Rose
  '#5CD6D6', // Aqua Mist
  '#B4D37F', // Sage Lime
  '#FFA667', // Light Orange
  '#A6B1E1', // Lavender Blue
];


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/40 px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Choose a Color</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={25} color="black" />
            </Pressable>
          </View>

          <View className="flex-row flex-wrap justify-center items-center">
            {colorOptions.map((color, index) => (
              <Pressable
                key={index}
                onPress={() => handleSelect(color)}
                className={`w-12 h-12 m-2 rounded-full ${
                  selected === color ? 'border-white border-2' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </View>


          <Pressable
            onPress={onClose}
            className="mt-6 bg-black rounded-full py-3"
          >
            <Text className="text-white text-center font-semibold">Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default ColorModal;
