 // src/screens/client/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Avatar,
  Button,
  List,
  Divider,
  Switch,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../utils/theme';

export default function ProfileScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const userData = {
    name: 'Ahmed OUKHCHINE',
    email: 'ahmed.oukhchine@estn.ma',
    phone: '+212 6 12 34 56 78',
    company: 'SuperMart Nador',
    address: 'Nador, Maroc',
    memberSince: 'Janvier 2026',
    avatar: 'https://i.pravatar.cc/150?img=3',
    stats: {
      orders: 24,
      spent: '18,450 DH',
      suppliers: 6,
    },
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      label: 'Informations personnelles',
      screen: 'PersonalInfo',
    },
    {
      icon: 'location-outline',
      label: 'Adresses de livraison',
      screen: 'Addresses',
    },
    {
      icon: 'card-outline',
      label: 'Méthodes de paiement',
      screen: 'Payment',
    },
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      type: 'switch',
      value: notifications,
      onValueChange: setNotifications,
    },
    {
      icon: 'moon-outline',
      label: 'Mode sombre',
      type: 'switch',
      value: darkMode,
      onValueChange: setDarkMode,
    },
    {
      icon: 'mail-outline',
      label: 'Emails promotionnels',
      type: 'switch',
      value: emailUpdates,
      onValueChange: setEmailUpdates,
    },
    {
      icon: 'help-circle-outline',
      label: 'Centre d\'aide',
      screen: 'Help',
    },
    {
      icon: 'document-text-outline',
      label: 'Conditions d\'utilisation',
      screen: 'Terms',
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Confidentialité',
      screen: 'Privacy',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête du profil */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <View style={styles.profileInfo}>
            <Avatar.Image
              size={100}
              source={{ uri: userData.avatar }}
              style={styles.avatar}
            />
            <Title style={styles.userName}>{userData.name}</Title>
            <Text style={styles.userEmail}>{userData.email}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Ionicons name="calendar-outline" size={12} color={theme.colors.accent} />
                <Text style={styles.badgeText}>Membre depuis {userData.memberSince}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userData.stats.orders}</Text>
                <Text style={styles.statLabel}>Commandes</Text>
              </View>
              <Divider style={styles.statsDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userData.stats.spent}</Text>
                <Text style={styles.statLabel}>Dépensé</Text>
              </View>
              <Divider style={styles.statsDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userData.stats.suppliers}</Text>
                <Text style={styles.statLabel}>Fournisseurs</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Informations de contact */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={theme.colors.accent} />
              <Text style={styles.infoText}>{userData.phone}</Text>
            </View>
            <Divider style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={20} color={theme.colors.accent} />
              <Text style={styles.infoText}>{userData.company}</Text>
            </View>
            <Divider style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={theme.colors.accent} />
              <Text style={styles.infoText}>{userData.address}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Menu de paramètres */}
        <Card style={styles.menuCard}>
          <Card.Content>
            {menuItems.map((item, index) => (
              <View key={index}>
                {item.type === 'switch' ? (
                  <View style={styles.menuRow}>
                    <View style={styles.menuLeft}>
                      <Ionicons name={item.icon} size={22} color={theme.colors.accent} />
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      color={theme.colors.accent}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.menuRow}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View style={styles.menuLeft}>
                      <Ionicons name={item.icon} size={22} color={theme.colors.accent} />
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ADB5BD" />
                  </TouchableOpacity>
                )}
                {index < menuItems.length - 1 && <Divider style={styles.menuDivider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Bouton de déconnexion */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          labelStyle={styles.logoutLabel}
          icon="log-out-outline"
        >
          Déconnexion
        </Button>

        {/* Version de l'app */}
        <Text style={styles.version}>Smart Supply v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfo: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.accent,
    marginLeft: 4,
  },
  statsContainer: {
    marginTop: 80,
    paddingHorizontal: 16,
  },
  statsCard: {
    borderRadius: 20,
    elevation: 2,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statsDivider: {
    height: '100%',
    width: 1,
    backgroundColor: '#E9ECEF',
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 12,
  },
  infoDivider: {
    backgroundColor: '#E9ECEF',
  },
  menuCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: 12,
  },
  menuDivider: {
    backgroundColor: '#E9ECEF',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 12,
    borderColor: theme.colors.error,
  },
  logoutLabel: {
    color: theme.colors.error,
    fontSize: 16,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#ADB5BD',
    marginBottom: 20,
  },
});