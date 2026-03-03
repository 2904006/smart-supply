import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme, USER_ROLES } from '../../utils/theme';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState(USER_ROLES.CLIENT);
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      // Simulation d'authentification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Stockage des données
      await AsyncStorage.setItem('userToken', 'fake-jwt-token');
      await AsyncStorage.setItem('userRole', userRole);
      await AsyncStorage.setItem('userEmail', email);

      // Navigation selon le rôle
      if (userRole === USER_ROLES.CLIENT) {
        navigation.replace('ClientApp');
      } else {
        navigation.replace('SupplierApp');
      }
    } catch (error) {
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header avec logo */}
          <View style={styles.header}>
            <Text style={styles.logo}>🇲🇦</Text>
            <Title style={styles.appTitle}>Smart Supply</Title>
            <Paragraph style={styles.appSubtitle}>
              Gestion de la Chaîne d'Approvisionnement
            </Paragraph>
          </View>

          {/* Carte de connexion */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Welcome back</Title>
              <Paragraph style={styles.cardSubtitle}>
                Sign in to your Smart Supply account
              </Paragraph>

              {/* Sélecteur de rôle */}
              <SegmentedButtons
                value={userRole}
                onValueChange={setUserRole}
                buttons={[
                  {
                    value: USER_ROLES.CLIENT,
                    label: 'Client',
                    style: styles.segmentedButton,
                  },
                  {
                    value: USER_ROLES.SUPPLIER,
                    label: 'Supplier',
                    style: styles.segmentedButton,
                  },
                ]}
                style={styles.segmentedContainer}
              />

              {/* Champ Email */}
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="email" color={theme.colors.primary} />}
                disabled={loading}
              />

              {/* Champ Mot de passe */}
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                style={styles.input}
                left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
                right={
                  <TextInput.Icon
                    icon={secureTextEntry ? 'eye-off' : 'eye'}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                    color={theme.colors.primary}
                  />
                }
                disabled={loading}
              />

              {/* Bouton de connexion */}
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                labelStyle={styles.loginButtonLabel}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Lien d'inscription */}
              <View style={styles.signupContainer}>
                <Paragraph style={styles.signupText}>
                  Don't have an account?{' '}
                </Paragraph>
                <TouchableOpacity onPress={() => alert('Inscription à venir')}>
                  <Text style={styles.signupLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Projet de Fin d'Études - ESTN 2025/2026
            </Text>
            <Text style={styles.teamText}>
              Hamza • Khadija • Ahmed
            </Text>
            <Text style={styles.supervisorText}>
              Encadré par: Pr. Redouane ESBAI
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 48,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 20,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  segmentedContainer: {
    marginBottom: 24,
  },
  segmentedButton: {
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  loginButtonContent: {
    paddingVertical: 6,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  teamText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    textAlign: 'center',
  },
  supervisorText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});