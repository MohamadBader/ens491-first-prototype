// Sound icon mapping utility
export interface SoundIconData {
  icon: string;
  name: string;
}

const soundIconMap: Record<string, SoundIconData> = {
  // Animals
  chicken: { icon: '🐔', name: 'Chicken' },
  rooster: { icon: '🐓', name: 'Rooster' },
  dog: { icon: '🐕', name: 'Dog' },
  cat: { icon: '🐱', name: 'Cat' },
  bird: { icon: '🐦', name: 'Bird' },
  fowl: { icon: '🐔', name: 'Fowl' },
  cluck: { icon: '🐔', name: 'Cluck' },
  
  // Vehicles
  car: { icon: '🚗', name: 'Car' },
  truck: { icon: '🚚', name: 'Truck' },
  motorcycle: { icon: '🏍️', name: 'Motorcycle' },
  train: { icon: '🚂', name: 'Train' },
  airplane: { icon: '✈️', name: 'Airplane' },
  helicopter: { icon: '🚁', name: 'Helicopter' },
  
  // Musical instruments
  piano: { icon: '🎹', name: 'Piano' },
  guitar: { icon: '🎸', name: 'Guitar' },
  drum: { icon: '🥁', name: 'Drum' },
  violin: { icon: '🎻', name: 'Violin' },
  trumpet: { icon: '🎺', name: 'Trumpet' },
  
  // Nature sounds
  rain: { icon: '🌧️', name: 'Rain' },
  wind: { icon: '💨', name: 'Wind' },
  thunder: { icon: '⛈️', name: 'Thunder' },
  water: { icon: '💧', name: 'Water' },
  
  // Human sounds
  speech: { icon: '🗣️', name: 'Speech' },
  singing: { icon: '🎤', name: 'Singing' },
  laugh: { icon: '😄', name: 'Laugh' },
  cry: { icon: '😢', name: 'Cry' },
  applause: { icon: '👏', name: 'Applause' },
  
  // Electronic/Mechanical
  alarm: { icon: '⏰', name: 'Alarm' },
  siren: { icon: '🚨', name: 'Siren' },
  phone: { icon: '📞', name: 'Phone' },
  computer: { icon: '💻', name: 'Computer' },
  
  // Default fallback
  unknown: { icon: '🔊', name: 'Sound' },
};

export const getSoundIcon = (soundLabel: string): SoundIconData => {
  const lowerLabel = soundLabel.toLowerCase();
  
  // Try exact match first
  if (soundIconMap[lowerLabel]) {
    return soundIconMap[lowerLabel];
  }
  
  // Try partial matches
  for (const [key, value] of Object.entries(soundIconMap)) {
    if (lowerLabel.includes(key) || key.includes(lowerLabel)) {
      return value;
    }
  }
  
  // Return unknown if no match found
  return soundIconMap.unknown;
};