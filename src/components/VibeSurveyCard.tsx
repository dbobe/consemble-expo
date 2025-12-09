import { Image } from 'expo-image';
import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { cn } from '../lib/utils';

interface VibeSurveyCardProps {
  className?: string;
  children?: ReactNode;
  onResponseClick: (mood: 'sad' | 'okay' | 'happy') => void;
  width?: string;
  height?: string;
  roundness?: string;
  question?: string;
}

export function VibeSurveyCard({
  className = '',
  children,
  onResponseClick,
  width = 'w-[366px] max-w-[calc(100vw-2rem)]',
  height = 'h-[217px]',
  roundness = 'rounded-[30px]',
  question = 'How are you feeling today?',
}: VibeSurveyCardProps) {
  return (
    <View
      className={cn(
        `flex flex-col items-center justify-center gap-6 ${width} ${height} bg-white ${roundness}`,
        'border-[3.19px] border-solid border-[#41b97b] px-6 py-8',
        'shadow-[0px_7.96px_31.85px_0px_#1f3e5e38]',
        className,
      )}
    >
      <Text className="text-xl text-[#355677]" style={{ fontFamily: 'gantari', fontWeight: '600' }}>
        {question}
      </Text>
      <View className="flex flex-row justify-between items-center gap-2 w-full">
        <TouchableOpacity onPress={() => onResponseClick('sad')}>
          <Image
            source={require('@/src/assets/sad-face.svg')}
            style={{ width: 97, height: 91 }}
            contentFit="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onResponseClick('okay')}>
          <Image
            source={require('@/src/assets/okay-face.svg')}
            style={{ width: 97, height: 91 }}
            contentFit="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onResponseClick('happy')}>
          <Image
            source={require('@/src/assets/happy-face.svg')}
            style={{ width: 97, height: 91 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
