  import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../utils/theme';
import { SUPPLIERS } from '../../utils/data';

export default function SupplierProfileScreen({ navigation }) {
  const [supplier, setSupplier] = useState({
    name: 'Coopérative Tissaliwine',
    type: 'Huile d\'argan',
    location: 'Essaouira',
    phone: '+212 5 24 78 90 12',
    email: 'contact@tissaliwine.ma',
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadSupplierData();
  }, []);

  const loadSupplierData = async () => {
    // Charger les données du fournisseur
    const saved = SUPPLIERS.find(s => s.id === 's7');
    if (saved) {
      setSupplier({
        name: saved.name,
        type: saved.type,
        location: saved.location,
        phone: saved.phone,
        email: saved.email,
      });
    }
  };

  const handleSave = () => {
    setEditing(false);
    Alert.alert('Succès', 'Informations mises à jour');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.editButton}>✏️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🏭</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          {editing ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom de l'entreprise</Text>
                <TextInput
                  style={styles.input}
                  value={supplier.name}
                  onChangeText={(text) => setSupplier({...supplier, name: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Type d'activité</Text>
                <TextInput
                  style={styles.input}
                  value={supplier.type}
                  onChangeText={(text) => setSupplier({...supplier, type: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ville</Text>
                <TextInput
                  style={styles.input}
                  value={supplier.location}
                  onChangeText={(text) => setSupplier({...supplier, location: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  value={supplier.phone}
                  onChangeText={(text) => setSupplier({...supplier, phone: text})}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={supplier.email}
                  onChangeText={(text) => setSupplier({...supplier, email: text})}
                  keyboardType="email-address"
                />
              </View>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Nom de l'entreprise</Text>
                <Text style={styles.value}>{supplier.name}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.label}>Type d'activité</Text>
                <Text style={styles.value}>{supplier.type}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.label}>Ville</Text>
                <Text style={styles.value}>{supplier.location}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.label}>Téléphone</Text>
                <Text style={styles.value}>{supplier.phone}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{supplier.email}</Text>
              </View>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.secondary,
  },
  backButton: {
    fontSize: 24,
    color: '#FFF',
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  editButton: {
    fontSize: 20,
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: COLORS.error + '10',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: 'bold',
    fontSize: 16,
  },
});