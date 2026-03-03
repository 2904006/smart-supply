import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Huile d\'Argan Bio',
    category: 'Huile',
    price: '180 DH',
    image: 'https://images.unsplash.com/photo-1615313041806-57b68b8a8f6c',
    supplier: 'Coopérative Essaouira'
  },
  {
    id: 2,
    name: 'Dattes Medjoul',
    category: 'Fruits Secs',
    price: '95 DH/kg',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
    supplier: 'Palmeraie Zagora'
  },
  {
    id: 3,
    name: 'Safran de Taliouine',
    category: 'Épices',
    price: '850 DH/10g',
    image: 'https://images.unsplash.com/photo-1596049158589-22a0c2f5df5c',
    supplier: 'Coop. Taliouine'
  }
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0C3B2E" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>Client</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Bannière d'accueil */}
        <TouchableOpacity 
          style={styles.heroBanner}
          onPress={() => navigation.navigate('Catalogue')}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>📦 Catalogue Complet</Text>
            <Text style={styles.heroText}>
              Découvrez nos produits alimentaires marocains
            </Text>
            <Text style={styles.heroButton}>Explorer →</Text>
          </View>
          <View style={styles.heroDecoration}>
            <Text style={styles.decorationIcon}>🫒</Text>
          </View>
        </TouchableOpacity>

        {/* Actions rapides */}
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Catalogue')}
          >
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionText}>Catalogue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Commandes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Statistiques</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🏪</Text>
            <Text style={styles.actionText}>Fournisseurs</Text>
          </TouchableOpacity>
        </View>

        {/* Produits en vedette */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produits en Vedette</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Catalogue')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {FEATURED_PRODUCTS.map(product => (
            <TouchableOpacity 
              key={product.id}
              style={styles.productCard}
              onPress={() => navigation.navigate('Catalogue')}
            >
              <View style={styles.productImageWrapper}>
                <Image 
                  source={{ uri: product.image }} 
                  style={styles.productImage}
                />
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{product.category}</Text>
                </View>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSupplier}>{product.supplier}</Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <TouchableOpacity style={styles.addToCartBtn}>
                    <Text style={styles.addToCartText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Statistiques */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Votre Activité</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Commandes actives</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Articles en stock</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1,250 DH</Text>
              <Text style={styles.statLabel}>Dépenses mensuelles</Text>
            </View>
          </View>
        </View>

        {/* Alertes */}
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>⚠️ Alertes</Text>
          <Text style={styles.alertText}>• Stock faible: Huile d'Argan (5 unités)</Text>
          <Text style={styles.alertText}>• Commande #001245 en attente de validation</Text>
          <TouchableOpacity style={styles.alertButton}>
            <Text style={styles.alertButtonText}>Voir les détails</Text>
          </TouchableOpacity>
        </View>

        {/* À propos */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Smart Supply 🇲🇦</Text>
          <Text style={styles.aboutText}>
            Plateforme de gestion de la chaîne d'approvisionnement 
            des produits alimentaires marocains. Connectez-vous avec 
            les meilleurs producteurs locaux.
          </Text>
        </View>

      </ScrollView>

      {/* Navigation Bottom */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navTextActive}>Accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Catalogue')}
        >
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>Catalogue</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navText}>Commandes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginTop: 2,
  },
  notificationBtn: {
    padding: 10,
  },
  notificationIcon: {
    fontSize: 24,
  },
  heroBanner: {
    backgroundColor: '#0C3B2E',
    margin: 15,
    borderRadius: 20,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  heroContent: {
    flex: 2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
    lineHeight: 20,
  },
  heroButton: {
    color: '#D4A017',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroDecoration: {
    flex: 1,
    alignItems: 'center',
  },
  decorationIcon: {
    fontSize: 60,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginLeft: 15,
    marginTop: 25,
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#FFF',
    width: '48%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C3B2E',
  },
  section: {
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAll: {
    color: '#D4A017',
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  productImageWrapper: {
    height: 150,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(12, 59, 46, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginBottom: 5,
  },
  productSupplier: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4A017',
  },
  addToCartBtn: {
    backgroundColor: '#0C3B2E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsSection: {
    paddingHorizontal: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: '#FFF',
    flex: 1,
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: '#FFF8E1',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#FFA000',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8F00',
    marginBottom: 10,
  },
  alertText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertButton: {
    backgroundColor: '#FFA000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  alertButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  aboutSection: {
    backgroundColor: '#FFF',
    margin: 15,
    marginTop: 25,
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0C3B2E',
    marginBottom: 15,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 3,
    borderTopColor: '#0C3B2E',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#95A5A6',
  },
  navTextActive: {
    fontSize: 12,
    color: '#0C3B2E',
    fontWeight: 'bold',
  },
});