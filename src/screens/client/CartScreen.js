import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  IconButton,
  Divider,
  Badge,
  Dialog,
  Portal,
  RadioButton,
} from 'react-native-paper';
import { theme } from '../../utils/constants';
import { MOROCCAN_PRODUCTS } from '../../utils/constants';

export default function CartScreen({ navigation, route }) {
  const [cart, setCart] = useState(route.params?.cart || {});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const products = MOROCCAN_PRODUCTS;

  const updateQuantity = (productId, change) => {
    const product = products.find(p => p.id === productId);
    const currentQuantity = cart[productId] || 0;
    const newQuantity = currentQuantity + change;

    if (newQuantity > product.stock) {
      Alert.alert('Stock insuffisant', `Stock disponible: ${product.stock} ${product.unit}`);
      return;
    }

    if (newQuantity <= 0) {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
    } else {
      setCart(prev => ({ ...prev, [productId]: newQuantity }));
    }
  };

  const removeItem = (productId) => {
    Alert.alert(
      'Supprimer l\'article',
      'Voulez-vous retirer ce produit du panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => {
            const newCart = { ...cart };
            delete newCart[productId];
            setCart(newCart);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getCartItems = () => {
    return Object.entries(cart).map(([id, quantity]) => {
      const product = products.find(p => p.id === id);
      return { ...product, quantity };
    }).filter(item => item.name);
  };

  const getTotal = () => {
    return getCartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const groupBySupplier = () => {
    const items = getCartItems();
    const grouped = {};

    items.forEach(item => {
      if (!grouped[item.supplierId]) {
        grouped[item.supplierId] = {
          supplierName: item.supplierName,
          items: [],
          subtotal: 0,
        };
      }
      grouped[item.supplierId].items.push(item);
      grouped[item.supplierId].subtotal += item.price * item.quantity;
    });

    return grouped;
  };

  const handleCheckout = () => {
    setDialogVisible(true);
  };

  const confirmOrder = () => {
    setDialogVisible(false);
    
    Alert.alert(
      'Commande confirmée !',
      'Votre commande a été transmise aux fournisseurs.\n\nVous recevrez une notification dès qu\'elle sera validée.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const cartItems = getCartItems();
  const groupedOrders = groupBySupplier();

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Title style={styles.emptyTitle}>Votre panier est vide</Title>
        <Paragraph style={styles.emptyText}>
          Parcourez notre catalogue et ajoutez des produits
        </Paragraph>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Catalog')}
          style={styles.shopButton}
          labelStyle={styles.shopButtonLabel}
        >
          Découvrir le catalogue
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Mon Panier</Title>
          <Paragraph style={styles.headerSubtitle}>
            {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
          </Paragraph>
        </View>

        {Object.entries(groupedOrders).map(([supplierId, group]) => (
          <Card key={supplierId} style={styles.supplierCard}>
            <Card.Content>
              <View style={styles.supplierHeader}>
                <View>
                  <Title style={styles.supplierName}>{group.supplierName}</Title>
                  <Text style={styles.supplierSubtotal}>
                    Sous-total: {group.subtotal} DH
                  </Text>
                </View>
                <Badge style={styles.supplierBadge}>
                  {group.items.length} produit{group.items.length > 1 ? 's' : ''}
                </Badge>
              </View>

              <Divider style={styles.divider} />

              {group.items.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.cartItem}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>{item.price} DH/{item.unit}</Text>
                    </View>

                    <View style={styles.itemActions}>
                      <View style={styles.quantityControls}>
                        <IconButton
                          icon="minus"
                          size={16}
                          onPress={() => updateQuantity(item.id, -1)}
                          style={styles.quantityButton}
                        />
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <IconButton
                          icon="plus"
                          size={16}
                          onPress={() => updateQuantity(item.id, 1)}
                          style={styles.quantityButton}
                          disabled={item.quantity >= item.stock}
                        />
                      </View>
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => removeItem(item.id)}
                        iconColor="#F44336"
                      />
                    </View>
                  </View>
                  {index < group.items.length - 1 && <Divider style={styles.itemDivider} />}
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Récapitulatif</Title>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>{getTotal()} DH</Text>
            </View>
            
            <Divider style={styles.summaryDivider} />
            
            <View style={styles.totalRow}>
              <Title style={styles.totalLabel}>Total</Title>
              <Title style={styles.totalValue}>{getTotal()} DH</Title>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>📝 Informations</Text>
            <Paragraph style={styles.infoText}>
              • La commande sera divisée en plusieurs sous-commandes
            </Paragraph>
            <Paragraph style={styles.infoText}>
              • Vous recevrez une notification à chaque changement
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerTotal}>
            <Text style={styles.footerTotalLabel}>Total</Text>
            <Title style={styles.footerTotalValue}>{getTotal()} DH</Title>
          </View>
          <Button
            mode="contained"
            onPress={handleCheckout}
            style={styles.checkoutButton}
            labelStyle={styles.checkoutButtonLabel}
          >
            Commander ({cartItems.length})
          </Button>
        </View>
      </View>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
          <Dialog.Title>Confirmer la commande</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogText}>
              Total: {getTotal()} DH
            </Paragraph>
            
            <Text style={styles.dialogSubtitle}>Mode de paiement</Text>
            <RadioButton.Group onValueChange={setPaymentMethod} value={paymentMethod}>
              <RadioButton.Item label="Espèces à la livraison" value="cash" />
              <RadioButton.Item label="Carte bancaire" value="card" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Annuler</Button>
            <Button mode="contained" onPress={confirmOrder} style={styles.dialogButton}>
              Confirmer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
  },
  shopButtonLabel: {
    color: '#FFFFFF',
  },
  supplierCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  supplierSubtotal: {
    fontSize: 14,
    color: '#666',
  },
  supplierBadge: {
    backgroundColor: theme.colors.accent,
    color: '#FFFFFF',
  },
  divider: {
    marginVertical: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  quantityButton: {
    backgroundColor: '#F5F5F5',
    margin: 0,
    width: 32,
    height: 32,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  itemDivider: {
    marginTop: 8,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  summaryDivider: {
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFF8E1',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8F00',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 8,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTotal: {
    flexDirection: 'column',
  },
  footerTotalLabel: {
    fontSize: 12,
    color: '#666',
  },
  footerTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  checkoutButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: 8,
  },
  checkoutButtonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialog: {
    borderRadius: 16,
  },
  dialogText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 16,
  },
  dialogSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  dialogButton: {
    backgroundColor: theme.colors.primary,
  },
});