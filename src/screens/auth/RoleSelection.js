 import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function RoleSelection() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};

  const selectRole = (role) => {
    if (role === 'client') {
      navigation.replace('ClientApp');
    } else {
      navigation.replace('SupplierApp');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <Text style={styles.title}>Choisissez votre profil</Text>
        <Text style={styles.subtitle}>
          Connecté en tant que: {email || 'demo@smartsupply.ma'}
        </Text>

        {/* Client Card */}
        <TouchableOpacity 
          style={styles.roleCard}
          onPress={() => selectRole('client')}
        >
          <View style={styles.roleIconContainer}>
            <Text style={styles.roleIcon}>🛒</Text>
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>CLIENT</Text>
            <Text style={styles.roleSubtitle}>Propriétaire de Magasin</Text>
            <Text style={styles.roleDescription}>
              • Passer des commandes
              • Suivre les livraisons
              • Gérer les fournisseurs
              • Consulter le catalogue
            </Text>
          </View>
          <Text style={styles.roleArrow}>→</Text>
        </TouchableOpacity>

        {/* Fournisseur Card */}
        <TouchableOpacity 
          style={[styles.roleCard, styles.supplierCard]}
          onPress={() => selectRole('supplier')}
        >
          <View style={styles.roleIconContainer}>
            <Text style={styles.roleIcon}>🏭</Text>
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>FOURNISSEUR</Text>
            <Text style={styles.roleSubtitle}>Producteur/Grossiste</Text>
            <Text style={styles.roleDescription}>
              • Gérer le catalogue
              • Surveiller les stocks
              • Valider les commandes
              • Mettre à jour les produits
            </Text>
          </View>
          <Text style={styles.roleArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Sélectionnez votre rôle pour accéder au tableau de bord approprié
        </Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: '#0C3B2E',
  },
  supplierCard: {
    borderColor: '#A23B72',
  },
  roleIconContainer: {
    marginRight: 20,
  },
  roleIcon: {
    fontSize: 50,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginBottom: 5,
  },
  roleSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontWeight: '500',
  },
  roleDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  roleArrow: {
    fontSize: 30,
    color: '#0C3B2E',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  note: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});