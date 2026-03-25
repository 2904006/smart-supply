import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ORDER_STATUS, STATUS_COLORS, STATUS_STEPS } from '../../utils/theme';
import { ORDERS, SUPPLIERS } from '../../utils/data';

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const order = ORDERS.find(o => o.id === orderId);
  const supplier = SUPPLIERS.find(s => s.id === order.supplierId);
  
  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Commande non trouvée</Text>
      </SafeAreaView>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  const handleTrackShipment = () => {
    Alert.alert('Suivi', 'Fonctionnalité de suivi en développement');
  };

  const handleContactSupplier = () => {
    Alert.alert('Contact', `Contacter ${supplier?.name || order.supplier}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail Commande</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.currentStatus}>{order.status}</Text>
          <View style={styles.progressContainer}>
            {STATUS_STEPS.map((step, index) => (
              <View key={step} style={styles.stepWrapper}>
                <View style={[
                  styles.stepDot,
                  index <= currentStepIndex && styles.stepDotActive,
                  index === currentStepIndex && styles.stepDotCurrent,
                ]}>
                  {index < currentStepIndex && (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  )}
                </View>
                <Text style={[
                  styles.stepText,
                  index <= currentStepIndex && styles.stepTextActive,
                ]}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informations commande</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Commande:</Text>
            <Text style={styles.infoValue}>{order.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{new Date(order.date).toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fournisseur:</Text>
            <Text style={styles.infoValue}>{order.supplier}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total:</Text>
            <Text style={styles.infoValue}>{order.total} DH</Text>
          </View>
        </View>

        {/* Products */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Articles</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQuantity}>x{item.quantity}</Text>
              </View>
              <Text style={styles.productPrice}>{item.price * item.quantity} DH</Text>
            </View>
          ))}
        </View>

        {/* Supplier Info */}
        {supplier && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Informations fournisseur</Text>
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={16} color={COLORS.gray} />
              <Text style={styles.infoText}>{supplier.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color={COLORS.gray} />
              <Text style={styles.infoText}>{supplier.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={16} color={COLORS.gray} />
              <Text style={styles.infoText}>{supplier.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={COLORS.gray} />
              <Text style={styles.infoText}>{supplier.location}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.trackButton} onPress={handleTrackShipment}>
            <Ionicons name="location-outline" size={20} color="#fff" />
            <Text style={styles.trackButtonText}>Suivre la livraison</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactSupplier}>
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
            <Text style={styles.contactButtonText}>Contacter le fournisseur</Text>
          </TouchableOpacity>
        </View>
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
  statusContainer: {
    backgroundColor: COLORS.surface,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  currentStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepDotActive: {
    backgroundColor: COLORS.success,
  },
  stepDotCurrent: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  stepText: {
    fontSize: 10,
    color: COLORS.gray,
    textAlign: 'center',
  },
  stepTextActive: {
    color: COLORS.text,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: COLORS.gray,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    color: COLORS.text,
    marginRight: 8,
  },
  productQuantity: {
    fontSize: 14,
    color: COLORS.gray,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 30,
    gap: 10,
  },
  trackButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  contactButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});