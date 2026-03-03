 // src/screens/client/OrdersScreen.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Chip,
  Badge,
  Searchbar,
  SegmentedButtons,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';

const ordersData = [
  {
    id: 'CMD001',
    date: '2026-03-01',
    supplier: 'Coopérative Tissaliwine',
    total: 2160,
    status: 'preparing',
    items: [
      { name: 'Huile d\'Argan', quantity: 12, price: 180 },
    ],
    tracking: [
      { status: 'Commande validée', date: '2026-03-01 10:30', completed: true },
      { status: 'En préparation', date: '2026-03-02 14:20', completed: true },
      { status: 'Expédiée', date: 'En attente', completed: false },
      { status: 'Livrée', date: 'En attente', completed: false },
    ],
  },
  {
    id: 'CMD002',
    date: '2026-02-28',
    supplier: 'Palmeraie Zagora',
    total: 2375,
    status: 'shipped',
    items: [
      { name: 'Dattes Majhoul', quantity: 25, price: 95 },
    ],
    tracking: [
      { status: 'Commande validée', date: '2026-02-28 09:15', completed: true },
      { status: 'En préparation', date: '2026-03-01 11:30', completed: true },
      { status: 'Expédiée', date: '2026-03-02 16:45', completed: true },
      { status: 'Livrée', date: 'Estimée 2026-03-04', completed: false },
    ],
  },
  {
    id: 'CMD003',
    date: '2026-02-27',
    supplier: 'Coop. Taliouine',
    total: 4250,
    status: 'delivered',
    items: [
      { name: 'Safran', quantity: 5, price: 850 },
      { name: 'Amandes', quantity: 20, price: 140 },
    ],
    tracking: [
      { status: 'Commande validée', date: '2026-02-27 14:20', completed: true },
      { status: 'En préparation', date: '2026-02-28 10:15', completed: true },
      { status: 'Expédiée', date: '2026-03-01 09:30', completed: true },
      { status: 'Livrée', date: '2026-03-03 11:45', completed: true },
    ],
  },
];

const statusColors = {
  preparing: '#E9C46A',
  shipped: '#2A9D8F',
  delivered: '#457B9D',
  cancelled: '#E76F51',
};

const statusLabels = {
  preparing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export default function OrdersScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'preparing': return 'time-outline';
      case 'shipped': return 'car-outline';
      case 'delivered': return 'checkmark-circle-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'help-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Mes Commandes</Title>
        <Paragraph style={styles.headerSubtitle}>
          {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
        </Paragraph>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Rechercher une commande..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>

      <View style={styles.filtersContainer}>
        <SegmentedButtons
          value={filterStatus}
          onValueChange={setFilterStatus}
          buttons={[
            { value: 'all', label: 'Toutes' },
            { value: 'preparing', label: 'En prép.' },
            { value: 'shipped', label: 'Expédiées' },
            { value: 'delivered', label: 'Livrées' },
          ]}
          style={styles.segmented}
        />
      </View>

      <ScrollView style={styles.ordersList}>
        {filteredOrders.map(order => (
          <TouchableOpacity
            key={order.id}
            onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
          >
            <Card style={styles.orderCard}>
              <Card.Content>
                <View style={styles.orderHeader}>
                  <View style={styles.orderLeft}>
                    <View style={[styles.statusDot, { backgroundColor: statusColors[order.status] }]} />
                    <View>
                      <Text style={styles.orderId}>{order.id}</Text>
                      <Text style={styles.orderSupplier}>{order.supplier}</Text>
                    </View>
                  </View>
                  <View style={styles.orderRight}>
                    <View style={[styles.statusChip, { backgroundColor: statusColors[order.status] + '15' }]}>
                      <Ionicons 
                        name={getStatusIcon(order.status)} 
                        size={14} 
                        color={statusColors[order.status]} 
                      />
                      <Text style={[styles.statusText, { color: statusColors[order.status] }]}>
                        {statusLabels[order.status]}
                      </Text>
                    </View>
                  </View>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                      <Text style={styles.itemPrice}>{item.price * item.quantity} DH</Text>
                    </View>
                  ))}
                </View>

                <Divider style={styles.divider} />

                <View style={styles.orderFooter}>
                  <View>
                    <Text style={styles.orderDate}>
                      {new Date(order.date).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>{order.total} DH</Text>
                  </View>
                </View>

                {order.status === 'shipped' && (
                  <View style={styles.trackingPreview}>
                    <Ionicons name="location-outline" size={16} color={statusColors.shipped} />
                    <Text style={styles.trackingText}>
                      Colis en route • Livraison estimée dans 2 jours
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
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
    backgroundColor: theme.colors.primary,
    padding: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  searchbar: {
    borderRadius: 12,
    elevation: 0,
    backgroundColor: '#F8F9FA',
  },
  searchInput: {
    fontSize: 14,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  segmented: {
    backgroundColor: '#F8F9FA',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  orderSupplier: {
    fontSize: 13,
    color: '#666',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  divider: {
    marginVertical: 12,
  },
  orderItems: {
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.accent,
    textAlign: 'right',
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 13,
    color: '#666',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  trackingPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  trackingText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
});