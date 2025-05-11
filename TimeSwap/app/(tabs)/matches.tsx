import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';

interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchedUserName: string;
  matchedUserImage: string;
  matchedUserSkills: string[];
  createdAt: Date;
}

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const matchesRef = collection(db, 'matches');
      const q = query(matchesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const matchesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Match[];
      
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const renderMatchItem = ({ item }: { item: Match }) => (
    <TouchableOpacity style={styles.matchCard}>
      <Image
        source={{ uri: item.matchedUserImage || 'https://via.placeholder.com/100' }}
        style={styles.matchImage}
      />
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.matchedUserName}</Text>
        <View style={styles.skillsContainer}>
          {item.matchedUserSkills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {item.matchedUserSkills.length > 3 && (
            <Text style={styles.moreSkills}>+{item.matchedUserSkills.length - 3}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.chatButton}>
        <Ionicons name="chatbubble" size={24} color="#4CAF50" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Matches</Text>
      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No tienes matches aún</Text>
          <Text style={styles.emptySubtext}>
            ¡Sigue deslizando para encontrar personas con habilidades que te interesen!
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },
  listContainer: {
    padding: 10,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 15,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  skillTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  skillText: {
    color: '#1976D2',
    fontSize: 12,
  },
  moreSkills: {
    color: '#666',
    fontSize: 12,
  },
  chatButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
}); 