import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
import { Profile } from '../../components/Profile';
import { db } from '../../config/firebase';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  skills: string[];
  rating: number;
  imageUrl: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default function DiscoverScreen() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const profilesRef = collection(db, 'users');
      const q = query(profilesRef, where('id', '!=', 'currentUserId'));
      const querySnapshot = await getDocs(q);
      
      const profilesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        age: doc.data().age || 0,
        bio: doc.data().bio || '',
        skills: doc.data().skills || [],
        rating: doc.data().rating || 0,
        imageUrl: doc.data().imageUrl || ''
      }));
      
      setProfiles(profilesData);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    const item = profiles[currentIndex];
    direction === 'right' ? handleLike() : handleDislike();
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false
    }).start();
  };

  const handleLike = async () => {
    const likedProfile = profiles[currentIndex];
    console.log('Liked:', likedProfile);
  };

  const handleDislike = () => {
    console.log('Disliked:', profiles[currentIndex]);
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  };

  const renderCards = () => {
    if (currentIndex >= profiles.length) {
      return (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>No hay más perfiles</Text>
        </View>
      );
    }

    return profiles.map((profile, index) => {
      if (index < currentIndex) return null;

      if (index === currentIndex) {
        return (
          <Animated.View
            key={profile.id}
            style={[getCardStyle(), styles.cardStyle]}
            {...panResponder.panHandlers}
          >
            <Profile user={profile} />
          </Animated.View>
        );
      }

      return (
        <Animated.View
          key={profile.id}
          style={[styles.cardStyle, { top: 10 * (index - currentIndex) }]}
        >
          <Profile user={profile} />
        </Animated.View>
      );
    }).reverse();
  };

  return (
    <View style={styles.container}>
      {renderCards()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCardsText: {
    fontSize: 18,
    color: '#666',
  }
}); 