// WhatToDoAI/mobile/src/components/detail/ActivityImageGallery.tsx
import React, { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Text as RNText } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Placeholder Text component
const Text = ({ style, ...props }: any) => <RNText style={style} {...props} />;

interface ActivityImageGalleryProps {
  imageUrls: string[];
}

const ActivityImageGallery: React.FC<ActivityImageGalleryProps> = ({ imageUrls = [] }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (imageUrls.length === 0) {
    return (
      <View style={styles.placeholderImage}>
        <Ionicons name="image-outline" size={64} color="#CBD5E0" />
        <Text style={styles.placeholderText}>No images available</Text>
      </View>
    );
  }

  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: imageUrls[activeImageIndex] }}
        style={styles.mainImage}
        resizeMode="cover"
      />
      {imageUrls.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {imageUrls.map((url, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveImageIndex(index)}
              style={[
                styles.thumbnailWrapper,
                activeImageIndex === index && styles.activeThumbnail
              ]}
            >
              <Image
                source={{ uri: url }}
                style={styles.thumbnail}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: { width: '100%', height: 300, backgroundColor: '#E2E8F0' },
  mainImage: { width: '100%', height: 250 },
  thumbnailContainer: { height: 50, backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 8 },
  thumbnailWrapper: { width: 60, height: 34, marginHorizontal: 4, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: 'transparent' },
  activeThumbnail: { borderColor: '#4299E1' },
  thumbnail: { width: '100%', height: '100%' },
  placeholderImage: { width: '100%', height: 250, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E2E8F0' },
  placeholderText: { marginTop: 8, color: '#A0AEC0' },
});

export default ActivityImageGallery;