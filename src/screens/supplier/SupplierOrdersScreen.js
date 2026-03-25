import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { COLORS, ORDER_STATUS, STATUS_COLORS } from '../../utils/theme';
import { ORDERS, updateOrderStatus, PRODUCTS } from '../../utils/data';

export default function SupplierOrdersScreen({ navigation }) {
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    // Filtrer les commandes pour ce fournisseur (simulé)
    setOrders(ORDERS.filter(o => o.supplierId === 's7'));
  };

  const filters = [
    { value: 'all', label: 'Toutes' },
    { value: ORDER_STATUS.PENDING, label: 'En attente' },
    { value: ORDER_STATUS.VALIDATED, label: 'Validées' },
    { value: ORDER_STATUS.PREPARING, label: 'En préparation' },
    { value: ORDER_STATUS.SHIPPED, label: 'Expédiées' },
  ];

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || COLORS.gray;
  };

  const handleValidateOrder = (order) => {
    Alert.alert(
      'Valider la commande',
      'Voulez-vous valider cette commande ? Le stock sera décrémenté.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Valider',
          onPress: () => {
            // Décrémenter le stock
            order.items.forEach(item => {
              const product = PRODUCTS.find(p => p.id === item.productId);
              if (product) {
                product.stock -= item.quantity;
              }
            });
            updateOrderStatus(order.id, ORDER_STATUS.VALIDATED);
            loadOrders();
            Alert.alert('Succès', 'Commande validée');
          },
        },
      ]
    );
  };

  const handleUpdateStatus = (order, newStatus) => {
    updateOrderStatus(order.id, newStatus);
    loadOrders();
    Alert.alert('Succès', `Commande marquée comme ${newStatus.toLowerCase()}`);
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{item.id}</Text>
          <Text style={styles.orderClient}>{item.clientName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.map((product, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{product.name}</Text>
            <Text style={styles.itemQty}>x{product.quantity}</Text>
            <Text style={styles.itemPrice}>{product.price * product.quantity} DH</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>Total: {item.total} DH</Text>
        <Text style={styles.orderPayment}>
          Paiement: {item.paymentMethod === 'cash' ? 'Espèces' : 
                    item.paymentMethod === 'card' ? 'Carte' : 'Virement'}
        </Text>
      </View>

      {item.status === ORDER_STATUS.PENDING && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.validateButton]}
            onPress={() => handleValidateOrder(item)}
          >
            <Text style={styles.actionButtonText}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => updateOrderStatus(item.id, ORDER_STATUS.CANCELLED)}
          >
            <Text style={styles.actionButtonText}>Refuser</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === ORDER_STATUS.VALIDATED && (
        <TouchableOpacity 
          style={[styles.singleAction, styles.preparingButton]}
          onPress={() => handleUpdateStatus(item, ORDER_STATUS.PREPARING)}
        >
          <Text style={styles.actionButtonText}>Passer en préparation</Text>
        </TouchableOpacity>
      )}

      {item.status === ORDER_STATUS.PREPARING && (
        <TouchableOpacity 
          style={[styles.singleAction, styles.shipButton]}
          onPress={() => handleUpdateStatus(item, ORDER_STATUS.SHIPPED)}
        >
          <Text style={styles.actionButtonText}>Marquer comme expédiée</Text>
        </TouchableOpacity>
      )}

      {item.status === ORDER_STATUS.SHIPPED && (
        <TouchableOpacity 
          style={[styles.singleAction, styles.deliverButton]}
          onPress={() => handleUpdateStatus(item, ORDER_STATUS.DELIVERED)}
        >
          <Text style={styles.actionButtonText}>Marquer comme livrée</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commandes reçues</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        horizontal
        data={filters}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, filter === item.value && styles.filterChipActive]}
            onPress={() => setFilter(item.value)}
          >
            <Text style={[styles.filterText, filter === item.value && styles.filterTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.value}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersList}
      />

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ordersList}
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
  filtersList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.secondary,
  },
  filterText: {
    color: COLORS.text,
  },
  filterTextActive: {
    color: '#FFF',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  orderClient: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    color: COLORS.text,
    flex: 2,
  },
  itemQty: {
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.accent,
    flex: 1,
    textAlign: 'right',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    marginBottom: 12,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderPayment: {
    fontSize: 12,
    color: COLORS.gray,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  validateButton: {
    backgroundColor: COLORS.success,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
  },
  singleAction: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  preparingButton: {
    backgroundColor: COLORS.primary,
  },
  shipButton: {
    backgroundColor: COLORS.secondary,
  },
  deliverButton: {
    backgroundColor: COLORS.success,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});