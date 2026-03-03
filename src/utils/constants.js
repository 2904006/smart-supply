import { DefaultTheme } from 'react-native-paper';

// Thème professionnel
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0C3B2E',
    accent: '#D4A017',
    background: '#F8F5F0',
    surface: '#FFFFFF',
    text: '#1E1E1E',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
  },
  roundness: 12,
};

// Rôles utilisateurs
export const USER_ROLES = {
  CLIENT: 'client',
  SUPPLIER: 'supplier',
};

// Statuts des commandes
export const ORDER_STATUS = {
  PENDING: 'pending',
  VALIDATED: 'validated',
  PREPARING: 'preparing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'En attente',
  [ORDER_STATUS.VALIDATED]: 'Validée',
  [ORDER_STATUS.PREPARING]: 'En préparation',
  [ORDER_STATUS.SHIPPED]: 'Expédiée',
  [ORDER_STATUS.DELIVERED]: 'Livrée',
  [ORDER_STATUS.CANCELLED]: 'Annulée',
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: '#FFC107',
  [ORDER_STATUS.VALIDATED]: '#17A2B8',
  [ORDER_STATUS.PREPARING]: '#6C757D',
  [ORDER_STATUS.SHIPPED]: '#28A745',
  [ORDER_STATUS.DELIVERED]: '#28A745',
  [ORDER_STATUS.CANCELLED]: '#DC3545',
};

// Produits marocains
export const MOROCCAN_PRODUCTS = [
  {
    id: '1',
    name: 'Huile d\'Argan Bio',
    category: 'Huiles',
    price: 180,
    unit: 'L',
    stock: 45,
    supplierId: 's1',
    supplierName: 'Coopérative Tissaliwine',
    origin: 'Essaouira',
    image: '🥑',
    minStock: 20,
    description: 'Huile d\'argan 100% pure, pressée à froid'
  },
  {
    id: '2',
    name: 'Dattes Medjoul',
    category: 'Fruits Secs',
    price: 95,
    unit: 'kg',
    stock: 120,
    supplierId: 's2',
    supplierName: 'Palmeraie Zagora',
    origin: 'Zagora',
    image: '🌴',
    minStock: 30,
    description: 'Dattes Medjoul de première qualité'
  },
  {
    id: '3',
    name: 'Sucre Jaouda',
    category: 'Sucres',
    price: 12,
    unit: 'kg',
    stock: 300,
    supplierId: 's3',
    supplierName: 'Suprimer Jaouda',
    origin: 'Casablanca',
    image: '🍚',
    minStock: 50,
    description: 'Sucre semoule de qualité supérieure'
  },
  {
    id: '4',
    name: 'Safran Taliouine',
    category: 'Épices',
    price: 850,
    unit: '10g',
    stock: 28,
    supplierId: 's4',
    supplierName: 'Coopérative Taliouine',
    origin: 'Taliouine',
    image: '🌺',
    minStock: 10,
    description: 'Safran pistils, IGP Taliouine'
  },
  {
    id: '5',
    name: 'Amandes de Taroudant',
    category: 'Noix',
    price: 140,
    unit: 'kg',
    stock: 75,
    supplierId: 's5',
    supplierName: 'Ferme Taroudant',
    origin: 'Taroudant',
    image: '🥜',
    minStock: 20,
    description: 'Amandes fraîches, variété Marcona'
  },
  {
    id: '6',
    name: 'Miel d\'Eucalyptus',
    category: 'Miels',
    price: 120,
    unit: '500g',
    stock: 60,
    supplierId: 's6',
    supplierName: 'Apiculteur Ifrane',
    origin: 'Ifrane',
    image: '🍯',
    minStock: 15,
    description: 'Miel pur, récolte artisanale'
  },
];

// Fournisseurs
export const SUPPLIERS = [
  {
    id: 's1',
    name: 'Coopérative Tissaliwine',
    type: 'Huiles d\'argan',
    location: 'Essaouira',
    phone: '+212 5 24 78 56 12',
    email: 'contact@tissaliwine.ma',
    rating: 4.8,
  },
  {
    id: 's2',
    name: 'Palmeraie Zagora',
    type: 'Dattes',
    location: 'Zagora',
    phone: '+212 5 24 88 45 67',
    email: 'contact@palmeraie.ma',
    rating: 4.7,
  },
  {
    id: 's3',
    name: 'Suprimer Jaouda',
    type: 'Sucre',
    location: 'Casablanca',
    phone: '+212 5 22 34 56 78',
    email: 'contact@jaouda.ma',
    rating: 4.9,
  },
];

// Commandes
export const ORDERS = [
  {
    id: 'CMD001',
    date: '2026-02-10',
    clientId: 'c1',
    clientName: 'SuperMart Nador',
    supplierId: 's3',
    supplierName: 'Suprimer Jaouda',
    items: [
      { productId: '3', name: 'Sucre Jaouda', quantity: 50, price: 12 },
    ],
    total: 600,
    status: ORDER_STATUS.PENDING,
  },
  {
    id: 'CMD002',
    date: '2026-02-09',
    clientId: 'c1',
    clientName: 'SuperMart Nador',
    supplierId: 's1',
    supplierName: 'Coopérative Tissaliwine',
    items: [
      { productId: '1', name: 'Huile d\'Argan', quantity: 10, price: 180 },
    ],
    total: 1800,
    status: ORDER_STATUS.VALIDATED,
  },
  {
    id: 'CMD003',
    date: '2026-02-08',
    clientId: 'c1',
    clientName: 'SuperMart Nador',
    supplierId: 's2',
    supplierName: 'Palmeraie Zagora',
    items: [
      { productId: '2', name: 'Dattes Medjoul', quantity: 20, price: 95 },
    ],
    total: 1900,
    status: ORDER_STATUS.SHIPPED,
  },
];