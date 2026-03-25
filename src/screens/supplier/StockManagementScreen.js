 import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../../utils/theme';
import { PRODUCTS } from '../../utils/data';

export default function StockManagementScreen({ navigation }) {
  const [products, setProducts] = useState(PRODUCTS);

  const updateStock = (productId, change) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stock + change);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const renderProduct = ({ item }) => {
    const isLowStock = item.stock < item.minStock;

    return (
      <View style={[styles.productCard, isLowStock && styles.lowStockCard]}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          {isLowStock && (
            <View style={styles.warningBadge}>
              <Text style={styles.warningText}>⚠️ Stock faible</Text>
            </View>
          )}
        </View>

        <Text style={styles.productSupplier}>{item.supplier}</Text>

        <View style={styles.stockInfo}>
          <View>
            <Text style={styles.stockLabel}>Stock actuel</Text>
            <Text style={[styles.stockValue, isLowStock && styles.lowStockValue]}>
              {item.stock} {item.unit}
            </Text>
          </View>
          <View>
            <Text style={styles.stockLabel}>Seuil d'alerte</Text>
            <Text style={styles.stockValue}>{item.minStock} {item.unit}</Text>
          </View>
        </View>

        <View style={styles.stockControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => updateStock(item.id, -5)}
          >
            <Text style={styles.controlText}>-5</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => updateStock(item.id, -1)}
          >
            <Text style={styles.controlText}>-1</Text>
          </TouchableOpacity>
          <Text style={styles.stockNumber}>{item.stock}</Text>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => updateStock(item.id, 1)}
          >
            <Text style={styles.controlText}>+1</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => updateStock(item.id, 5)}
          >
            <Text style={styles.controlText}>+5</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestion des stocks</Text>
        <TouchableOpacity onPress={() => Alert.alert('Info', 'Modifications sauvegardées')}>
          <Text style={styles.saveButton}>💾</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
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
  saveButton: {
    fontSize: 24,
    color: '#FFF',
  },
  list: {
    padding: 16,
  },
  productCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  lowStockCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  warningBadge: {
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  warningText: {
    fontSize: 10,
    color: COLORS.error,
  },
  productSupplier: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stockLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  lowStockValue: {
    color: COLORS.error,
  },
  stockControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    backgroundColor: COLORS.lightGray,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  stockNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
});