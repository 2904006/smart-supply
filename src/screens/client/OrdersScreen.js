import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ORDER_STATUS, STATUS_COLORS } from '../../utils/theme';
import { ORDERS, SUPPLIERS } from '../../utils/data';

export default function OrdersScreen({ navigation }) {
  const [filter, setFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  
  const clientOrders = ORDERS.filter(o => o.clientId === 'c1');

  const filters = [
    { value: 'all', label: 'Toutes' },
    { value: ORDER_STATUS.PENDING, label: 'En attente' },
    { value: ORDER_STATUS.VALIDATED, label: 'Validées' },
    { value: ORDER_STATUS.PREPARING, label: 'En prép.' },
    { value: ORDER_STATUS.SHIPPED, label: 'Expédiées' },
    { value: ORDER_STATUS.DELIVERED, label: 'Livrées' },
    { value: ORDER_STATUS.CANCELLED, label: 'Annulées' },
  ];

  const filteredOrders = clientOrders.filter(order => {
    const matchesStatus = filter === 'all' || order.status === filter;
    const matchesSupplier = supplierFilter === 'all' || order.supplierId === supplierFilter;
    return matchesStatus && matchesSupplier;
  });

  const cancelOrder = (order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const hoursDiff = (now - orderDate) / (1000 * 60 * 60);

    if (order.status !== ORDER_STATUS.PENDING) {
      Alert.alert('Impossible', 'Seules les commandes en attente peuvent être annulées');
      return;
    }

    if (hoursDiff > 48) {
      Alert.alert('Délai dépassé', 'Le délai d\'annulation de 48h est dépassé');
      return;
    }

    Alert.alert(
      'Annuler la commande',
      `Voulez-vous annuler la commande ${order.id} ?`,
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          onPress: () => {
            order.status = ORDER_STATUS.CANCELLED;
            Alert.alert('Succès', 'Commande annulée');
          }
        }
      ]
    );
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>#{item.id}</Text>
          <Text style={styles.orderSupplier}>{item.supplier}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.orderTotal}>{item.total} DH</Text>
      
      {item.status === ORDER_STATUS.PENDING && (
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => cancelOrder(item)}
        >
          <Text style={styles.cancelButtonText}>Annuler (48h)</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Commandes</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(f => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterChip, filter === f.value && styles.filterChipActive]}
              onPress={() => setFilter(f.value)}
            >
              <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.supplierFilter}>
          <TouchableOpacity
            style={[styles.filterChip, supplierFilter === 'all' && styles.filterChipActive]}
            onPress={() => setSupplierFilter('all')}
          >
            <Text style={[styles.filterText, supplierFilter === 'all' && styles.filterTextActive]}>
              Tous
            </Text>
          </TouchableOpacity>
          {SUPPLIERS.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[styles.filterChip, supplierFilter === s.id && styles.filterChipActive]}
              onPress={() => setSupplierFilter(s.id)}
            >
              <Text style={[styles.filterText, supplierFilter === s.id && styles.filterTextActive]}>
                {s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune commande trouvée</Text>
          </View>
        }
      />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  filtersContainer: {
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.text,
  },
  filterTextActive: {
    color: '#fff',
  },
  supplierFilter: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  orderSupplier: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: COLORS.error + '20',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.error,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
  },
});