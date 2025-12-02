import { FontAwesome6 } from '@expo/vector-icons';
import { View } from 'react-native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

export function DropdownPicker<T extends string | number>(props: PickerSelectProps<T>) {
  return (
    <View className="bg-white/50 rounded-md">
      <RNPickerSelect
        style={{
          inputIOS: {
            padding: 12,
            fontSize: 16,
            color: '#4B5563',
            fontFamily: 'Tajawal-Regular',
          },
          inputAndroid: {
            padding: 12,
            fontSize: 16,
            color: '#4B5563',
            fontFamily: 'Tajawal-Regular',
          },
          iconContainer: {
            top: 12,
            right: 12,
          },
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => <FontAwesome6 name="chevron-down" size={16} color="#4B5563" />}
        {...props}
      />
    </View>
  );
}
