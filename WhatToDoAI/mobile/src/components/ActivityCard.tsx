// WhatToDoAI/mobile/src/components/ActivityCard.tsx

import React from 'react';
import { Image as RNImage } from 'react-native';
import { YStack, XStack, Text, H4, Card, Paragraph } from 'tamagui';
import { Activity } from '../types/activity'; // Assuming Activity type is defined

interface ActivityCardProps {
    activity: Activity;
    onPress: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onPress }) => {
    // Basic placeholder card structure
    return (
        <Card
            elevate
            bordered
            mb={16}
            overflow="hidden"
            onPress={onPress}
        >
            {/* Image */}
            {activity.image_urls && activity.image_urls.length > 0 ? (
                <YStack height={150}>
                    <RNImage
                        source={{ uri: activity.image_urls[0] }}
                        style={{ width: '100%', height: 150 }}
                        resizeMode="cover"
                    />
                </YStack>
            ) : (
                <YStack height={150}>
                    <Text>No Image Available</Text>
                </YStack>
            )}
            <YStack p={16} gap={4}>
                <H4 mb={4}>{activity.name || 'Unnamed Activity'}</H4>
                <Paragraph size="$2" color="gray" numberOfLines={2}>
                    {activity.description || 'No description available.'}
                </Paragraph>
                <Text fontSize={12} color="gray" mt={8}>
                    {activity.venue?.name || 'Location not specified'}
                </Text>
                {/* Rating if available */}
                {(activity.average_rating || activity.rating) && (
                    <Text fontSize={12} color="gray" mt={4}>
                        Rating: {activity.average_rating || activity.rating}/5
                        {activity.review_count ? ` (${activity.review_count} reviews)` : ''}
                    </Text>
                )}
                {/* Price info if available */}
                {activity.price_info && (
                    <Text fontSize={12} color="gray" mt={4}>
                        {activity.price_info}
                    </Text>
                )}
                {/* Source badge */}
                <XStack
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: activity.source === 'Eventbrite' ? 'blue' : 'green',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderBottomLeftRadius: 8
                    }}
                >
                    <Text fontSize={10} color={activity.source === 'Eventbrite' ? 'white' : 'white'}>
                        {activity.source}
                    </Text>
                </XStack>
            </YStack>
        </Card>
    );
};

export default ActivityCard; // Ensure default export
