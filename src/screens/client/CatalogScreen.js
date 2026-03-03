import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  Chip,
  Badge,
  IconButton,
  Provider as PaperProvider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../utils/theme';

// Produits marocains
const MOROCCAN_PRODUCTS = [
  {
    id: '1',
    name: 'Huile d\'Argan Bio',
    category: 'Huiles',
    price: 180,
    unit: 'L',
    minOrder: 12,
    supplier: 'Coopérative Tissaliwine',
    origin: 'Essaouira',
    image: 'https://images.unsplash.com/photo-1615313041806-57b68b8a8f6c',
    rating: 4.9,
    reviews: 128,
    moq: '12 unités',
  },
  {
    id: '2',
    name: 'Dattes Majhoul Premium',
    category: 'Fruits secs',
    price: 95,
    unit: 'kg',
    minOrder: 25,
    supplier: 'Palmeraie Zagora',
    origin: 'Zagora',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
    rating: 4.8,
    reviews: 95,
    moq: '25 kg',
  },
  {
    id: '3',
    name: 'Safran de Taliouine',
    category: 'Épices',
    price: 850,
    unit: '10g',
    minOrder: 5,
    supplier: 'Coop. Taliouine',
    origin: 'Taliouine',
    image: 'https://images.unsplash.com/photo-1596049158589-22a0c2f5df5c',
    rating: 5.0,
    reviews: 67,
    moq: '5 sachets',
  },
  {
    id: '4',
    name: 'Amandes de Taroudant',
    category: 'Noix',
    price: 140,
    unit: 'kg',
    minOrder: 20,
    supplier: 'Ferme Taroudant',
    origin: 'Taroudant',
    image: 'https://images.unsplash.com/photo-1592317990872-1fd14c9f6a93',
    rating: 4.7,
    reviews: 82,
    moq: '20 kg',
  },
  {
    id: '5',
    name: 'Miel d\'Eucalyptus',
    category: 'Miels',
    price: 120,
    unit: '500g',
    minOrder: 12,
    supplier: 'Apiculteur Ifrane',
    origin: 'Ifrane',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924',
    rating: 4.9,
    reviews: 112,
    moq: '12 pots',
  },
  {
    id: '6',
    name: 'Couscous de Fès',
    category: 'Céréales',
    price: 35,
    unit: 'kg',
    minOrder: 50,
    supplier: 'Minoterie Fès',
    origin: 'Fès',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187',
    rating: 4.6,
    reviews: 73,
    moq: '50 kg',
  },
];

const categories = ['Tous', 'Huiles', 'Fruits secs', 'Épices', 'Noix', 'Miels', 'Céréales'];

export default function CatalogScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [cart, setCart] = useState({});

  const filteredProducts = MOROCCAN_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const renderProduct = ({ item }) => (
    <Card style={styles.productCard}>
      <Card.Cover source={{ uri: item.image }} style={styles.productImage} />
      <Card.Content style={styles.productContent}>
        <View style={styles.productHeader}>
          <View style={styles.titleContainer}>
            <Title style={styles.productName}>{item.name}</Title>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ {item.rating}</Text>
              <Text style={styles.reviews}>({item.reviews})</Text>
            </View>
          </View>
          <Badge style={styles.originBadge}>{item.origin}</Badge>
        </View>

        <Paragraph style={styles.supplierName}>{item.supplier}</Paragraph>
        
        <View style={styles.priceContainer}>
          <Title style={styles.price}>{item.price} DH</Title>
          <Text style={styles.unit}>/{item.unit}</Text>
        </View>
        
        <View style={styles.moqContainer}>
          <Text style={styles.moqLabel}>Commande min.</Text>
          <Text style={styles.moqValue}>{item.moq}</Text>
        </View>

        <Button
          mode="contained"
          onPress={() => addToCart(item.id)}
          style={styles.addButton}
          labelStyle={styles.addButtonLabel}
          icon="cart-plus"
        >
          Ajouter
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Catalogue Fournisseurs</Title>
        <Paragraph style={styles.headerSubtitle}>
          {filteredProducts.length} produits disponibles
        </Paragraph>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Rechercher un produit ou fournisseur..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected,
              ]}
              textStyle={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected,
              ]}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchbar: {
    borderRadius: 12,
    elevation: 2,
  },
  searchInput: {
    fontSize: 14,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    color: '#666',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  list: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  productImage: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productContent: {
    padding: 12,
  },
  productHeader: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFA000',
    marginRight: 2,
  },
  reviews: {
    fontSize: 10,
    color: '#666',
  },
  originBadge: {
    backgroundColor: '#E8F5E9',
    color: theme.colors.primary,
    fontSize: 10,
    alignSelf: 'flex-start',
  },
  supplierName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginRight: 4,
  },
  unit: {
    fontSize: 12,
    color: '#666',
  },
  moqContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  moqLabel: {
    fontSize: 11,
    color: '#666',
  },
  moqValue: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  addButtonLabel: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});