import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  Modal,
  Image,
  RefreshControl,
  Platform,
  Share,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Animated,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// ==================== THEME ====================
const theme = {
  primary: '#1E3A8A',
  primaryLight: '#3B82F6',
  primaryDark: '#1E40AF',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  shadow: '#000000',
};

// ==================== IMAGES ====================
const productImages = {
  'Jus d\'orange Jaouda': require('./src/assets/images/jus.png'),
  'Lait Safi': require('./src/assets/images/lait.png'),
  'Pain de mie complet': require('./src/assets/images/pain.png'),
  'Coca-Cola': require('./src/assets/images/oulmes.png'),
  'Café': require('./src/assets/images/sucrecafe.png'),
  'Thé': require('./src/assets/images/sucrethe.png'),
  'Couscous': require('./src/assets/images/couscous.png'),
};

// ==================== PRODUITS ====================
const initialProducts = [
  { id: '1', name: 'Jus d\'orange Jaouda', description: 'Jus d\'orange frais 1L', price: 12.00, quantity: 150, supplierId: 'supp1', supplierName: 'Jaouda Distribution', image: productImages['Jus d\'orange Jaouda'], category: 'Boissons', alertThreshold: 20, rating: 4.5 },
  { id: '2', name: 'Lait Safi', description: 'Lait pasteurisé 1L', price: 8.50, quantity: 80, supplierId: 'supp1', supplierName: 'Jaouda Distribution', image: productImages['Lait Safi'], category: 'Produits Laitiers', alertThreshold: 15, rating: 4.2 },
  { id: '3', name: 'Pain de mie complet', description: 'Pain de mie complet 500g', price: 6.00, quantity: 45, supplierId: 'supp2', supplierName: 'Boulangerie Moderne', image: productImages['Pain de mie complet'], category: 'Boulangerie', alertThreshold: 10, rating: 4.7 },
  { id: '4', name: 'Coca-Cola', description: 'Canette 33cl', price: 5.00, quantity: 200, supplierId: 'supp3', supplierName: 'Coca-Cola Maroc', image: productImages['Coca-Cola'], category: 'Boissons', alertThreshold: 30, rating: 4.8 },
  { id: '5', name: 'Café', description: 'Café moulu 250g', price: 25.00, quantity: 60, supplierId: 'supp4', supplierName: 'Café Maroc', image: productImages['Café'], category: 'Épicerie', alertThreshold: 10, rating: 4.6 },
  { id: '6', name: 'Thé', description: 'Thé vert 200g', price: 15.00, quantity: 100, supplierId: 'supp5', supplierName: 'Thé Marocain', image: productImages['Thé'], category: 'Boissons', alertThreshold: 20, rating: 4.4 },
  { id: '7', name: 'Couscous', description: 'Couscous fin 1kg', price: 18.00, quantity: 90, supplierId: 'supp6', supplierName: 'Couscous El Bahja', image: productImages['Couscous'], category: 'Épicerie', alertThreshold: 15, rating: 4.9 },
];

// ==================== FOURNISSEURS ====================
const initialSuppliers = [
  { id: 'supp1', name: 'Jaouda Distribution', email: 'jaouda@smart.ma', password: '123456', phone: '+212 522 33 44 55', address: 'Casablanca, Maroc', rating: 4.5, totalRatings: 128, description: 'Leader de la distribution alimentaire au Maroc' },
  { id: 'supp2', name: 'Boulangerie Moderne', email: 'boulangerie@smart.ma', password: '123456', phone: '+212 522 33 44 56', address: 'Rabat, Maroc', rating: 4.2, totalRatings: 87, description: 'Pains frais et viennoiseries artisanales' },
  { id: 'supp3', name: 'Coca-Cola Maroc', email: 'cocacola@smart.ma', password: '123456', phone: '+212 522 66 77 88', address: 'Casablanca, Maroc', rating: 4.8, totalRatings: 215, description: 'Boissons rafraîchissantes' },
  { id: 'supp4', name: 'Café Maroc', email: 'cafe@smart.ma', password: '123456', phone: '+212 522 11 22 33', address: 'Casablanca, Maroc', rating: 4.6, totalRatings: 156, description: 'Cafés et thés de qualité supérieure' },
  { id: 'supp5', name: 'Thé Marocain Premium', email: 'the@smart.ma', password: '123456', phone: '+212 522 44 55 66', address: 'Marrakech, Maroc', rating: 4.5, totalRatings: 98, description: 'Thés verts et menthe de la vallée' },
  { id: 'supp6', name: 'Couscous El Bahja', email: 'couscous@smart.ma', password: '123456', phone: '+212 522 77 88 99', address: 'Fès, Maroc', rating: 4.9, totalRatings: 342, description: 'Semoules et couscous traditionnels' },
];

// ==================== STORAGE KEYS ====================
const STORAGE_KEYS = {
  USERS: 'smart_users',
  ORDERS: 'smart_orders',
  PRODUCTS: 'smart_products',
  SUPPLIERS: 'smart_suppliers',
  NOTIFICATIONS: 'smart_notifications',
  CHAT_MESSAGES: 'smart_chat_messages',
};

// ==================== SERVICES ====================
class NotificationService {
  static async send(userId, title, message, type, data = {}) {
    const notifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let all = notifications ? JSON.parse(notifications) : [];
    const newNotification = {
      id: Date.now().toString(), userId, title, message, type, data,
      read: false, timestamp: new Date().toISOString(),
    };
    all.push(newNotification);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    Vibration.vibrate(100);
    return newNotification;
  }
  
  static async get(userId) {
    const notifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all = notifications ? JSON.parse(notifications) : [];
    return all.filter(n => n.userId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
  
  static async markRead(id) {
    const notifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all = notifications ? JSON.parse(notifications) : [];
    const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }
}

class ChatService {
  static async send(senderId, senderName, receiverId, receiverName, text) {
    const message = {
      id: Date.now().toString(), text, senderId, senderName, receiverId, receiverName,
      timestamp: new Date().toISOString(), read: false,
    };
    const messages = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    const all = messages ? JSON.parse(messages) : [];
    all.push(message);
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(all));
    await NotificationService.send(receiverId, 'Nouveau message', `${senderName}: ${text.substring(0, 50)}`, 'message');
    return message;
  }
  
  static async get(userId, otherId) {
    const messages = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    const all = messages ? JSON.parse(messages) : [];
    return all.filter(m => (m.senderId === userId && m.receiverId === otherId) || (m.senderId === otherId && m.receiverId === userId))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
  
  static async getConversations(userId) {
    const messages = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    const all = messages ? JSON.parse(messages) : [];
    const userMessages = all.filter(m => m.senderId === userId || m.receiverId === userId);
    const convs = new Map();
    userMessages.forEach(msg => {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const otherName = msg.senderId === userId ? msg.receiverName : msg.senderName;
      if (!convs.has(otherId) || new Date(msg.timestamp) > new Date(convs.get(otherId).lastMessageTime)) {
        convs.set(otherId, { id: otherId, name: otherName, lastMessage: msg.text, lastMessageTime: msg.timestamp, unread: msg.receiverId === userId && !msg.read ? 1 : 0 });
      }
    });
    return Array.from(convs.values());
  }
}

// ==================== COMPOSANT PRINCIPAL ====================
const App = () => {
  const [userRole, setUserRole] = useState('client');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { initializeData(); checkLoginStatus(); }, []);

  const initializeData = async () => {
    try {
      const products = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!products) await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      const suppliers = await AsyncStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (!suppliers) await AsyncStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(initialSuppliers));
      const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      if (!users) await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
      const orders = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!orders) await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    } catch (error) { console.error(error); }
  };

  const checkLoginStatus = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('currentUser');
      const savedRole = await AsyncStorage.getItem('userRole');
      if (savedUser && savedRole) {
        setCurrentUser(JSON.parse(savedUser));
        setUserRole(savedRole);
        setIsLoggedIn(true);
      }
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  };

  const handleLogin = async (role, user) => {
    setUserRole(role);
    setCurrentUser(user);
    setIsLoggedIn(true);
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    await AsyncStorage.setItem('userRole', role);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    await AsyncStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.splashTitle}>Smart Supply</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              'Accueil': 'home', 'Commandes': 'shopping-cart', 'Catalogue': 'store',
              'Fournisseurs': 'people', 'Profil': 'person', 'Gestion': 'inventory',
              'Stock': 'inventory', 'Messages': 'chat'
            };
            return <Icon name={icons[route.name]} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarStyle: styles.tabBar,
          headerShown: false,
        })}
      >
        {userRole === 'client' ? (
          <>
            <Tab.Screen name="Accueil">{() => <ClientHomeScreen user={currentUser} />}</Tab.Screen>
            <Tab.Screen name="Commandes">{() => <ClientOrdersScreen user={currentUser} />}</Tab.Screen>
            <Tab.Screen name="Catalogue">{() => <ClientProductsScreen user={currentUser} />}</Tab.Screen>
            <Tab.Screen name="Fournisseurs">{() => <ClientSuppliersScreen user={currentUser} />}</Tab.Screen>
            <Tab.Screen name="Messages">{() => <ChatScreen user={currentUser} />}</Tab.Screen>
            <Tab.Screen name="Profil">{() => <ProfileScreen user={currentUser} userRole="client" onLogout={handleLogout} />}</Tab.Screen>
          </>
        ) : (
          <>
            <Tab.Screen name="Accueil">{() => <SupplierHomeScreen user={currentUser} />}</Tab.Screen>
            <Tab.Screen name="Commandes">{() => <SupplierOrdersScreen user={currentUser} />}</Tab.Screen>
            <Tab.Screen name="Gestion">{() => <SupplierProductsScreen user={currentUser} />}</Tab.Screen>
            <Tab.Screen name="Stock">{() => <SupplierStockScreen user={currentUser} />}</Tab.Screen>
            <Tab.Screen name="Messages">{() => <ChatScreen user={currentUser} />}</Tab.Screen>
            <Tab.Screen name="Profil">{() => <ProfileScreen user={currentUser} userRole="supplier" onLogout={handleLogout} />}</Tab.Screen>
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// ==================== ÉCRAN D'AUTHENTIFICATION ====================
const AuthScreen = ({ onLogin }) => {
  const [isClient, setIsClient] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Erreur', 'Veuillez remplir tous les champs'); return; }
    setIsLoading(true);
    try {
      if (isClient) {
        const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
        const allUsers = users ? JSON.parse(users) : [];
        const user = allUsers.find(u => u.email === email && u.password === password && u.role === 'client');
        if (user) onLogin('client', user);
        else Alert.alert('Erreur', 'Email ou mot de passe incorrect');
      } else {
        const suppliers = await AsyncStorage.getItem(STORAGE_KEYS.SUPPLIERS);
        const allSuppliers = suppliers ? JSON.parse(suppliers) : initialSuppliers;
        const supplier = allSuppliers.find(s => s.email === email && s.password === password);
        if (supplier) onLogin('supplier', supplier);
        else Alert.alert('Erreur', 'Email ou mot de passe incorrect\n\nComptes démo:\njaouda@smart.ma / 123456');
      }
    } catch (error) { Alert.alert('Erreur', 'Une erreur est survenue'); }
    finally { setIsLoading(false); }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !phone || !address) { Alert.alert('Erreur', 'Veuillez remplir tous les champs'); return; }
    setIsLoading(true);
    try {
      const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      let allUsers = users ? JSON.parse(users) : [];
      if (allUsers.find(u => u.email === email)) { Alert.alert('Erreur', 'Cet email est déjà utilisé'); setIsLoading(false); return; }
      const newUser = { id: Date.now().toString(), name, email, password, phone, address, role: 'client', createdAt: new Date().toISOString() };
      allUsers.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
      Alert.alert('Succès !', 'Inscription réussie !', [{ text: 'OK', onPress: () => { setShowRegister(false); setName(''); setEmail(''); setPassword(''); setPhone(''); setAddress(''); } }]);
    } catch (error) { Alert.alert('Erreur', 'Une erreur est survenue'); }
    finally { setIsLoading(false); }
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.authScroll}>
          <Animated.View style={[styles.authHeader, { opacity: fadeAnim }]}>
            <View style={styles.logoCircle}><MaterialCommunityIcons name="store-edit" size={50} color={theme.primary} /></View>
            <Text style={styles.authTitle}>Smart Supply</Text>
            <Text style={styles.authSubtitle}>Gestion intelligente de vos commandes</Text>
          </Animated.View>

          <View style={styles.roleSelector}>
            <TouchableOpacity style={[styles.roleButton, isClient && styles.roleButtonActive]} onPress={() => setIsClient(true)}>
              <Icon name="store" size={22} color={isClient ? '#FFF' : theme.textSecondary} />
              <Text style={[styles.roleText, isClient && styles.roleTextActive]}>Client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roleButton, !isClient && styles.roleButtonActive]} onPress={() => setIsClient(false)}>
              <Icon name="local-shipping" size={22} color={!isClient ? '#FFF' : theme.textSecondary} />
              <Text style={[styles.roleText, !isClient && styles.roleTextActive]}>Fournisseur</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.authCard}>
            <View style={styles.authTabSelector}>
              <TouchableOpacity style={[styles.authTab, !showRegister && styles.authTabActive]} onPress={() => setShowRegister(false)}>
                <Text style={[styles.authTabText, !showRegister && styles.authTabTextActive]}>Connexion</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.authTab, showRegister && styles.authTabActive]} onPress={() => setShowRegister(true)}>
                <Text style={[styles.authTabText, showRegister && styles.authTabTextActive]}>Inscription</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.authForm}>
              {showRegister && <TextInput style={styles.authInput} placeholder="Nom complet" value={name} onChangeText={setName} />}
              <TextInput style={styles.authInput} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
              <TextInput style={styles.authInput} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
              {showRegister && (
                <>
                  <TextInput style={styles.authInput} placeholder="Téléphone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                  <TextInput style={styles.authInput} placeholder="Adresse" value={address} onChangeText={setAddress} />
                </>
              )}
              <TouchableOpacity style={styles.authButton} onPress={showRegister ? handleRegister : handleLogin} disabled={isLoading}>
                <Text style={styles.authButtonText}>{isLoading ? 'Chargement...' : (showRegister ? 'Créer mon compte' : 'Se connecter')}</Text>
              </TouchableOpacity>
            </View>

            {!showRegister && !isClient && (
              <View style={styles.demoCard}>
                <Text style={styles.demoTitle}>🔑 Comptes démo fournisseurs</Text>
                <Text style={styles.demoText}>jaouda@smart.ma / 123456</Text>
                <Text style={styles.demoText}>boulangerie@smart.ma / 123456</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ==================== ÉCRAN CLIENT - ACCUEIL ====================
const ClientHomeScreen = ({ user }) => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, totalSpent: 0 });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); loadNotifications(); }, []);

  const loadData = async () => {
    const savedOrders = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    const savedProducts = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let allOrders = savedOrders ? JSON.parse(savedOrders) : [];
    let allProducts = savedProducts ? JSON.parse(savedProducts) : initialProducts;
    const userOrders = allOrders.filter(order => order.clientId === user.id);
    const totalSpent = userOrders.filter(o => o.status === 'Livrée').reduce((sum, o) => sum + o.total, 0);
    setStats({ totalOrders: userOrders.length, pendingOrders: userOrders.filter(o => o.status === 'En attente de validation').length, deliveredOrders: userOrders.filter(o => o.status === 'Livrée').length, totalSpent });
  };

  const loadNotifications = async () => setNotifications(await NotificationService.get(user.id));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}>
        <View style={styles.headerWelcome}>
          <View><Text style={styles.welcomeText}>Bonjour,</Text><Text style={styles.userName}>{user.name}</Text><View style={styles.userBadge}><Text style={styles.userBadgeText}>Client Premium</Text></View></View>
          <TouchableOpacity onPress={() => setShowNotifications(true)} style={styles.notifButton}><Icon name="notifications" size={28} color={theme.text} /><View style={styles.notifBadge}>{unreadCount > 0 && <Text style={styles.notifBadgeText}>{unreadCount}</Text>}</View></TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: theme.primary }]}><Icon name="shopping-cart" size={24} color="#FFF" /></View><Text style={styles.statNumber}>{stats.totalOrders}</Text><Text style={styles.statLabel}>Commandes</Text></View>
          <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: theme.warning }]}><Icon name="pending" size={24} color="#FFF" /></View><Text style={styles.statNumber}>{stats.pendingOrders}</Text><Text style={styles.statLabel}>En attente</Text></View>
          <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: theme.success }]}><Icon name="check-circle" size={24} color="#FFF" /></View><Text style={styles.statNumber}>{stats.deliveredOrders}</Text><Text style={styles.statLabel}>Livrées</Text></View>
          <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: theme.info }]}><Icon name="attach-money" size={24} color="#FFF" /></View><Text style={styles.statNumber}>{stats.totalSpent.toFixed(0)} DH</Text><Text style={styles.statLabel}>Total dépensé</Text></View>
        </View>

        <Text style={styles.sectionTitle}>⭐ Recommandés pour vous</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendScroll}>
          {products.slice(0, 6).map(product => (
            <View key={product.id} style={styles.recommendCard}><Image source={product.image} style={styles.recommendImage} /><Text style={styles.recommendName}>{product.name}</Text><Text style={styles.recommendPrice}>{product.price.toFixed(2)} DH</Text></View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>⚡ Actions rapides</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Catalogue')}><View style={[styles.quickIcon, { backgroundColor: theme.primary }]}><Icon name="add-shopping-cart" size={28} color="#FFF" /></View><Text style={styles.quickText}>Commander</Text></TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Messages')}><View style={[styles.quickIcon, { backgroundColor: theme.info }]}><Icon name="chat" size={28} color="#FFF" /></View><Text style={styles.quickText}>Messages</Text></TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Commandes')}><View style={[styles.quickIcon, { backgroundColor: theme.success }]}><Icon name="receipt" size={28} color="#FFF" /></View><Text style={styles.quickText}>Commandes</Text></TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showNotifications} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Notifications</Text><TouchableOpacity onPress={() => setShowNotifications(false)}><Icon name="close" size={24} color={theme.text} /></TouchableOpacity></View>
            <FlatList data={notifications} keyExtractor={i => i.id} renderItem={({ item }) => (
              <TouchableOpacity style={[styles.notifItem, !item.read && styles.notifUnread]} onPress={() => NotificationService.markRead(item.id)}>
                <View style={styles.notifIcon}><Icon name={item.type === 'order' ? 'shopping-cart' : 'chat'} size={20} color={theme.primary} /></View>
                <View style={styles.notifContent}><Text style={styles.notifTitle}>{item.title}</Text><Text style={styles.notifMessage}>{item.message}</Text><Text style={styles.notifTime}>{new Date(item.timestamp).toLocaleString()}</Text></View>
              </TouchableOpacity>
            )} ListEmptyComponent={<Text style={styles.emptyNotif}>Aucune notification</Text>} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ==================== ÉCRAN CLIENT - CATALOGUE ====================
const ClientProductsScreen = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => { loadProducts(); loadCart(); }, []);

  const loadProducts = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    setProducts(saved ? JSON.parse(saved) : initialProducts);
  };
  const loadCart = async () => {
    const saved = await AsyncStorage.getItem(`cart_${user.id}`);
    setCart(saved ? JSON.parse(saved) : []);
  };
  const saveCart = async (newCart) => { setCart(newCart); await AsyncStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart)); };

  const addToCart = (product) => {
    const existing = cart.find(i => i.id === product.id);
    const newCart = existing ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) : [...cart, { ...product, quantity: 1 }];
    saveCart(newCart);
    Alert.alert('Ajouté', `${product.name} ajouté au panier`);
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) saveCart(cart.filter(i => i.id !== id));
    else saveCart(cart.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return Alert.alert('Erreur', 'Panier vide');
    const order = {
      id: Date.now().toString(), orderId: `#${Math.floor(Math.random() * 10000)}`, clientId: user.id, clientName: user.name,
      clientPhone: user.phone, clientAddress: user.address, date: new Date().toISOString(),
      status: 'En attente de validation', paymentStatus: 'Pending',
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, supplierId: i.supplierId, supplierName: i.supplierName })),
      total: total, createdAt: new Date().toISOString(),
    };
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    const all = saved ? JSON.parse(saved) : [];
    all.push(order);
    await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(all));
    const suppliers = [...new Set(cart.map(i => i.supplierId))];
    for (const sid of suppliers) await NotificationService.send(sid, 'Nouvelle commande', `Commande #${order.orderId} de ${user.name} - ${total.toFixed(2)} DH`, 'order');
    await saveCart([]);
    setShowCart(false);
    Alert.alert('Succès', `Commande ${order.orderId} créée !`);
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (category === 'all' || p.category === category));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Catalogue</Text><TouchableOpacity onPress={() => setShowCart(true)} style={styles.cartButton}><Icon name="shopping-cart" size={28} color={theme.primary} /><View style={styles.cartBadge}>{cart.length > 0 && <Text style={styles.cartBadgeText}>{cart.length}</Text>}</View></TouchableOpacity></View>

      <View style={styles.searchBar}><Icon name="search" size={20} color={theme.textMuted} /><TextInput style={styles.searchInput} placeholder="Rechercher un produit..." value={search} onChangeText={setSearch} placeholderTextColor={theme.textMuted} /></View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map(c => (<TouchableOpacity key={c} style={[styles.categoryChip, category === c && styles.categoryChipActive]} onPress={() => setCategory(c)}><Text style={[styles.categoryText, category === c && styles.categoryTextActive]}>{c === 'all' ? 'Tous' : c}</Text></TouchableOpacity>))}
      </ScrollView>

      <FlatList data={filtered} keyExtractor={i => i.id} numColumns={2} columnWrapperStyle={styles.productRow} renderItem={({ item }) => (
        <TouchableOpacity style={styles.productCard} onPress={() => { setSelected(item); setShowDetail(true); }}>
          <Image source={item.image} style={styles.productImage} />
          <View style={styles.productInfo}><Text style={styles.productName}>{item.name}</Text><Text style={styles.productPrice}>{item.price.toFixed(2)} DH</Text><Text style={styles.productStock}>Stock: {item.quantity}</Text><TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}><Text style={styles.addButtonText}>Ajouter</Text></TouchableOpacity></View>
        </TouchableOpacity>
      )} />

      <Modal visible={showDetail} transparent animationType="slide"><View style={styles.modalOverlay}><View style={styles.detailModal}><TouchableOpacity style={styles.closeButton} onPress={() => setShowDetail(false)}><Icon name="close" size={24} /></TouchableOpacity>{selected && (<><Image source={selected.image} style={styles.detailImage} /><Text style={styles.detailName}>{selected.name}</Text><Text style={styles.detailPrice}>{selected.price.toFixed(2)} DH</Text><Text style={styles.detailDesc}>{selected.description}</Text><Text style={styles.detailStock}>Stock: {selected.quantity} unités</Text><Text style={styles.detailSupplier}>Fournisseur: {selected.supplierName}</Text><TouchableOpacity style={styles.detailAddButton} onPress={() => { addToCart(selected); setShowDetail(false); }}><Text style={styles.detailAddText}>Ajouter au panier</Text></TouchableOpacity></>)}</View></View></Modal>

      <Modal visible={showCart} transparent animationType="slide"><View style={styles.modalOverlay}><View style={styles.cartModal}><View style={styles.cartHeader}><Text style={styles.cartTitle}>🛒 Mon panier</Text><TouchableOpacity onPress={() => setShowCart(false)}><Icon name="close" size={24} /></TouchableOpacity></View>{cart.length === 0 ? (<View style={styles.emptyCart}><Icon name="shopping-cart" size={60} /><Text style={styles.emptyText}>Votre panier est vide</Text></View>) : (<><FlatList data={cart} keyExtractor={i => i.id} renderItem={({ item }) => (<View style={styles.cartItem}><Image source={item.image} style={styles.cartImage} /><View style={styles.cartInfo}><Text style={styles.cartName}>{item.name}</Text><Text style={styles.cartPrice}>{item.price.toFixed(2)} DH</Text><Text style={styles.cartSupplier}>{item.supplierName}</Text></View><View style={styles.cartQuantity}><TouchableOpacity onPress={() => updateQty(item.id, item.quantity - 1)} style={styles.qtyButton}><Text style={styles.qtyButtonText}>-</Text></TouchableOpacity><Text style={styles.qtyValue}>{item.quantity}</Text><TouchableOpacity onPress={() => updateQty(item.id, item.quantity + 1)} style={styles.qtyButton}><Text style={styles.qtyButtonText}>+</Text></TouchableOpacity></View></View>)} /><View style={styles.cartFooter}><Text style={styles.cartTotal}>Total: {total.toFixed(2)} DH</Text><TouchableOpacity style={styles.orderButton} onPress={placeOrder}><Text style={styles.orderButtonText}>Passer commande</Text></TouchableOpacity></View></>)}</View></View></Modal>
    </SafeAreaView>
  );
};

// ==================== ÉCRAN CLIENT - COMMANDES AVEC FACTURE ====================
const ClientOrdersScreen = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentStep, setPaymentStep] = useState(1);
  const [cardNum, setCardNum] = useState(''), [expiry, setExpiry] = useState(''), [cvv, setCvv] = useState(''), [cardHolder, setCardHolder] = useState('');

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) setOrders(JSON.parse(saved).filter(o => o.clientId === user.id));
  };

  const handlePayment = async () => {
    if (paymentStep === 1) {
      if (!cardNum || !expiry || !cvv || !cardHolder) return Alert.alert('Erreur', 'Remplissez tous les champs');
      setPaymentStep(2);
    } else {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
      const all = JSON.parse(saved);
      const updated = all.map(o => o.id === selectedOrder.id ? { ...o, paymentStatus: 'Paid' } : o);
      await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      setShowPayment(false);
      setPaymentStep(1);
      loadOrders();
      Alert.alert('Succès', 'Paiement effectué !');
    }
  };

  const cancelOrder = async (id) => {
    const order = orders.find(o => o.id === id);
    const hours = (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60);
    if (order.status !== 'En attente de validation') return Alert.alert('Erreur', 'Commande non annulable');
    if (hours > 48) return Alert.alert('Erreur', 'Délai dépassé (48h)');
    Alert.alert('Confirmation', 'Annuler cette commande ?', [{ text: 'Non' }, { text: 'Oui', onPress: async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
      const all = JSON.parse(saved);
      const updated = all.map(o => o.id === id ? { ...o, status: 'Annulée' } : o);
      await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      loadOrders();
    } }]);
  };

  const getStatusColor = (s) => ({ 'En attente de validation': '#F59E0B', 'Validée': '#22C55E', 'En préparation': '#3B82F6', 'Expédiée': '#8B5CF6', 'Livrée': '#22C55E', 'Annulée': '#EF4444' }[s] || '#94A3B8');

  const generatePDF = async (order) => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: 'Arial', sans-serif; padding: 40px; background: #fff; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1E3A8A; padding-bottom: 20px; }
              .invoice-title { font-size: 28px; color: #1E3A8A; font-weight: bold; margin-bottom: 5px; }
              .invoice-subtitle { color: #64748B; font-size: 14px; }
              .bill-to { background: #F8FAFC; padding: 15px; border-radius: 12px; margin-bottom: 20px; }
              .bill-to h3 { color: #1E3A8A; margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th { background: #1E3A8A; color: white; padding: 12px; text-align: left; font-weight: bold; }
              td { padding: 10px; border-bottom: 1px solid #E2E8F0; }
              .total-section { text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #1E3A8A; }
              .total-amount { font-size: 24px; font-weight: bold; color: #1E3A8A; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94A3B8; }
              .status-badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: ${getStatusColor(order.status)}; color: white; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="invoice-title">SMART SUPPLY</h1>
              <p class="invoice-subtitle">Facture électronique</p>
              <p>Réf: INV-${order.id.substring(0, 8)}</p>
            </div>
            
            <div class="bill-to">
              <h3>📄 Facturé à</h3>
              <p><strong>${order.clientName}</strong><br/>
              ${order.clientAddress || 'Adresse non renseignée'}<br/>
              ${order.clientPhone || 'Téléphone non renseigné'}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p><strong>Commande N°:</strong> ${order.orderId}<br/>
              <strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}<br/>
              <strong>Statut:</strong> <span class="status-badge">${order.status}</span><br/>
              <strong>Paiement:</strong> ${order.paymentStatus === 'Paid' ? '✅ Payé' : '⏳ En attente'}</p>
            </div>
            
            <table>
              <thead>
                <tr><th>Produit</th><th>Qté</th><th>Prix unitaire</th><th>Total</th></tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr><td><strong>${item.name}</strong><br/><small>Réf: ${item.id}</small></td><td>${item.quantity}</td><td>${item.price.toFixed(2)} DH</td><td>${(item.price * item.quantity).toFixed(2)} DH</td></tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total-section">
              <p>Sous-total: ${order.total.toFixed(2)} DH</p>
              <p>TVA (0%): 0.00 DH</p>
              <p class="total-amount">Total TTC: ${order.total.toFixed(2)} DH</p>
            </div>
            
            <div class="footer">
              <p>Smart Supply - Gestion intelligente de vos commandes</p>
              <p>Merci de votre confiance !</p>
            </div>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert('Erreur', 'Impossible de générer la facture');
    }
  };

  const filtered = orders.filter(o => filter === 'all' || o.status === filter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Mes commandes</Text><Text style={styles.headerCount}>({orders.length})</Text></View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {['all', 'En attente de validation', 'Validée', 'En préparation', 'Expédiée', 'Livrée', 'Annulée'].map(s => (
          <TouchableOpacity key={s} style={[styles.filterChip, filter === s && styles.filterChipActive]} onPress={() => setFilter(s)}>
            <Text style={[styles.filterText, filter === s && styles.filterTextActive]}>{s === 'all' ? 'Tous' : s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View><Text style={styles.orderId}>{item.orderId}</Text><Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text></View>
              <View style={[styles.orderStatus, { backgroundColor: getStatusColor(item.status) }]}><Text style={styles.statusText}>{item.status}</Text></View>
            </View>
            <View style={styles.orderItems}>
              {item.items.slice(0, 2).map((p, i) => (
                <View key={i} style={styles.orderItem}><Text style={styles.orderItemName}>{p.name}</Text><Text style={styles.orderItemQty}>x{p.quantity}</Text><Text style={styles.orderItemPrice}>{(p.price * p.quantity).toFixed(2)} DH</Text></View>
              ))}
              {item.items.length > 2 && <Text style={styles.moreItems}>+{item.items.length - 2} autres produits</Text>}
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>Total: {item.total.toFixed(2)} DH</Text>
              <View style={styles.orderActions}>
                {item.paymentStatus !== 'Paid' && item.status === 'En attente de validation' && (
                  <TouchableOpacity style={styles.payButton} onPress={() => { setSelectedOrder(item); setShowPayment(true); }}><Text style={styles.actionButtonText}>Payer</Text></TouchableOpacity>
                )}
                {item.status === 'En attente de validation' && (
                  <TouchableOpacity style={styles.cancelButton} onPress={() => cancelOrder(item.id)}><Text style={styles.actionButtonText}>Annuler</Text></TouchableOpacity>
                )}
                <TouchableOpacity style={styles.pdfButton} onPress={() => generatePDF(item)}><Text style={styles.actionButtonText}>PDF</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<View style={styles.emptyState}><Icon name="receipt" size={60} color={theme.textMuted} /><Text style={styles.emptyText}>Aucune commande trouvée</Text></View>}
      />

      <Modal visible={showPayment} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModal}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>💳 Paiement sécurisé</Text><TouchableOpacity onPress={() => { setShowPayment(false); setPaymentStep(1); }}><Icon name="close" size={24} color={theme.text} /></TouchableOpacity></View>
            {paymentStep === 1 ? (
              <>
                <View style={styles.steps}><View style={[styles.stepDot, styles.stepActive]} /><View style={styles.stepLine} /><View style={styles.stepDot} /></View>
                <TextInput style={styles.paymentInput} placeholder="Numéro de carte" value={cardNum} onChangeText={setCardNum} keyboardType="numeric" maxLength={16} />
                <View style={styles.paymentRow}><TextInput style={[styles.paymentInput, { flex: 1 }]} placeholder="MM/YY" value={expiry} onChangeText={setExpiry} maxLength={5} /><TextInput style={[styles.paymentInput, { flex: 1 }]} placeholder="CVV" value={cvv} onChangeText={setCvv} secureTextEntry maxLength={4} /></View>
                <TextInput style={styles.paymentInput} placeholder="Titulaire de la carte" value={cardHolder} onChangeText={setCardHolder} />
                <Text style={styles.paymentTotal}>Montant: {selectedOrder?.total.toFixed(2)} DH</Text>
              </>
            ) : (
              <>
                <View style={styles.steps}><View style={[styles.stepDot, styles.stepActive]} /><View style={styles.stepLine} /><View style={[styles.stepDot, styles.stepActive]} /></View>
                <View style={styles.successIcon}><Icon name="check-circle" size={70} color={theme.success} /></View>
                <Text style={styles.successTitle}>Paiement réussi !</Text>
                <Text style={styles.successText}>Commande #{selectedOrder?.orderId} confirmée</Text>
              </>
            )}
            <View style={styles.modalButtons}><TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setShowPayment(false); setPaymentStep(1); }}><Text>Annuler</Text></TouchableOpacity><TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handlePayment}><Text>{paymentStep === 1 ? 'Payer' : 'Terminer'}</Text></TouchableOpacity></View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ==================== ÉCRAN CLIENT - FOURNISSEURS AVEC CHAT ====================
const ClientSuppliersScreen = ({ user }) => {
  const navigation = useNavigation();
  const [suppliers, setSuppliers] = useState([]);
  const [showRating, setShowRating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => { loadSuppliers(); }, []);

  const loadSuppliers = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    setSuppliers(saved ? JSON.parse(saved) : initialSuppliers);
  };

  const startChat = async (supplier) => {
    try {
      const existingMessages = await ChatService.getMessages(user.id, supplier.id);
      if (existingMessages.length === 0) {
        const welcomeMessage = `Bonjour ! Je suis ${supplier.name}. Comment puis-je vous aider aujourd'hui ?`;
        await ChatService.send(supplier.id, supplier.name, user.id, user.name, welcomeMessage);
      }
      navigation.navigate('Messages', { supplier: supplier });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de démarrer la conversation');
    }
  };

  const submitRating = async () => {
    if (rating === 0) return Alert.alert('Erreur', 'Sélectionnez une note');
    const updated = suppliers.map(s => s.id === selected.id ? { ...s, rating: (s.rating * s.totalRatings + rating) / (s.totalRatings + 1), totalRatings: s.totalRatings + 1 } : s);
    setSuppliers(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(updated));
    setShowRating(false);
    setRating(0);
    Alert.alert('Merci !', 'Votre note a été enregistrée');
  };

  const renderStars = (rate, onPress = null) => (
    <View style={styles.starsRow}>{[1, 2, 3, 4, 5].map(s => (<TouchableOpacity key={s} onPress={() => onPress && onPress(s)}><Icon name={s <= rate ? 'star' : 'star-border'} size={16} color="#F59E0B" /></TouchableOpacity>))}</View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Fournisseurs partenaires</Text><Text style={styles.headerCount}>({suppliers.length})</Text></View>
      <FlatList
        data={suppliers}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.supplierCard}>
            <View style={styles.supplierAvatar}><Text style={styles.avatarText}>{item.name.charAt(0)}</Text></View>
            <View style={styles.supplierInfo}>
              <Text style={styles.supplierName}>{item.name}</Text>
              <View style={styles.ratingRow}>{renderStars(item.rating)}<Text style={styles.ratingCount}>({item.totalRatings} avis)</Text></View>
              <Text style={styles.supplierContact}>{item.email}</Text>
              <Text style={styles.supplierContact}>{item.phone}</Text>
              <Text style={styles.supplierDesc}>{item.description}</Text>
            </View>
            <View style={styles.supplierActions}>
              <TouchableOpacity style={styles.chatButton} onPress={() => startChat(item)}><Icon name="chat" size={20} color="#FFF" /><Text style={styles.chatButtonText}>Contacter</Text></TouchableOpacity>
              <TouchableOpacity style={styles.ratingButton} onPress={() => { setSelected(item); setShowRating(true); }}><Icon name="star-rate" size={28} color="#F59E0B" /></TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal visible={showRating} transparent><View style={styles.modalOverlay}><View style={styles.ratingModal}><Text style={styles.modalTitle}>Noter {selected?.name}</Text><View style={styles.ratingStars}>{renderStars(rating, setRating)}</View><View style={styles.modalButtons}><TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => { setShowRating(false); setRating(0); }}><Text>Annuler</Text></TouchableOpacity><TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={submitRating}><Text>Envoyer</Text></TouchableOpacity></View></View></View></Modal>
    </SafeAreaView>
  );
};

// ==================== ÉCRAN CHAT FONCTIONNEL ====================
const ChatScreen = ({ user, route }) => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(route?.params?.supplier || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef();

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { if (activeChat) loadMessages(); }, [activeChat]);
  useFocusEffect(useCallback(() => { loadConversations(); }, []));

  const loadConversations = async () => {
    const convs = await ChatService.getConversations(user.id);
    setConversations(convs);
  };

  const loadMessages = async () => {
    const msgs = await ChatService.getMessages(user.id, activeChat.id);
    setMessages(msgs);
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msg = await ChatService.send(user.id, user.name, activeChat.id, activeChat.name, input);
    setMessages([...messages, msg]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  if (activeChat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActiveChat(null)}><Icon name="arrow-back" size={24} /></TouchableOpacity>
          <Text style={styles.chatTitle}>{activeChat.name}</Text>
          <View style={{ width: 24 }} />
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.senderId === user.id ? styles.myMessage : styles.otherMessage]}>
              <Text style={[styles.messageText, item.senderId === user.id && styles.myMessageText]}>{item.text}</Text>
              <Text style={styles.messageTime}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          )}
        />
        <View style={styles.chatInput}>
          <TextInput style={styles.chatInputField} placeholder="Écrivez votre message..." value={input} onChangeText={setInput} multiline />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}><Icon name="send" size={24} color="#FFF" /></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Messages</Text><Text style={styles.headerCount}>({conversations.length})</Text></View>
      <FlatList
        data={conversations}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.convCard} onPress={() => setActiveChat({ id: item.id, name: item.name })}>
            <View style={styles.convAvatar}><Text style={styles.convAvatarText}>{item.name.charAt(0)}</Text></View>
            <View style={styles.convInfo}><Text style={styles.convName}>{item.name}</Text><Text style={styles.convLastMsg} numberOfLines={1}>{item.lastMessage || "Aucun message"}</Text></View>
            <View style={styles.convMeta}>
              <Text style={styles.convTime}>{item.lastMessageTime ? new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</Text>
              {item.unread > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unread}</Text></View>}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="chat" size={60} color={theme.textMuted} />
            <Text style={styles.emptyText}>Aucune conversation</Text>
            <Text style={styles.emptySubText}>Contactez un fournisseur pour commencer</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// ==================== ÉCRAN PROFIL ====================
const ProfileScreen = ({ user, userRole, onLogout }) => {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({ name: user.name, email: user.email, phone: user.phone || '', address: user.address || '' });

  const updateProfile = async () => {
    if (userRole === 'client') {
      const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      let all = users ? JSON.parse(users) : [];
      all = all.map(u => u.id === user.id ? { ...u, ...data } : u);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(all));
    } else {
      const suppliers = await AsyncStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      let all = suppliers ? JSON.parse(suppliers) : [];
      all = all.map(s => s.id === user.id ? { ...s, ...data } : s);
      await AsyncStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(all));
    }
    setEditing(false);
    Alert.alert('Succès', 'Profil mis à jour');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}><Text style={styles.avatarLetter}>{user.name.charAt(0)}</Text></View>
          <Text style={styles.profileName}>{data.name}</Text>
          <View style={styles.profileBadge}><Text style={styles.profileBadgeText}>{userRole === 'client' ? 'Client Premium' : 'Fournisseur Partenaire'}</Text></View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.cardHeader}><Text style={styles.cardTitle}>Informations personnelles</Text><TouchableOpacity onPress={() => setEditing(!editing)}><Text style={styles.editText}>{editing ? 'Annuler' : 'Modifier'}</Text></TouchableOpacity></View>
          {editing ? (
            <>
              <TextInput style={styles.infoInput} placeholder="Nom complet" value={data.name} onChangeText={t => setData({ ...data, name: t })} />
              <TextInput style={styles.infoInput} placeholder="Email" value={data.email} onChangeText={t => setData({ ...data, email: t })} keyboardType="email-address" />
              <TextInput style={styles.infoInput} placeholder="Téléphone" value={data.phone} onChangeText={t => setData({ ...data, phone: t })} keyboardType="phone-pad" />
              <TextInput style={styles.infoInput} placeholder="Adresse" value={data.address} onChangeText={t => setData({ ...data, address: t })} multiline />
              <TouchableOpacity style={styles.saveButton} onPress={updateProfile}><Text style={styles.saveButtonText}>Enregistrer</Text></TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Nom</Text><Text style={styles.infoValue}>{data.name}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Email</Text><Text style={styles.infoValue}>{data.email}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Téléphone</Text><Text style={styles.infoValue}>{data.phone || 'Non renseigné'}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Adresse</Text><Text style={styles.infoValue}>{data.address || 'Non renseignée'}</Text></View>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}><Icon name="logout" size={24} color={theme.error} /><Text style={styles.logoutText}>Se déconnecter</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== ÉCRAN FOURNISSEUR - ACCUEIL ====================
const SupplierHomeScreen = ({ user }) => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, completedOrders: 0, totalRevenue: 0, lowStock: 0 });
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); loadNotifications(); }, []);

  const loadData = async () => {
    const savedOrders = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    const savedProducts = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let allOrders = savedOrders ? JSON.parse(savedOrders) : [];
    let allProducts = savedProducts ? JSON.parse(savedProducts) : initialProducts;
    const supplierOrders = allOrders.filter(o => o.items.some(i => i.supplierId === user.id));
    const supplierProducts = allProducts.filter(p => p.supplierId === user.id);
    setStats({
      totalOrders: supplierOrders.length,
      pendingOrders: supplierOrders.filter(o => o.status === 'En attente de validation').length,
      completedOrders: supplierOrders.filter(o => o.status === 'Livrée').length,
      totalRevenue: supplierOrders.filter(o => o.status === 'Livrée').reduce((s, o) => s + o.total, 0),
      lowStock: supplierProducts.filter(p => p.quantity <= p.alertThreshold).length,
    });
  };
  const loadNotifications = async () => setNotifications(await NotificationService.get(user.id));
  const unread = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}>
        <View style={styles.headerWelcome}><View><Text style={styles.welcomeText}>Bonjour,</Text><Text style={styles.userName}>{user.name}</Text><View style={styles.userBadge}><Text style={styles.userBadgeText}>Fournisseur</Text></View></View><TouchableOpacity onPress={() => setShowNotif(true)} style={styles.notifButton}><Icon name="notifications" size={28} color={theme.text} /><View style={styles.notifBadge}>{unread > 0 && <Text style={styles.notifBadgeText}>{unread}</Text>}</View></TouchableOpacity></View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: theme.primary }]}><Icon name="shopping-cart" size={24} color="#FFF" /></View><Text style={styles.statNumber}>{stats.totalOrders}</Text><Text style={styles.statLabel}>Commandes</Text></View>
          <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: theme.warning }]}><Icon name="pending" size={24} color="#FFF" /></View><Text style={styles.statNumber}>{stats.pendingOrders}</Text><Text style={styles.statLabel}>En attente</Text></View>
          <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: theme.success }]}><Icon name="check-circle" size={24} color="#FFF" /></View><Text style={styles.statNumber}>{stats.completedOrders}</Text><Text style={styles.statLabel}>Livrées</Text></View>
          <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: theme.info }]}><Icon name="attach-money" size={24} color="#FFF" /></View><Text style={styles.statNumber}>{stats.totalRevenue.toFixed(0)} DH</Text><Text style={styles.statLabel}>Chiffre d'affaires</Text></View>
        </View>

        {stats.lowStock > 0 && (<View style={styles.alertBanner}><Icon name="warning" size={20} color="#FFF" /><Text style={styles.alertText}>⚠️ {stats.lowStock} produit(s) en stock critique</Text></View>)}

        <Text style={styles.sectionTitle}>⚡ Actions rapides</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Gestion')}><View style={[styles.quickIcon, { backgroundColor: theme.primary }]}><Icon name="add" size={28} color="#FFF" /></View><Text style={styles.quickText}>Ajouter produit</Text></TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Stock')}><View style={[styles.quickIcon, { backgroundColor: theme.info }]}><Icon name="inventory" size={28} color="#FFF" /></View><Text style={styles.quickText}>Gérer stock</Text></TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Commandes')}><View style={[styles.quickIcon, { backgroundColor: theme.success }]}><Icon name="receipt" size={28} color="#FFF" /></View><Text style={styles.quickText}>Commandes</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== ÉCRAN FOURNISSEUR - COMMANDES ====================
const SupplierOrdersScreen = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved) {
      const allOrders = JSON.parse(saved);
      const supplierOrders = allOrders.filter(o => o.items.some(i => i.supplierId === user.id));
      setOrders(supplierOrders);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    const all = JSON.parse(saved);
    const order = all.find(o => o.id === id);
    const updated = all.map(o => {
      if (o.id === id) {
        if (newStatus === 'Validée') updateStock(order);
        return { ...o, status: newStatus };
      }
      return o;
    });
    await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    loadOrders();
    await NotificationService.send(order.clientId, `Commande ${newStatus}`, `Votre commande #${order.orderId} est maintenant ${newStatus}`, 'order');
    Alert.alert('Succès', `Commande ${newStatus}`);
  };

  const updateStock = async (order) => {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let all = saved ? JSON.parse(saved) : initialProducts;
    order.items.forEach(item => {
      all = all.map(p => p.id === item.id ? { ...p, quantity: p.quantity - item.quantity } : p);
    });
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(all));
  };

  const getActions = (status) => {
    if (status === 'En attente de validation') return ['Valider', 'Refuser'];
    if (status === 'Validée') return ['En préparation'];
    if (status === 'En préparation') return ['Expédier'];
    if (status === 'Expédiée') return ['Livrée'];
    return [];
  };

  const getColor = (s) => ({ 'En attente de validation': '#F59E0B', 'Validée': '#22C55E', 'En préparation': '#3B82F6', 'Expédiée': '#8B5CF6', 'Livrée': '#22C55E', 'Annulée': '#EF4444', 'Refusée': '#EF4444' }[s] || '#94A3B8');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Commandes reçues</Text><Text style={styles.headerCount}>({orders.length})</Text></View>
      <FlatList
        data={orders}
        keyExtractor={i => i.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadOrders} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.orderCard} onPress={() => { setSelected(item); setShowModal(true); }}>
            <View style={styles.orderHeader}>
              <View><Text style={styles.orderId}>{item.orderId}</Text><Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text><Text style={styles.clientName}>Client: {item.clientName}</Text></View>
              <View style={[styles.orderStatus, { backgroundColor: getColor(item.status) }]}><Text style={styles.statusText}>{item.status}</Text></View>
            </View>
            <View style={styles.itemsPreview}>{item.items.slice(0, 2).map((p, i) => <Text key={i} style={styles.previewText}>{p.name} x{p.quantity}</Text>)}</View>
            <View style={styles.orderFooter}><Text style={styles.orderTotal}>Total: {item.total.toFixed(2)} DH</Text></View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={styles.emptyState}><Icon name="inbox" size={60} color={theme.textMuted} /><Text style={styles.emptyText}>Aucune commande reçue</Text><Text style={styles.emptySubText}>Les commandes des clients apparaîtront ici</Text></View>}
      />
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '80%' }]}>
            {selected && (
              <>
                <View style={styles.modalHeader}><Text style={styles.modalTitle}>Détails commande {selected.orderId}</Text><TouchableOpacity onPress={() => setShowModal(false)}><Icon name="close" size={24} /></TouchableOpacity></View>
                <ScrollView>
                  <View style={styles.detailSection}><Text style={styles.detailLabel}>Client</Text><Text style={styles.detailValue}>{selected.clientName}</Text><Text style={styles.detailValue}>{selected.clientPhone}</Text></View>
                  <View style={styles.detailSection}><Text style={styles.detailLabel}>Date</Text><Text style={styles.detailValue}>{new Date(selected.date).toLocaleString()}</Text></View>
                  <View style={styles.detailSection}><Text style={styles.detailLabel}>Produits</Text>{selected.items.map((p, i) => (<View key={i} style={styles.productRow}><Text>{p.name}</Text><Text>x{p.quantity}</Text><Text style={styles.productPrice}>{(p.price * p.quantity).toFixed(2)} DH</Text></View>))}</View>
                  <View style={styles.detailSection}><Text style={styles.detailLabel}>Total</Text><Text style={styles.totalAmount}>{selected.total.toFixed(2)} DH</Text></View>
                  <View style={styles.detailSection}><Text style={styles.detailLabel}>Statut</Text><View style={[styles.statusBadge, { backgroundColor: getColor(selected.status) }]}><Text style={styles.statusText}>{selected.status}</Text></View></View>
                  <View style={styles.actionButtons}>{getActions(selected.status).map(a => (<TouchableOpacity key={a} style={[styles.actionButton, a === 'Refuser' && styles.rejectButton]} onPress={() => { updateStatus(selected.id, a); setShowModal(false); }}><Text style={styles.actionButtonText}>{a}</Text></TouchableOpacity>))}</View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ==================== ÉCRAN FOURNISSEUR - GESTION PRODUITS ====================
const SupplierProductsScreen = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '', category: '', image: null, alertThreshold: '' });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const all = saved ? JSON.parse(saved) : initialProducts;
    setProducts(all.filter(p => p.supplierId === user.id));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Erreur', 'Permission refusée');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setForm({ ...form, image: result.assets[0].uri });
  };

  const saveProduct = async () => {
    if (!form.name || !form.price || !form.quantity) return Alert.alert('Erreur', 'Champs obligatoires');
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let all = saved ? JSON.parse(saved) : initialProducts;
    const data = {
      id: selected ? selected.id : Date.now().toString(),
      ...form,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      alertThreshold: parseInt(form.alertThreshold) || 10,
      supplierId: user.id,
      supplierName: user.name,
      image: form.image || productImages.Default,
      category: form.category || 'Autre',
    };
    if (selected) all = all.map(p => p.id === selected.id ? data : p);
    else all.push(data);
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(all));
    loadProducts();
    setShowModal(false);
    setSelected(null);
    setForm({ name: '', description: '', price: '', quantity: '', category: '', image: null, alertThreshold: '' });
    Alert.alert('Succès', selected ? 'Produit modifié' : 'Produit ajouté');
  };

  const deleteProduct = async (id) => {
    Alert.alert('Confirmation', 'Supprimer ce produit ?', [{ text: 'Non' }, { text: 'Oui', onPress: async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
      let all = saved ? JSON.parse(saved) : initialProducts;
      all = all.filter(p => p.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(all));
      loadProducts();
    } }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Mes produits</Text><Text style={styles.headerCount}>({products.length})</Text><TouchableOpacity style={styles.addButton} onPress={() => { setSelected(null); setForm({ name: '', description: '', price: '', quantity: '', category: '', image: null, alertThreshold: '' }); setShowModal(true); }}><Icon name="add" size={24} color="#FFF" /></TouchableOpacity></View>
      <FlatList data={products} keyExtractor={i => i.id} numColumns={2} columnWrapperStyle={styles.productRow} renderItem={({ item }) => (
        <View style={styles.productCard}><Image source={item.image} style={styles.productImage} /><View style={styles.productInfo}><Text style={styles.productName}>{item.name}</Text><Text style={styles.productPrice}>{item.price.toFixed(2)} DH</Text><Text style={[styles.productStock, item.quantity <= item.alertThreshold && styles.lowStock]}>Stock: {item.quantity}</Text><View style={styles.productActions}><TouchableOpacity onPress={() => { setSelected(item); setForm(item); setShowModal(true); }}><Icon name="edit" size={20} color={theme.info} /></TouchableOpacity><TouchableOpacity onPress={() => deleteProduct(item.id)}><Icon name="delete" size={20} color={theme.error} /></TouchableOpacity></View></View></View>
      )} />
      <Modal visible={showModal} transparent animationType="slide"><View style={styles.modalOverlay}><ScrollView style={styles.modalCard}><Text style={styles.modalTitle}>{selected ? 'Modifier produit' : 'Ajouter un produit'}</Text><View style={styles.imageSection}>{form.image ? <Image source={{ uri: form.image }} style={styles.previewImage} /> : <View style={styles.imagePlaceholder}><Icon name="image" size={50} color={theme.textMuted} /></View>}<TouchableOpacity style={styles.uploadButton} onPress={pickImage}><Icon name="photo-library" size={20} color="#FFF" /><Text style={styles.uploadText}>Choisir une image</Text></TouchableOpacity></View><TextInput style={styles.input} placeholder="Nom du produit" value={form.name} onChangeText={t => setForm({ ...form, name: t })} /><TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={form.description} onChangeText={t => setForm({ ...form, description: t })} multiline /><TextInput style={styles.input} placeholder="Prix (DH)" value={form.price.toString()} onChangeText={t => setForm({ ...form, price: t })} keyboardType="numeric" /><TextInput style={styles.input} placeholder="Quantité en stock" value={form.quantity.toString()} onChangeText={t => setForm({ ...form, quantity: t })} keyboardType="numeric" /><TextInput style={styles.input} placeholder="Seuil d'alerte" value={form.alertThreshold.toString()} onChangeText={t => setForm({ ...form, alertThreshold: t })} keyboardType="numeric" /><TextInput style={styles.input} placeholder="Catégorie" value={form.category} onChangeText={t => setForm({ ...form, category: t })} /><View style={styles.modalButtons}><TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowModal(false)}><Text>Annuler</Text></TouchableOpacity><TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={saveProduct}><Text>{selected ? 'Modifier' : 'Ajouter'}</Text></TouchableOpacity></View></ScrollView></View></Modal>
    </SafeAreaView>
  );
};

// ==================== ÉCRAN FOURNISSEUR - STOCK ====================
const SupplierStockScreen = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newQty, setNewQty] = useState('');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const all = saved ? JSON.parse(saved) : initialProducts;
    setProducts(all.filter(p => p.supplierId === user.id));
  };

  const updateStock = async (id, qty) => {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let all = saved ? JSON.parse(saved) : initialProducts;
    all = all.map(p => p.id === id ? { ...p, quantity: parseInt(qty) } : p);
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(all));
    loadProducts();
    setEditing(null);
    Alert.alert('Succès', 'Stock mis à jour');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Gestion des stocks</Text><Text style={styles.headerCount}>({products.length} produits)</Text></View>
      <FlatList data={products} keyExtractor={i => i.id} renderItem={({ item }) => (
        <View style={styles.stockCard}><Image source={item.image} style={styles.stockImage} /><View style={styles.stockInfo}><Text style={styles.stockName}>{item.name}</Text><Text style={styles.stockPrice}>{item.price.toFixed(2)} DH</Text>{editing === item.id ? (<View style={styles.stockEdit}><TextInput style={styles.stockInput} value={newQty} onChangeText={setNewQty} keyboardType="numeric" placeholder="Nouvelle quantité" /><TouchableOpacity style={styles.stockSave} onPress={() => updateStock(item.id, newQty)}><Text style={styles.stockSaveText}>Sauvegarder</Text></TouchableOpacity><TouchableOpacity style={styles.stockCancel} onPress={() => { setEditing(null); setNewQty(''); }}><Text style={styles.stockCancelText}>Annuler</Text></TouchableOpacity></View>) : (<View style={styles.stockDisplay}><Text style={[styles.stockQuantity, item.quantity <= item.alertThreshold && styles.lowStockText]}>Quantité: {item.quantity}</Text>{item.quantity <= item.alertThreshold && (<View style={styles.warningBadge}><Icon name="warning" size={14} color="#FFF" /><Text style={styles.warningText}>Stock critique</Text></View>)}<TouchableOpacity style={styles.editStock} onPress={() => { setEditing(item.id); setNewQty(item.quantity.toString()); }}><Text style={styles.editStockText}>Modifier</Text></TouchableOpacity></View>)}</View></View>
      )} />
    </SafeAreaView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background },
  splashTitle: { fontSize: 24, fontWeight: 'bold', color: theme.primary, marginTop: 16 },
  authContainer: { flex: 1, backgroundColor: theme.background },
  authScroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  authHeader: { alignItems: 'center', marginBottom: 32 },
  authTitle: { fontSize: 32, fontWeight: 'bold', color: theme.primary, marginTop: 8 },
  authSubtitle: { fontSize: 14, color: theme.textSecondary, marginTop: 4 },
  roleSelector: { flexDirection: 'row', marginBottom: 24, borderRadius: 16, backgroundColor: theme.surface, padding: 4, borderWidth: 1, borderColor: theme.border },
  roleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, gap: 8 },
  roleButtonActive: { backgroundColor: theme.primary },
  roleText: { fontSize: 15, color: theme.textSecondary, fontWeight: '500' },
  roleTextActive: { color: '#FFF' },
  authCard: { backgroundColor: theme.surface, borderRadius: 24, padding: 24, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  authTabSelector: { flexDirection: 'row', marginBottom: 24, borderRadius: 12, backgroundColor: theme.background, padding: 4 },
  authTab: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  authTabActive: { backgroundColor: theme.primary },
  authTabText: { fontSize: 14, color: theme.textSecondary, fontWeight: '500' },
  authTabTextActive: { color: '#FFF' },
  authForm: { gap: 16 },
  authInput: { borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: theme.background, color: theme.text },
  authButton: { backgroundColor: theme.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, shadowColor: theme.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  authButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  demoCard: { marginTop: 20, padding: 12, backgroundColor: theme.background, borderRadius: 12, borderWidth: 1, borderColor: theme.border },
  demoTitle: { fontSize: 12, fontWeight: 'bold', color: theme.textSecondary, marginBottom: 6 },
  demoText: { fontSize: 11, color: theme.textMuted, marginBottom: 2 },
  container: { flex: 1, backgroundColor: theme.background },
  tabBar: { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: Platform.OS === 'ios' ? 20 : 10, paddingTop: 10, height: Platform.OS === 'ios' ? 85 : 65 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: theme.border },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: theme.text },
  headerCount: { fontSize: 14, color: theme.textMuted, marginLeft: 8 },
  headerWelcome: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  welcomeText: { fontSize: 14, color: theme.textSecondary },
  userName: { fontSize: 26, fontWeight: 'bold', color: theme.text, marginTop: 4 },
  userBadge: { backgroundColor: `${theme.primary}15`, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginTop: 6, alignSelf: 'flex-start' },
  userBadgeText: { fontSize: 11, color: theme.primary, fontWeight: '500' },
  notifButton: { position: 'relative', padding: 8 },
  notifBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: theme.error, borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  notifBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingVertical: 8 },
  statCard: { width: '48%', backgroundColor: theme.surface, margin: '1%', padding: 16, borderRadius: 20, alignItems: 'center', shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  statIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statNumber: { fontSize: 26, fontWeight: 'bold', color: theme.text, marginTop: 4 },
  statLabel: { fontSize: 12, color: theme.textSecondary, marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text, marginHorizontal: 20, marginTop: 24, marginBottom: 12 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, paddingVertical: 16 },
  quickAction: { alignItems: 'center' },
  quickIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  quickText: { fontSize: 12, color: theme.textSecondary },
  recommendScroll: { paddingLeft: 20, marginBottom: 8 },
  recommendCard: { width: 130, backgroundColor: theme.surface, borderRadius: 16, marginRight: 12, padding: 12, alignItems: 'center', shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  recommendImage: { width: 90, height: 90, borderRadius: 12, marginBottom: 8 },
  recommendName: { fontSize: 12, color: theme.text, textAlign: 'center', marginTop: 4 },
  recommendPrice: { fontSize: 12, fontWeight: 'bold', color: theme.primary, marginTop: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, marginHorizontal: 20, marginVertical: 12, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: theme.border, gap: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: theme.text },
  categoryScroll: { paddingHorizontal: 20, marginBottom: 12 },
  categoryChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 24, backgroundColor: theme.surface, marginRight: 10, borderWidth: 1, borderColor: theme.border },
  categoryChipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  categoryText: { color: theme.textSecondary, fontSize: 14 },
  categoryTextActive: { color: '#FFF' },
  productRow: { justifyContent: 'space-between' },
  productCard: { flex: 1, backgroundColor: theme.surface, margin: 8, borderRadius: 20, overflow: 'hidden', shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  productImage: { width: '100%', height: 150, resizeMode: 'cover' },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: 'bold', color: theme.text, marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: theme.primary, marginVertical: 4 },
  productStock: { fontSize: 12, color: theme.textSecondary, marginBottom: 8 },
  addButton: { backgroundColor: theme.primary, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  cartButton: { position: 'relative' },
  cartBadge: { position: 'absolute', top: -5, right: -10, backgroundColor: theme.primary, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 4 },
  cartModal: { backgroundColor: theme.surface, borderRadius: 24, width: '90%', maxHeight: '80%' },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.border },
  cartTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text },
  emptyCart: { alignItems: 'center', padding: 50 },
  emptyText: { fontSize: 16, color: theme.textSecondary, marginTop: 12 },
  emptySubText: { fontSize: 12, color: theme.textMuted, marginTop: 8, textAlign: 'center' },
  cartItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: theme.border, alignItems: 'center' },
  cartImage: { width: 50, height: 50, borderRadius: 10, marginRight: 12 },
  cartInfo: { flex: 1 },
  cartName: { fontSize: 14, fontWeight: '500', color: theme.text },
  cartPrice: { fontSize: 12, color: theme.primary, marginTop: 4 },
  cartSupplier: { fontSize: 10, color: theme.textMuted, marginTop: 2 },
  cartQuantity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.border },
  qtyButtonText: { fontSize: 18, fontWeight: 'bold', color: theme.primary, textAlign: 'center' },
  qtyValue: { fontSize: 16, fontWeight: 'bold', color: theme.text, minWidth: 30, textAlign: 'center' },
  cartFooter: { padding: 20, borderTopWidth: 1, borderTopColor: theme.border },
  cartTotal: { fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 15 },
  orderButton: { backgroundColor: theme.primary, padding: 15, borderRadius: 16, alignItems: 'center' },
  orderButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  filterScroll: { paddingHorizontal: 15, paddingVertical: 12, backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: theme.border },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, backgroundColor: theme.background, marginRight: 10, borderWidth: 1, borderColor: theme.border },
  filterChipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  filterText: { color: theme.textSecondary, fontSize: 14 },
  filterTextActive: { color: '#FFF' },
  orderCard: { backgroundColor: theme.surface, marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 20, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: theme.primary },
  orderDate: { fontSize: 12, color: theme.textSecondary, marginTop: 4 },
  clientName: { fontSize: 12, color: theme.textSecondary, marginTop: 4 },
  orderStatus: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 6 },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  orderItems: { marginBottom: 12 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  orderItemName: { flex: 1, fontSize: 13, color: theme.text },
  orderItemQty: { fontSize: 13, color: theme.textSecondary, marginHorizontal: 10 },
  orderItemPrice: { fontSize: 13, color: theme.primary, fontWeight: 'bold' },
  moreItems: { fontSize: 12, color: theme.primary, marginTop: 4 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: theme.text },
  orderActions: { flexDirection: 'row', gap: 10 },
  payButton: { backgroundColor: theme.success, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  cancelButton: { backgroundColor: theme.error, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pdfButton: { backgroundColor: theme.info, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  actionButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  paymentModal: { backgroundColor: theme.surface, borderRadius: 24, padding: 24, width: '90%' },
  steps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.textMuted },
  stepActive: { backgroundColor: theme.primary },
  stepLine: { width: 40, height: 2, backgroundColor: theme.textMuted, marginHorizontal: 8 },
  paymentInput: { borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: theme.background, color: theme.text, marginBottom: 12 },
  paymentRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  paymentTotal: { fontSize: 18, fontWeight: 'bold', color: theme.primary, textAlign: 'center', marginTop: 20, marginBottom: 20 },
  successIcon: { alignItems: 'center', marginVertical: 30 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: theme.success, textAlign: 'center', marginBottom: 10 },
  successText: { fontSize: 14, color: theme.textSecondary, textAlign: 'center' },
  supplierCard: { backgroundColor: theme.surface, marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 20, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, flexDirection: 'row' },
  supplierAvatar: { width: 55, height: 55, borderRadius: 28, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  supplierInfo: { flex: 1 },
  supplierName: { fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  starsRow: { flexDirection: 'row', gap: 2 },
  ratingCount: { fontSize: 11, color: theme.textSecondary, marginLeft: 6 },
  supplierContact: { fontSize: 12, color: theme.textSecondary, marginBottom: 2 },
  supplierDesc: { fontSize: 11, color: theme.textMuted, marginTop: 4 },
  supplierActions: { flexDirection: 'column', gap: 8, alignItems: 'center' },
  chatButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  chatButtonText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  ratingButton: { padding: 5 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: theme.border, gap: 12 },
  chatTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text, flex: 1 },
  messageBubble: { maxWidth: '80%', marginVertical: 5, marginHorizontal: 10, padding: 12, borderRadius: 20 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: theme.primary },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border },
  messageText: { fontSize: 14 },
  myMessageText: { color: '#FFF' },
  messageTime: { fontSize: 10, color: theme.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  chatInput: { flexDirection: 'row', padding: 10, backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border, alignItems: 'flex-end', gap: 8 },
  chatInputField: { flex: 1, borderWidth: 1, borderColor: theme.border, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100, color: theme.text, backgroundColor: theme.background },
  sendButton: { backgroundColor: theme.primary, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  convCard: { flexDirection: 'row', backgroundColor: theme.surface, marginHorizontal: 16, marginBottom: 12, padding: 15, borderRadius: 20, alignItems: 'center' },
  convAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  convAvatarText: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  convInfo: { flex: 1 },
  convName: { fontSize: 16, fontWeight: 'bold', color: theme.text },
  convLastMsg: { fontSize: 13, color: theme.textSecondary },
  convMeta: { alignItems: 'flex-end' },
  convTime: { fontSize: 11, color: theme.textMuted },
  unreadBadge: { backgroundColor: theme.primary, borderRadius: 10, minWidth: 20, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4 },
  unreadText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  profileHeader: { alignItems: 'center', paddingVertical: 40, backgroundColor: theme.surface },
  profileAvatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  avatarLetter: { fontSize: 48, fontWeight: 'bold', color: '#FFF' },
  profileName: { fontSize: 26, fontWeight: 'bold', color: theme.text, marginBottom: 6 },
  profileBadge: { backgroundColor: `${theme.primary}15`, paddingHorizontal: 16, paddingVertical: 5, borderRadius: 30 },
  profileBadgeText: { fontSize: 13, color: theme.primary },
  infoCard: { backgroundColor: theme.surface, marginHorizontal: 16, marginTop: 20, padding: 20, borderRadius: 24, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text },
  editText: { color: theme.primary, fontSize: 14, fontWeight: '500' },
  infoInput: { borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 12, fontSize: 14, backgroundColor: theme.background, color: theme.text, marginBottom: 12 },
  infoRow: { flexDirection: 'row', marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  infoLabel: { width: 90, fontSize: 14, color: theme.textSecondary, fontWeight: '500' },
  infoValue: { flex: 1, fontSize: 14, color: theme.text },
  saveButton: { backgroundColor: theme.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface, marginHorizontal: 16, marginTop: 24, marginBottom: 40, padding: 16, borderRadius: 16, gap: 12, borderWidth: 1, borderColor: theme.error },
  logoutText: { fontSize: 16, color: theme.error, fontWeight: 'bold' },
  stockCard: { flexDirection: 'row', backgroundColor: theme.surface, marginHorizontal: 16, marginBottom: 12, padding: 15, borderRadius: 20, alignItems: 'center', shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  stockImage: { width: 65, height: 65, borderRadius: 15, marginRight: 15 },
  stockInfo: { flex: 1 },
  stockName: { fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 4 },
  stockPrice: { fontSize: 14, color: theme.primary, marginBottom: 8 },
  stockDisplay: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  stockQuantity: { fontSize: 14, color: theme.textSecondary },
  lowStockText: { color: theme.error, fontWeight: 'bold' },
  warningBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.error, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, gap: 4 },
  warningText: { color: '#FFF', fontSize: 11 },
  editStock: { backgroundColor: theme.info, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  editStockText: { color: '#FFF', fontSize: 12 },
  stockEdit: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  stockInput: { borderWidth: 1, borderColor: theme.border, borderRadius: 8, padding: 8, width: 85, fontSize: 14, color: theme.text, backgroundColor: theme.background },
  stockSave: { backgroundColor: theme.success, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  stockSaveText: { color: '#FFF', fontSize: 12 },
  stockCancel: { backgroundColor: theme.error, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  stockCancelText: { color: '#FFF', fontSize: 12 },
  productActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8, gap: 20 },
  editButton: { padding: 8 },
  deleteButton: { padding: 8 },
  lowStock: { color: theme.error, fontWeight: 'bold' },
  imageSection: { alignItems: 'center', marginBottom: 20 },
  previewImage: { width: 120, height: 120, borderRadius: 16, marginBottom: 12 },
  imagePlaceholder: { width: 120, height: 120, borderRadius: 16, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: theme.border },
  uploadButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, gap: 8 },
  uploadText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12, backgroundColor: theme.background, color: theme.text },
  textArea: { height: 80, textAlignVertical: 'top' },
  detailModal: { backgroundColor: theme.surface, borderRadius: 28, padding: 20, width: '90%', maxHeight: '85%', position: 'relative' },
  closeButton: { position: 'absolute', top: 15, right: 15, zIndex: 1, backgroundColor: theme.background, borderRadius: 20, padding: 5 },
  detailImage: { width: '100%', height: 220, borderRadius: 20, marginBottom: 16, resizeMode: 'cover' },
  detailName: { fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 8 },
  detailPrice: { fontSize: 22, fontWeight: 'bold', color: theme.primary, marginBottom: 12 },
  detailDesc: { fontSize: 14, color: theme.textSecondary, marginBottom: 12, lineHeight: 20 },
  detailStock: { fontSize: 14, color: theme.textSecondary, marginBottom: 8 },
  detailSupplier: { fontSize: 14, color: theme.textSecondary, marginBottom: 16 },
  detailAddButton: { backgroundColor: theme.primary, padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  detailAddText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: theme.surface, borderRadius: 28, padding: 24, width: '90%', maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 20 },
  modalButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  confirmButton: { backgroundColor: theme.primary },
  alertBanner: { backgroundColor: theme.error, marginHorizontal: 16, marginTop: 16, marginBottom: 8, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  alertText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', flex: 1 },
  ratingModal: { backgroundColor: theme.surface, borderRadius: 24, padding: 24, width: '80%', alignItems: 'center' },
  ratingStars: { flexDirection: 'row', gap: 8, marginVertical: 24 },
  notifItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: theme.border, gap: 12 },
  notifUnread: { backgroundColor: `${theme.primary}10` },
  notifIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: 'bold', color: theme.text, marginBottom: 4 },
  notifMessage: { fontSize: 12, color: theme.textSecondary, marginBottom: 4 },
  notifTime: { fontSize: 10, color: theme.textMuted },
  emptyNotif: { textAlign: 'center', padding: 40, color: theme.textSecondary },
  emptyState: { alignItems: 'center', padding: 50 },
  itemsPreview: { marginBottom: 10 },
  previewText: { fontSize: 12, color: theme.textSecondary, marginBottom: 2 },
  detailSection: { marginBottom: 16 },
  detailLabel: { fontSize: 14, fontWeight: 'bold', color: theme.textSecondary, marginBottom: 8 },
  detailValue: { fontSize: 14, color: theme.text, marginBottom: 4 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.borderLight },
  productPrice: { fontWeight: 'bold', color: theme.primary },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: theme.primary },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
  actionButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  actionButton: { backgroundColor: theme.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, minWidth: 100, alignItems: 'center' },
  rejectButton: { backgroundColor: theme.error },
  actionButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
});

export default App;