  import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../../utils/theme';
import { SUPPLIERS } from '../../utils/data';

export default function SuppliersScreen({ navigation }) {
  const [search, setSearch] = useState('');

  const filteredSuppliers = SUPPLIERS.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  const renderSupplier = ({ item }) => (
    <TouchableOpacity 
      style={styles.supplierCard}
      onPress={() => navigation.navigate('SupplierDetail', { supplierId: item.id })}
    >
      <View style={styles.supplierHeader}>
        <View style={styles.supplierAvatar}>
          <Text style={styles.supplierEmoji}>🏭</Text>
        </View>
        <View style={styles.supplierInfo}>
          <Text style={styles.supplierName}>{item.name}</Text>
          <Text style={styles.supplierType}>{item.type}</Text>
          <Text style={styles.supplierLocation}>{item.location}</Text>
        </View>
        <View style={styles.supplierRating}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingValue}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.supplierContact}>
        <Text style={styles.contactText}>{item.phone}</Text>
        <Text style={styles.contactText}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fournisseurs</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddSupplier')}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un fournisseur..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredSuppliers}
        renderItem={renderSupplier}
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
    backgroundColor: COLORS.primary,
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
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  searchInput: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  supplierCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  supplierHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  supplierAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supplierEmoji: {
    fontSize: 24,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  supplierType: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  supplierLocation: {
    fontSize: 12,
    color: COLORS.gray,
  },
  supplierRating: {
    alignItems: 'center',
  },
  ratingStar: {
    color: '#FFD700',
    fontSize: 14,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  supplierContact: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  contactText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
});