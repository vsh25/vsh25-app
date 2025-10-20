import React from 'react';
import { Image, ImageStyle } from 'react-native';

export type IconName =
  | 'book'
  | 'people'
  | 'brain'
  | 'hourglass'
  | 'bio'
  | 'pill';

const SRC: Record<IconName, any> = {
  book: require('../../assets/icons/book.png'),
  people: require('../../assets/icons/people.png'),
  brain: require('../../assets/icons/brain.png'),
  hourglass: require('../../assets/icons/hourglass.png'),
  bio: require('../../assets/icons/bio.png'),
  pill: require('../../assets/icons/pill.png'),
};

export default function Icon({
  name,
  size = 24,
  tint,
  style,
}: {
  name: IconName;
  size?: number;
  tint?: string;
  style?: ImageStyle | ImageStyle[];
}) {
  return (
    <Image
      source={SRC[name]}
      resizeMode="contain"
      style={[{ width: size, height: size, tintColor: tint }, style as any]}
    />
  );
}