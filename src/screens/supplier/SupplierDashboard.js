import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Badge,
  List,
  Divider,
  ActivityIndicator,
  ProgressBar,
  FAB,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme, ORDER_STATUS, MOROCCAN_PRODUCTS, ORDERS } from '../../utils/constants';

export default function SupplierDashboard() {
  const navigation = useNavigation();
  const [supplierName, setSupplierName] = useState('Chargement...');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const name = await AsyncStorage.getItem('userName');
      if (name) setSupplierName(name);

      const supplierProducts = MOROCCAN_PRODUCTS.slice(0, 5);
      setProducts(supplierProducts);
      
      const pending = ORDERS.filter(order => order.status === ORDER_STATUS.PENDING);
      setPendingOrders(pending.slice(0, 3));

      const lowStock = supplierProducts.filter(p => p.stock <= p.minStock).length;
      const pendingCount = pending.length;

      setStats({
        totalProducts: supplierProducts.length,
        lowStockProducts: lowStock,
        pendingOrders: pendingCount,
        monthlyRevenue: 3450,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Avatar.Icon
              size={60}
              icon="factory"
              style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              color="#FFFFFF"
            />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Bonjour,</Text>
              <Title style={styles.supplierName}>{supplierName}</Title>
              <Paragraph style={styles.supplierRole}>Fournisseur - Producteur</Paragraph>
            </View>
          </View>
        </View>

        {stats.lowStockProducts > 0 && (
          <Card style={styles.alertCard}>
            <Card.Content>
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>⚠️ Alertes de stock</Text>
                <Badge style={styles.alertBadge}>{stats.lowStockProducts}</Badge>
              </View>
              <Text style={styles.alertText}>
                {stats.lowStockProducts} produit{stats.lowStockProducts > 1 ? 's' : ''} en dessous du seuil minimum
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Stocks')}
                style={styles.alertButton}
                labelStyle={styles.alertButtonLabel}
              >
                Gérer les stocks
              </Button>
            </Card.Content>
          </Card>
        )}

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statEmoji}>📦</Text>
              <Title style={styles.statNumber}>{stats.totalProducts}</Title>
              <Text style={styles.statLabel}>Produits</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statEmoji}>⏳</Text>
              <Title style={styles.statNumber}>{stats.pendingOrders}</Title>
              <Text style={styles.statLabel}>Commandes</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statEmoji}>💰</Text>
              <Title style={styles.statNumber}>{stats.monthlyRevenue} DH</Title>
              <Text style={styles.statLabel}>Chiffre du mois</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>⚡ Gestion</Title>
          <View style={styles.actionsGrid}>
            <Card
              style={styles.actionCard}
              onPress={() => navigation.navigate('Stocks')}
            >
              <Card.Content style={styles.actionContent}>
                <Avatar.Icon size={40} icon="package" style={styles.actionIcon} />
                <Text style={styles.actionText}>Gérer stocks</Text>
              </Card.Content>
            </Card>

            <Card
              style={styles.actionCard}
              onPress={() => navigation.navigate('Orders')}
            >
              <Card.Content style={styles.actionContent}>
                <Avatar.Icon size={40} icon="clipboard-list" style={styles.actionIcon} />
                <Text style={styles.actionText}>Commandes</Text>
              </Card.Content>
            </Card>

            <Card style={styles.actionCard}>
              <Card.Content style={styles.actionContent}>
                <Avatar.Icon size={40} icon="plus-circle" style={styles.actionIcon} />
                <Text style={styles.actionText}>Ajouter produit</Text>
              </Card.Content>
            </Card>

            <Card style={styles.actionCard}>
              <Card.Content style={styles.actionContent}>
                <Avatar.Icon size={40} icon="chart-line" style={styles.actionIcon} />
                <Text style={styles.actionText}>Statistiques</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>📥 Commandes en attente</Title>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Orders')}
              labelStyle={{ color: theme.colors.accent }}
            >
              Voir tout
            </Button>
          </View>

          {pendingOrders.map(order => (
            <Card key={order.id} style={styles.orderCard}>
              <Card.Content>
                <View style={styles.orderHeader}>
                  <View>
                    <Title style={styles.orderId}>Commande {order.id}</Title>
                    <Text style={styles.orderClient}>
                      Client: {order.clientName}
                    </Text>
                  </View>
                  <Badge style={styles.pendingBadge}>En attente</Badge>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.orderFooter}>
                  <Text style={styles.orderItems}>
                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                  </Text>
                  <Title style={styles.orderTotal}>{order.total} DH</Title>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>📉 Produits à réapprovisionner</Title>
          {products.filter(p => p.stock <= p.minStock).length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  Tous les produits ont un stock suffisant
                </Text>
              </Card.Content>
            </Card>
          ) : (
            products
              .filter(p => p.stock <= p.minStock)
              .slice(0, 3)
              .map(product => (
                <Card key={product.id} style={styles.productCard}>
                  <Card.Content>
                    <View style={styles.productHeader}>
                      <Title style={styles.productName}>{product.name}</Title>
                      <Badge style={styles.lowStockBadge}>Stock faible</Badge>
                    </View>
                    <View style={styles.productStockInfo}>
                      <Text style={styles.stockCurrent}>
                        Stock: {product.stock} {product.unit}
                      </Text>
                      <Text style={styles.stockMin}>
                        Seuil: {product.minStock} {product.unit}
                      </Text>
                    </View>
                    <ProgressBar
                      progress={product.stock / (product.minStock * 2)}
                      color="#F44336"
                      style={styles.progressBar}
                    />
                    <Button
                      mode="outlined"
                      onPress={() => navigation.navigate('Stocks')}
                      style={styles.reorderButton}
                      labelStyle={{ color: theme.colors.primary }}
                    >
                      Réapprovisionner
                    </Button>
                  </Card.Content>
                </Card>
              ))
          )}
        </View>

        <Card style={styles.performanceCard}>
          <Card.Content>
            <Title style={styles.performanceTitle}>📊 Performance</Title>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Taux de satisfaction</Text>
              <Text style={styles.performanceValue}>98%</Text>
            </View>
            <ProgressBar progress={0.98} color={theme.colors.accent} style={styles.performanceBar} />
            
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Délai de livraison</Text>
              <Text style={styles.performanceValue}>2.5 jours</Text>
            </View>
            <ProgressBar progress={0.75} color={theme.colors.accent} style={styles.performanceBar} />
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Ajouter un produit"
        onPress={() => Alert.alert('Ajout produit', 'Formulaire à venir')}
        color="#FFFFFF"
      />
    </View>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  header: {
    backgroundColor: '#A23B72',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  supplierName: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  supplierRole: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  alertCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#FFF8E1',
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8F00',
  },
  alertBadge: {
    backgroundColor: '#F44336',
    color: '#FFFFFF',
  },
  alertText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  alertButton: {
    backgroundColor: '#FFA000',
    borderRadius: 8,
  },
  alertButtonLabel: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  section: {
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
    color: theme.colors.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionIcon: {
    backgroundColor: '#A23B72',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A23B72',
    textAlign: 'center',
  },
  orderCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  orderClient: {
    fontSize: 12,
    color: '#666',
  },
  pendingBadge: {
    backgroundColor: '#FFC107',
    color: '#FFFFFF',
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
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  emptyCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  productCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  lowStockBadge: {
    backgroundColor: '#F44336',
    color: '#FFFFFF',
  },
  productStockInfo: {
    marginBottom: 12,
  },
  stockCurrent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  stockMin: {
    fontSize: 12,
    color: '#F44336',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
  },
  reorderButton: {
    borderColor: theme.colors.primary,
    borderRadius: 8,
  },
  performanceCard: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 80,
    borderRadius: 16,
    elevation: 2,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  performanceBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.accent,
  },
});