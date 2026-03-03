 import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ==================== COULEURS ====================
const COLORS = {
  primary: '#1B5E20',
  accent: '#C49A6C',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#2D3E50',
  success: '#2A9D8F',
  warning: '#E9C46A',
  error: '#E76F51',
  gray: '#ADB5BD',
  lightGray: '#E9ECEF',
};

// ==================== DONNÉES ====================
const PRODUCTS = [
  { id: '1', name: 'Huile d\'Argan Bio', category: 'Huiles', price: 180, unit: 'L', minOrder: 12, supplier: 'Coopérative Tissaliwine', origin: 'Essaouira', image: '🥑', rating: 4.9, stock: 45 },
  { id: '2', name: 'Dattes Majhoul', category: 'Fruits secs', price: 95, unit: 'kg', minOrder: 25, supplier: 'Palmeraie Zagora', origin: 'Zagora', image: '🌴', rating: 4.8, stock: 120 },
  { id: '3', name: 'Safran de Taliouine', category: 'Épices', price: 850, unit: '10g', minOrder: 5, supplier: 'Coop. Taliouine', origin: 'Taliouine', image: '🌺', rating: 5.0, stock: 28 },
  { id: '4', name: 'Amandes de Taroudant', category: 'Noix', price: 140, unit: 'kg', minOrder: 20, supplier: 'Ferme Taroudant', origin: 'Taroudant', image: '🥜', rating: 4.7, stock: 75 },
  { id: '5', name: 'Miel d\'Eucalyptus', category: 'Miels', price: 120, unit: '500g', minOrder: 12, supplier: 'Apiculteur Ifrane', origin: 'Ifrane', image: '🍯', rating: 4.9, stock: 60 },
  { id: '6', name: 'Couscous de Fès', category: 'Céréales', price: 35, unit: 'kg', minOrder: 50, supplier: 'Minoterie Fès', origin: 'Fès', image: '🌾', rating: 4.6, stock: 150 },
];

const SUPPLIERS = [
  { id: 's1', name: 'Coopérative Tissaliwine', type: 'Huiles d\'argan', location: 'Essaouira', rating: 4.9, products: 8 },
  { id: 's2', name: 'Palmeraie Zagora', type: 'Dattes', location: 'Zagora', rating: 4.8, products: 12 },
  { id: 's3', name: 'Coop. Taliouine', type: 'Épices', location: 'Taliouine', rating: 5.0, products: 6 },
  { id: 's4', name: 'Ferme Taroudant', type: 'Amandes', location: 'Taroudant', rating: 4.7, products: 5 },
];

const ORDERS = [
  { id: 'CMD001', date: '2026-03-01', supplier: 'Coopérative Tissaliwine', total: 2160, status: 'preparing', items: ['Huile d\'Argan x12'] },
  { id: 'CMD002', date: '2026-02-28', supplier: 'Palmeraie Zagora', total: 2375, status: 'shipped', items: ['Dattes Majhoul x25kg'] },
  { id: 'CMD003', date: '2026-02-27', supplier: 'Coop. Taliouine', total: 4250, status: 'delivered', items: ['Safran x5', 'Amandes x20kg'] },
];

// ==================== LOGIN SCREEN ====================
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('demo@client.ma');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState('client');

  const handleLogin = () => {
    if (role === 'client') {
      navigation.replace('ClientTabs');
    } else {
      navigation.replace('SupplierTabs');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.loginHeader}>
          <Text style={styles.logo}>🇲🇦</Text>
          <Text style={styles.appTitle}>Smart Supply</Text>
          <Text style={styles.appSubtitle}>Gestion de la Chaîne d'Approvisionnement</Text>
        </View>

        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Welcome back</Text>
          <Text style={styles.loginSubtitle}>Sign in to your Smart Supply account</Text>

          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'client' && styles.roleButtonActive]}
              onPress={() => setRole('client')}
            >
              <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>Client</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'supplier' && styles.roleButtonActive]}
              onPress={() => setRole('supplier')}
            >
              <Text style={[styles.roleText, role === 'supplier' && styles.roleTextActive]}>Supplier</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="**********"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.signupLink}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== CLIENT DASHBOARD ====================
function ClientDashboard({ navigation }) {
  const stats = [
    { label: 'Commandes', value: '8', icon: '📦', color: COLORS.success },
    { label: 'Dépensé', value: '12,450 DH', icon: '💰', color: COLORS.warning },
    { label: 'Fournisseurs', value: '6', icon: '🏪', color: COLORS.primary },
  ];

  const quickActions = [
    { icon: 'cart-outline', label: 'Catalogue', screen: 'Catalog', color: COLORS.primary },
    { icon: 'document-text-outline', label: 'Commandes', screen: 'Orders', color: COLORS.success },
    { icon: 'people-outline', label: 'Fournisseurs', screen: 'Suppliers', color: COLORS.warning },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>khadija</Text>
            <Text style={styles.userRole}>Propriétaire de magasin</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Text style={styles.statEmoji}>{stat.icon}</Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Commandes récentes</Text>
        {ORDERS.map((order, index) => (
          <TouchableOpacity
            key={index}
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderLeft}>
                <View style={[styles.statusDot, { backgroundColor: 
                  order.status === 'preparing' ? COLORS.warning :
                  order.status === 'shipped' ? COLORS.success :
                  COLORS.gray
                }]} />
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderSupplier}>{order.supplier}</Text>
                </View>
              </View>
              <Text style={styles.orderTotal}>{order.total} DH</Text>
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.orderItems}>{order.items.join(' • ')}</Text>
              <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== CATALOG SCREEN ====================
function CatalogScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');

  const categories = ['Tous', 'Huiles', 'Fruits secs', 'Épices', 'Noix', 'Miels', 'Céréales'];

  const filteredProducts = PRODUCTS.filter(p => 
    (category === 'Tous' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.supplier.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.catalogHeader}>
        <Text style={styles.headerTitle}>Catalogue Fournisseurs</Text>
        <Text style={styles.headerSubtitle}>{filteredProducts.length} produits disponibles</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.productsList}>
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetail', { product })}
            >
              <View style={styles.productEmojiContainer}>
                <Text style={styles.productEmoji}>{product.image}</Text>
              </View>
              <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
              <Text style={styles.productSupplier}>{product.supplier}</Text>
              <View style={styles.productPriceRow}>
                <Text style={styles.productPrice}>{product.price} DH</Text>
                <Text style={styles.productUnit}>/{product.unit}</Text>
              </View>
              <TouchableOpacity style={styles.productAddButton}>
                <Ionicons name="add" size={20} color="#FFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== ORDERS SCREEN ====================
function OrdersScreen({ navigation }) {
  const [filter, setFilter] = useState('all');

  const filters = [
    { value: 'all', label: 'Toutes' },
    { value: 'preparing', label: 'En prép.' },
    { value: 'shipped', label: 'Expédiées' },
    { value: 'delivered', label: 'Livrées' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ordersHeader}>
        <Text style={styles.headerTitle}>Mes Commandes</Text>
        <Text style={styles.headerSubtitle}>{ORDERS.length} commande(s)</Text>
      </View>

      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterButton, filter === f.value && styles.filterButtonActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.ordersList}>
        {ORDERS.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCardLarge}
            onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
          >
            <View style={styles.orderLargeHeader}>
              <View>
                <Text style={styles.orderLargeId}>{order.id}</Text>
                <Text style={styles.orderLargeSupplier}>{order.supplier}</Text>
              </View>
              <View style={[styles.orderLargeStatus, { backgroundColor: 
                order.status === 'preparing' ? COLORS.warning + '20' :
                order.status === 'shipped' ? COLORS.success + '20' :
                COLORS.gray + '20'
              }]}>
                <Text style={[styles.orderLargeStatusText, { color: 
                  order.status === 'preparing' ? COLORS.warning :
                  order.status === 'shipped' ? COLORS.success :
                  COLORS.gray
                }]}>
                  {order.status === 'preparing' ? 'En préparation' :
                   order.status === 'shipped' ? 'Expédiée' : 'Livrée'}
                </Text>
              </View>
            </View>
            <Text style={styles.orderLargeItems}>{order.items.join(' • ')}</Text>
            <View style={styles.orderLargeFooter}>
              <Text style={styles.orderLargeDate}>{new Date(order.date).toLocaleDateString()}</Text>
              <Text style={styles.orderLargeTotal}>{order.total} DH</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== PROFILE SCREEN ====================
function ProfileScreen({ navigation }) {
  const user = {
    name: 'khadija',
    email: 'khadija@gmail.ma',
    phone: '+212 6 12 34 56 78',
    company: 'Smart Supply',
    memberSince: 'Janvier 2026',
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Informations personnelles' },
    { icon: 'location-outline', label: 'Adresses de livraison' },
    { icon: 'card-outline', label: 'Méthodes de paiement' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'help-circle-outline', label: 'Centre d\'aide' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>👤</Text>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <View style={styles.profileBadge}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.accent} />
            <Text style={styles.profileBadgeText}>Membre depuis {user.memberSince}</Text>
          </View>
        </View>

        <View style={styles.profileInfoCard}>
          <View style={styles.profileInfoRow}>
            <Ionicons name="call-outline" size={20} color={COLORS.accent} />
            <Text style={styles.profileInfoText}>{user.phone}</Text>
          </View>
          <View style={styles.profileInfoDivider} />
          <View style={styles.profileInfoRow}>
            <Ionicons name="business-outline" size={20} color={COLORS.accent} />
            <Text style={styles.profileInfoText}>{user.company}</Text>
          </View>
        </View>

        <View style={styles.profileMenu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.profileMenuItem}>
              <View style={styles.profileMenuLeft}>
                <Ionicons name={item.icon} size={22} color={COLORS.accent} />
                <Text style={styles.profileMenuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Smart Supply v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== ORDER DETAIL SCREEN ====================
function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const order = ORDERS.find(o => o.id === orderId) || ORDERS[0];

  const tracking = [
    { status: 'Commande validée', date: '2026-03-01 10:30', completed: true },
    { status: 'En préparation', date: '2026-03-02 14:20', completed: order.status !== 'preparing' },
    { status: 'Expédiée', date: '2026-03-03 09:15', completed: order.status === 'shipped' || order.status === 'delivered' },
    { status: 'Livrée', date: 'Estimée 2026-03-05', completed: order.status === 'delivered' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.detailHeader}>
          <Text style={styles.detailOrderId}>{order.id}</Text>
          <View style={[styles.detailStatusBadge, { backgroundColor: 
            order.status === 'preparing' ? COLORS.warning + '20' :
            order.status === 'shipped' ? COLORS.success + '20' :
            COLORS.gray + '20'
          }]}>
            <Text style={[styles.detailStatusText, { color: 
              order.status === 'preparing' ? COLORS.warning :
              order.status === 'shipped' ? COLORS.success :
              COLORS.gray
            }]}>
              {order.status === 'preparing' ? 'En préparation' :
               order.status === 'shipped' ? 'Expédiée' : 'Livrée'}
            </Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Informations</Text>
          <View style={styles.detailInfoRow}>
            <Ionicons name="business-outline" size={18} color={COLORS.gray} />
            <Text style={styles.detailInfoLabel}>Fournisseur:</Text>
            <Text style={styles.detailInfoValue}>{order.supplier}</Text>
          </View>
          <View style={styles.detailInfoRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.gray} />
            <Text style={styles.detailInfoLabel}>Date:</Text>
            <Text style={styles.detailInfoValue}>{new Date(order.date).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Articles</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.detailItemRow}>
              <Text style={styles.detailItemName}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Suivi de commande</Text>
          {tracking.map((step, index) => (
            <View key={index} style={styles.trackingItem}>
              <View style={[styles.trackingDot, step.completed && styles.trackingDotCompleted]} />
              <View style={styles.trackingContent}>
                <Text style={[styles.trackingStatus, step.completed && styles.trackingStatusCompleted]}>
                  {step.status}
                </Text>
                <Text style={styles.trackingDate}>{step.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.detailTotal}>
          <Text style={styles.detailTotalLabel}>Total</Text>
          <Text style={styles.detailTotalValue}>{order.total} DH</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== SUPPLIER DASHBOARD ====================
function SupplierDashboard({ navigation }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#A23B72' }]}>
      <View style={styles.supplierHeader}>
        <Text style={styles.supplierTitle}>🏭 Tableau de Bord</Text>
        <Text style={styles.supplierSubtitle}>Coopérative Tissaliwine</Text>
      </View>
      <View style={styles.supplierContent}>
        <TouchableOpacity 
          style={styles.supplierCard}
          onPress={() => navigation.navigate('Stocks')}
        >
          <Ionicons name="cube-outline" size={32} color="#A23B72" />
          <Text style={styles.supplierCardText}>Gestion des Stocks</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.supplierCard}
          onPress={() => navigation.navigate('SupplierOrders')}
        >
          <Ionicons name="document-text-outline" size={32} color="#A23B72" />
          <Text style={styles.supplierCardText}>Commandes reçues</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ==================== NAVIGATION ====================

function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Accueil') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Catalogue') iconName = focused ? 'grid' : 'grid-outline';
          if (route.name === 'Commandes') iconName = focused ? 'document-text' : 'document-text-outline';
          if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={ClientDashboard} />
      <Tab.Screen name="Catalogue" component={CatalogScreen} />
      <Tab.Screen name="Commandes" component={OrdersScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function SupplierTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Accueil') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Stocks') iconName = focused ? 'cube' : 'cube-outline';
          if (route.name === 'Commandes') iconName = focused ? 'document-text' : 'document-text-outline';
          if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A23B72',
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={SupplierDashboard} />
      <Tab.Screen name="Stocks" component={CatalogScreen} />
      <Tab.Screen name="Commandes" component={OrdersScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ==================== APP PRINCIPALE ====================
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ClientTabs" component={ClientTabs} />
        <Stack.Screen name="SupplierTabs" component={SupplierTabs} />
        <Stack.Screen 
          name="OrderDetail" 
          component={OrderDetailScreen}
          options={{
            headerShown: true,
            title: 'Détail Commande',
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: '#FFF',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loginHeader: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  logo: {
    fontSize: 48,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loginCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    elevation: 4,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  roleSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 4,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  roleButtonActive: {
    backgroundColor: COLORS.surface,
    elevation: 2,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray,
  },
  roleTextActive: {
    color: COLORS.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 14,
  },
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    height: 65,
    paddingBottom: 10,
    paddingTop: 8,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userRole: {
    fontSize: 12,
    color: COLORS.gray,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: width / 3.3,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statEmoji: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  actionCard: {
    alignItems: 'center',
    width: 100,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: COLORS.text,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    color: COLORS.text,
  },
  orderSupplier: {
    fontSize: 12,
    color: COLORS.gray,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  orderFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  orderItems: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.gray,
  },
  catalogHeader: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 14,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.text,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  productsList: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  productCard: {
    backgroundColor: COLORS.surface,
    width: (width - 36) / 2,
    marginHorizontal: 6,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    elevation: 2,
  },
  productEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  productEmoji: {
    fontSize: 30,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  productSupplier: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 8,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  productUnit: {
    fontSize: 11,
    color: COLORS.gray,
    marginLeft: 2,
  },
  productAddButton: {
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  ordersHeader: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  filterTextActive: {
    color: '#FFF',
  },
  ordersList: {
    padding: 16,
  },
  orderCardLarge: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },
  orderLargeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderLargeId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderLargeSupplier: {
    fontSize: 12,
    color: COLORS.gray,
  },
  orderLargeStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderLargeStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  orderLargeItems: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 12,
  },
  orderLargeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  orderLargeDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  orderLargeTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  profileBadgeText: {
    fontSize: 12,
    color: COLORS.accent,
    marginLeft: 4,
  },
  profileInfoCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 20,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  profileInfoText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
  },
  profileInfoDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 8,
  },
  profileMenu: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    padding: 8,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 20,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  profileMenuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileMenuLabel: {
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.error + '10',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  detailOrderId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  detailStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  detailStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailSection: {
    backgroundColor: COLORS.surface,
    marginTop: 16,
    padding: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  detailInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailInfoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 12,
    width: 80,
  },
  detailInfoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  detailItemRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  detailItemName: {
    fontSize: 14,
    color: COLORS.text,
  },
  trackingItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  trackingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    marginRight: 12,
    marginTop: 2,
  },
  trackingDotCompleted: {
    backgroundColor: COLORS.success,
  },
  trackingContent: {
    flex: 1,
  },
  trackingStatus: {
    fontSize: 15,
    color: COLORS.gray,
    marginBottom: 4,
  },
  trackingStatusCompleted: {
    color: COLORS.text,
    fontWeight: '500',
  },
  trackingDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  detailTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginTop: 16,
    marginBottom: 30,
    padding: 20,
  },
  detailTotalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray,
  },
  detailTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  supplierHeader: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#A23B72',
  },
  supplierTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  supplierSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  supplierContent: {
    flex: 1,
    padding: 20,
  },
  supplierCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  supplierCardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#A23B72',
    marginTop: 12,
  },
});