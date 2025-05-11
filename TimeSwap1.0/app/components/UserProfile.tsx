import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: 'Usuario',
    age: '25',
    photo: 'https://randomuser.me/api/portraits/lego/4.jpg?v=2',
    skills: [
      { name: 'Programación', level: 'Avanzado' },
      { name: 'Diseño Gráfico', level: 'Intermedio' },
      { name: 'Guitarra', level: 'Principiante' },
    ],
    description: 'Me apasiona aprender y compartir conocimientos',
    rating: 4.7,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Principiante' });

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setProfile({
        ...profile,
        skills: [...profile.skills, { ...newSkill }],
      });
      setNewSkill({ name: '', level: 'Principiante' });
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: updatedSkills });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profile.photo }} style={styles.profileImage} />
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {profile.rating}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Nombre"
            />
            <TextInput
              style={styles.input}
              value={profile.age}
              onChangeText={(text) => setProfile({ ...profile, age: text })}
              placeholder="Edad"
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={profile.description}
              onChangeText={(text) => setProfile({ ...profile, description: text })}
              placeholder="Descripción"
              multiline
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            <Text style={styles.description}>{profile.description}</Text>
          </>
        )}

        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.skillsContainer}>
          {profile.skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>
                {skill.name} - {skill.level}
              </Text>
              {isEditing && (
                <TouchableOpacity
                  onPress={() => removeSkill(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {isEditing && (
          <View style={styles.addSkillContainer}>
            <TextInput
              style={styles.skillInput}
              value={newSkill.name}
              onChangeText={(text) => setNewSkill({ ...newSkill, name: text })}
              placeholder="Nueva habilidad"
            />
            <TouchableOpacity style={styles.addButton} onPress={addSkill}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Guardar' : 'Editar Perfil'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  ratingContainer: {
    backgroundColor: '#FFD700',
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  skillBadge: {
    backgroundColor: '#E8E8E8',
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addSkillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skillInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
  removeButton: {
    marginLeft: 5,
    padding: 5,
  },
  removeButtonText: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 