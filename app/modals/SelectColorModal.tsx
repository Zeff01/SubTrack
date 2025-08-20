import React, { useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorWheel from 'react-native-wheel-color-picker';

type ColorModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
  defaultColor?: string;
};

const ColorModal: React.FC<ColorModalProps> = ({
  visible,
  onClose,
  onSelect,
  defaultColor = '#7FB3FF',
}) => {
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const handleDone = () => {
    onSelect(selectedColor);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <View className="flex-1 justify-center items-center bg-black/40 px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[80%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Pick a Color</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={25} color="black" />
            </Pressable>
          </View>

          <View style={{ width: 250, height: 250 }}>
            <ColorWheel
              color={selectedColor}
              onColorChange={(color: string) => setSelectedColor(color)}
            />
          </View>

          <Pressable onPress={handleDone} className="mt-16 bg-black rounded-full py-3">
            <Text className="text-white text-center font-semibold">Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ColorModal;

