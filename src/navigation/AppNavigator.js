import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';

// Client
import ClientDashboard from '../screens/client/ClientDashboard';
import CatalogScreen from '../screens/client/CatalogScreen';
import CartScreen from '../screens/client/CartScreen';
import OrdersScreen from '../screens/client/OrdersScreen';

// Supplier
import SupplierDashboard from '../screens/supplier/SupplierDashboard';
import StockManagement from '../screens/supplier/StockManagement';

import { theme } from '../utils/constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Accueil') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Catalogue') iconName = focused ? 'grid' : 'grid-outline';
          if (route.name === 'Commandes') iconName = focused ? 'clipboard' : 'clipboard-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={ClientDashboard} />
      <Tab.Screen name="Catalogue" component={CatalogScreen} />
      <Tab.Screen name="Commandes" component={OrdersScreen} />
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
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A23B72',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={SupplierDashboard} />
      <Tab.Screen name="Stocks" component={StockManagement} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ClientApp" component={ClientTabs} />
      <Stack.Screen name="SupplierApp" component={SupplierTabs} />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: true,
          title: 'Mon Panier',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack.Navigator>
  );
}