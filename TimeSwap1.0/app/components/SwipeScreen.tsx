import React, { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
import SwipeCard from './SwipeCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 120;

const dummyProfiles = [
  {
    id: '1',
    name: 'Ana',
    age: 25,
    photo: 'https://randomuser.me/api/portraits/women/1.jpg?v=2',
    skills: [
      { name: 'Inglés', level: 'Avanzado' },
      { name: 'Piano', level: 'Intermedio' },
    ],
    description: 'Me encanta enseñar idiomas y música',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Carlos',
    age: 28,
    photo: 'https://randomuser.me/api/portraits/men/1.jpg?v=2',
    skills: [
      { name: 'Cocina', level: 'Experto' },
      { name: 'Fotografía', level: 'Avanzado' },
    ],
    description: 'Chef profesional con pasión por la fotografía',
    rating: 4.5,
  },
  {
    id: '3',
    name: 'Lucía',
    age: 23,
    photo: 'https://randomuser.me/api/portraits/women/2.jpg?v=2',
    skills: [
      { name: 'Yoga', level: 'Experto' },
      { name: 'Meditación', level: 'Avanzado' },
      { name: 'Nutrición', level: 'Intermedio' },
    ],
    description: 'Instructora de yoga y coach de bienestar integral',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Miguel',
    age: 31,
    photo: 'https://randomuser.me/api/portraits/men/2.jpg?v=2',
    skills: [
      { name: 'Guitarra', level: 'Experto' },
      { name: 'Producción Musical', level: 'Avanzado' },
      { name: 'Canto', level: 'Intermedio' },
    ],
    description: 'Músico profesional dispuesto a compartir conocimientos',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Sofía',
    age: 27,
    photo: 'https://randomuser.me/api/portraits/women/3.jpg?v=2',
    skills: [
      { name: 'Marketing Digital', level: 'Experto' },
      { name: 'Diseño Gráfico', level: 'Avanzado' },
      { name: 'Redes Sociales', level: 'Experto' },
    ],
    description: 'Especialista en marketing digital y branding personal',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Diego',
    age: 29,
    photo: 'https://randomuser.me/api/portraits/men/3.jpg?v=2',
    skills: [
      { name: 'Programación Web', level: 'Experto' },
      { name: 'React Native', level: 'Avanzado' },
      { name: 'UI/UX Design', level: 'Intermedio' },
    ],
    description: 'Desarrollador Full Stack apasionado por la tecnología',
    rating: 4.8,
  },
  {
    id: '7',
    name: 'Carmen',
    age: 32,
    photo: 'https://randomuser.me/api/portraits/women/4.jpg?v=2',
    skills: [
      { name: 'Pintura', level: 'Experto' },
      { name: 'Escultura', level: 'Avanzado' },
      { name: 'Historia del Arte', level: 'Experto' },
    ],
    description: 'Artista visual con experiencia en diferentes técnicas',
    rating: 4.9,
  }
];

const SwipeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    },
  });

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH * 2, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => nextCard());
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH * 2, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => nextCard());
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const nextCard = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const renderCards = () => {
    if (currentIndex >= dummyProfiles.length) {
      return (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>¡No hay más perfiles por el momento!</Text>
          <Text style={styles.noMoreCardsSubText}>Vuelve más tarde para encontrar nuevas personas</Text>
        </View>
      );
    }

    return dummyProfiles
      .map((profile, index) => {
        if (index < currentIndex) {
          return null;
        }

        if (index === currentIndex) {
          return (
            <Animated.View
              key={profile.id}
              style={[getCardStyle(), styles.cardContainer]}
              {...panResponder.panHandlers}
            >
              <SwipeCard profile={profile} />
            </Animated.View>
          );
        }

        // Para las tarjetas que están detrás, solo mostrar un placeholder
        return (
          <View
            key={profile.id}
            style={[
              styles.cardContainer,
              {
                top: 10 * (index - currentIndex),
                transform: [{ scale: 0.95 - (index - currentIndex) * 0.05 }],
                zIndex: -index,
              },
            ]}
          >
            <View style={styles.placeholderCard} />
          </View>
        );
      })
      .reverse();
  };

  return (
    <View style={styles.container}>
      {renderCards()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  placeholderCard: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noMoreCardsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  noMoreCardsSubText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default SwipeScreen; 