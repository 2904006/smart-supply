 import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

const Stack = createStackNavigator();

// Écran temporaire
function TempClientScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍💼 Tableau de Bord Client</Text>
      <Text style={styles.text}>En cours de développement...</Text>
      <Text style={styles.info}>
        Ce module permettra de :
        • Consulter le catalogue
        • Passer des commandes
        • Suivre les livraisons
        • Gérer les fournisseurs
      </Text>
    </View>
  );
}

export default function ClientNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClientDashboard"
        component={TempClientScreen}
        options={{ title: 'Client Dashboard' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.light,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: COLORS.gray,
    marginBottom: 30,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: COLORS.info,
    textAlign: 'center',
    lineHeight: 24,
  },
});