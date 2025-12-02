import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { displayInterests } from '../constants/constants';
import { cn } from '../lib/utils';
import { WhichInterests } from '../types';

interface CategorySelectionProps {
  userInterests: WhichInterests[];
  setUserInterests: (selectedCat: WhichInterests[]) => void;
  editable?: boolean;
}

export default function CategorySelection({
  userInterests,
  setUserInterests,
}: CategorySelectionProps) {
  const [displayError, setDisplayError] = useState(false);

  const notEnoughSelected = userInterests.length <= 3;

  const handleInterestClick = (interest: WhichInterests) => {
    const isRemoveClick = userInterests.includes(interest);
    if (notEnoughSelected && isRemoveClick) {
      setDisplayError(true);
      return;
    } else {
      setDisplayError(false);
    }
    if (!userInterests.includes(interest)) {
      setUserInterests([...userInterests, interest]);
    } else {
      setUserInterests(userInterests.filter((cat) => cat !== interest));
    }
  };

  const allSelected = displayInterests.every((interest) => userInterests.includes(interest));

  const handleAllClick = () => {
    if (allSelected) {
      return;
    } else {
      setUserInterests([
        ...userInterests.filter((i) => !displayInterests.includes(i)),
        ...displayInterests,
      ]);
    }
  };

  return (
    <View className="flex flex-col text-center">
      <Text
        className={`text-center text-xl font-gantari font-medium my-6 transition-all duration-300 ease-in-out ${displayError ? 'mb-2' : ''}`}
      >
        Preferred Categories
      </Text>
      {displayError && notEnoughSelected && (
        <Text className="text-sm font-medium text-neutral-gray-400">Select 3 or more</Text>
      )}
      <View className="flex flex-row flex-wrap w-full gap-2 justify-start p-2">
        {displayInterests.map((interest) => (
          <TouchableOpacity
            key={interest}
            id={interest}
            onPress={() => handleInterestClick(interest)}
            className={cn(
              'rounded-full font-semibold font-gantari p-2.5 px-4 w-fit',
              userInterests.includes(interest) ? 'bg-custom-green-random' : 'bg-white',
            )}
          >
            <Text>{interest}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={handleAllClick}
          className={cn(
            'rounded-full font-semibold font-gantari p-2.5 px-4 w-fit',
            allSelected ? 'bg-custom-green-random' : 'bg-white',
          )}
        >
          <Text>All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
