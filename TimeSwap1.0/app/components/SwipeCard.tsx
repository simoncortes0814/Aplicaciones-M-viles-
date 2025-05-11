import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Skill {
  name: string;
  level: string;
}

interface UserProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  skills: Skill[];
  description: string;
  rating: number;
}

interface SwipeCardProps {
  profile: UserProfile;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ profile }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: profile.photo }}
        style={styles.image}
        resizeMode="cover"
      />
      <ScrollView style={styles.infoContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.name}, {profile.age}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {profile.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={3}>
          {profile.description}
        </Text>
        
        <Text style={styles.skillsTitle}>Habilidades:</Text>
        <View style={styles.skillsContainer}>
          {profile.skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText} numberOfLines={1}>
                {skill.name}
              </Text>
              <Text style={styles.skillLevel}>
                {skill.level}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    flex: 1,
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 22,
  },
  skillsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 15,
    marginBottom: 6,
    alignItems: 'center',
  },
  skillText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  skillLevel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default SwipeCard; 