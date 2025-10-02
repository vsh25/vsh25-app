import React from 'react';
import { View } from 'react-native';
import Skeleton from './Skeleton';

export default function KBSkeleton() {
  return (
    <View>
      {[0,1,2].map((i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <Skeleton height={24} radius={12} style={{ marginBottom: 8, width: 140 }} />
          <Skeleton height={56} radius={16} />
        </View>
      ))}
    </View>
  );
}