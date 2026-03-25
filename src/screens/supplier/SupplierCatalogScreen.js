  import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../../utils/theme';
import { PRODUCTS } from '../../utils/data';

export default function SupplierCatalogScreen({ navigation }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const deleteProduct = (productId) => {
    Alert.alert(
      'Supprimer',
      'Voulez-vous supprimer ce produit ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => {
            setProducts(products.filter(p => p.id !== productId));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price} DH</Text>
        <Text style={styles.productStock}>Stock: {item.stock} {item.unit}</Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setEditingProduct(item);
            setModalVisible(true);
          }}
        >
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteProduct(item.id)}
        >
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Catalogue</Text>
        <TouchableOpacity onPress={() => {
          setEditingProduct(null);
          setModalVisible(true);
        }}>
          <Text style={styles.addButton}>+</Text>
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
  addButton: {
    fontSize: 24,
    color: '#FFF',
  },
  list: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: COLORS.accent,
    marginBottom: 2,
  },
  productStock: {
    fontSize: 12,
    color: COLORS.gray,
  },
  productActions: {
    justifyContent: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: COLORS.primary + '20',
  },
  deleteButton: {
    backgroundColor: COLORS.error + '20',
  },
  actionText: {
    fontSize: 16,
  },
});