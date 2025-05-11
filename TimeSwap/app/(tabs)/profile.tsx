import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: '',
    age: '',
    bio: '',
    skills: [],
    rating: 0,
    imageUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await updateDoc(doc(db, 'users', userId), {
        ...user,
        updatedAt: new Date(),
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !user.skills.includes(newSkill.trim())) {
      setUser(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        {isEditing ? (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(false)}>
            <Ionicons name="save" size={24} color="#4CAF50" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil" size={24} color="#4CAF50" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={user.name}
              onChangeText={(text) => setUser(prev => ({ ...prev, name: text }))}
              placeholder="Nombre"
            />
            <TextInput
              style={styles.input}
              value={user.age}
              onChangeText={(text) => setUser(prev => ({ ...prev, age: text }))}
              placeholder="Edad"
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={user.bio}
              onChangeText={(text) => setUser(prev => ({ ...prev, bio: text }))}
              placeholder="Biografía"
              multiline
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.age}>{user.age} años</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </>
        )}

        <View style={styles.skillsContainer}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          {isEditing && (
            <View style={styles.addSkillContainer}>
              <TextInput
                style={styles.skillInput}
                value={newSkill}
                onChangeText={setNewSkill}
                placeholder="Nueva habilidad"
              />
              <TouchableOpacity style={styles.addSkillButton} onPress={handleAddSkill}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.skillsList}>
            {user.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                    <Ionicons name="close-circle" size={20} color="#FF4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.sectionTitle}>Calificación</Text>
          <View style={styles.ratingStars}>
            <Ionicons name="star" size={24} color="#FFD700" />
            <Text style={styles.rating}>{user.rating.toFixed(1)}</Text>
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  infoContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  age: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  skillsContainer: {
    marginBottom: 20,
  },
  addSkillContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  skillInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addSkillButton: {
    backgroundColor: '#4CAF50',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: '#1976D2',
    fontSize: 14,
    marginRight: 5,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 