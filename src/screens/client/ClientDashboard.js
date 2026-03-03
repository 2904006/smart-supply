// src/screens/client/ClientDashboard.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Avatar,
  Badge,
  IconButton,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

const statsData = [
  {
    id: 1,
    label: 'Commandes actives',
    value: '8',
    icon: '📦',
    color: '#2A9D8F',
    change: '+2',
    trend: 'up',
  },
  {
    id: 2,
    label: 'Total dépensé',
    value: '12,450 DH',
    icon: '💰',
    color: '#E9C46A',
    change: '+15%',
    trend: 'up',
  },
  {
    id: 3,
    label: 'Fournisseurs',
    value: '6',
    icon: '🏪',
    color: '#E76F51',
    change: '+1',
    trend: 'up',
  },
  {
    id: 4,
    label: 'En livraison',
    value: '3',
    icon: '🚚',
    color: '#457B9D',
    change: '-1',
    trend: 'down',
  },
];

const recentOrders = [
  {
    id: 'CMD001',
    supplier: 'Coopérative Tissaliwine',
    date: '2026-03-01',
    total: '2,160 DH',
    status: 'en préparation',
    items: ['Huile d\'Argan x12', 'Amlou x6'],
    statusColor: '#E9C46A',
  },
  {
    id: 'CMD002',
    supplier: 'Palmeraie Zagora',
    date: '2026-02-28',
    total: '2,375 DH',
    status: 'expédiée',
    items: ['Dattes Majhoul x25kg'],
    statusColor: '#2A9D8F',
  },
  {
    id: 'CMD003',
    supplier: 'Coop. Taliouine',
    date: '2026-02-27',
    total: '4,250 DH',
    status: 'livrée',
    items: ['Safran x5', 'Amandes x20kg'],
    statusColor: '#457B9D',
  },
];

const quickActions = [
  { icon: 'cart-outline', label: 'Catalogue', screen: 'Catalog', color: theme.colors.primary },
  { icon: 'document-text-outline', label: 'Commandes', screen: 'Orders', color: '#2A9D8F' },
  { icon: 'people-outline', label: 'Fournisseurs', screen: 'Suppliers', color: '#E9C46A' },
  { icon: 'person-outline', label: 'Profil', screen: 'Profile', color: '#E76F51' },
];

export default function ClientDashboard({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Ahmed');

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header avec gradient */}
        <LinearGradient
          colors={[theme.colors.primary, '#1A4A5F']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Bonjour,</Text>
              <Title style={styles.userName}>{userName}</Title>
              <Text style={styles.userRole}>Propriétaire de magasin</Text>
            </View>
            <Avatar.Image
              size={60}
              source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
              style={styles.avatar}
            />
          </View>
          
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Bienvenue sur Smart Supply</Text>
            <Text style={styles.welcomeText}>
              Découvrez les meilleurs produits marocains auprès de nos fournisseurs partenaires.
            </Text>
          </View>
        </LinearGradient>

        {/* Statistiques */}
        <View style={styles.statsGrid}>
          {statsData.map(stat => (
            <Card key={stat.id} style={styles.statCard}>
              <Card.Content>
                <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                </View>
                <Title style={styles.statValue}>{stat.value}</Title>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <View style={styles.statTrend}>
                  <Ionicons 
                    name={stat.trend === 'up' ? 'arrow-up' : 'arrow-down'} 
                    size={14} 
                    color={stat.trend === 'up' ? theme.colors.success : theme.colors.error} 
                  />
                  <Text style={[styles.statChange, { color: stat.trend === 'up' ? theme.colors.success : theme.colors.error }]}>
                    {stat.change}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Actions rapides */}
        <View style={styles.actionsSection}>
          <Title style={styles.sectionTitle}>Actions rapides</Title>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Commandes récentes */}
        <View style={styles.ordersSection}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Commandes récentes</Title>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.map((order, index) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
            >
              <Card style={styles.orderCard}>
                <Card.Content>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderLeft}>
                      <View style={[styles.orderStatusDot, { backgroundColor: order.statusColor }]} />
                      <View>
                        <Text style={styles.orderId}>{order.id}</Text>
                        <Text style={styles.orderSupplier}>{order.supplier}</Text>
                      </View>
                    </View>
                    <View style={styles.orderRight}>
                      <Text style={styles.orderTotal}>{order.total}</Text>
                      <Badge style={[styles.statusBadge, { backgroundColor: order.statusColor + '20' }]}>
                        <Text style={[styles.statusText, { color: order.statusColor }]}>
                          {order.status}
                        </Text>
                      </Badge>
                    </View>
                  </View>
                  <Divider style={styles.divider} />
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderItems}>
                      {order.items.join(' • ')}
                    </Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.date).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fournisseurs recommandés */}
        <View style={styles.suppliersSection}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Fournisseurs populaires</Title>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suppliersScroll}>
            {[1, 2, 3, 4].map(i => (
              <Card key={i} style={styles.supplierCard}>
                <Card.Content>
                  <Avatar.Icon size={50} icon="factory" style={styles.supplierAvatar} />
                  <Text style={styles.supplierName}>Coop. {['Tissaliwine', 'Zagora', 'Taliouine', 'Taroudant'][i-1]}</Text>
                  <Text style={styles.supplierType}>{['Huiles', 'Dattes', 'Épices', 'Amandes'][i-1]}</Text>
                  <View style={styles.supplierRating}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>4.{8-i}</Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Espace en bas */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  avatar: {
    backgroundColor: '#FFFFFF',
  },
  welcomeCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  welcomeText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  statCard: {
    width: (width - 40) / 2,
    marginBottom: 12,
    borderRadius: 20,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChange: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  actionsSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    width: '23%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
  },
  ordersSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  orderCard: {
    marginBottom: 12,
    borderRadius: 20,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  orderSupplier: {
    fontSize: 12,
    color: '#666',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: 4,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 24,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  divider: {
    marginVertical: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItems: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  suppliersSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  suppliersScroll: {
    marginTop: 16,
  },
  supplierCard: {
    width: 130,
    marginRight: 12,
    borderRadius: 20,
    alignItems: 'center',
    padding: 12,
  },
  supplierAvatar: {
    backgroundColor: theme.colors.primary + '20',
    marginBottom: 8,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  supplierType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  supplierRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 4,
  },
  bottomSpace: {
    height: 20,
  },
});