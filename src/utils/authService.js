import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      console.log('Tentative de connexion avec:', { email, password });
      
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      console.log('Réponse login:', response.data);

      if (response.data.access_token) {
        // Stocker le token
        await AsyncStorage.setItem('access_token', response.data.access_token);
        
        // Stocker les infos utilisateur si présentes
        if (response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return response.data;
    } catch (error) {
      console.error('Erreur login:', error);
      throw error.response?.data?.message || 'Erreur de connexion';
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);

      if (response.data.access_token) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur d\'inscription';
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.log('Erreur logout:', error);
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Récupérer le token
  getToken: async () => {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      return null;
    }
  },

  // Récupérer l'utilisateur connecté
  getCurrentUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },
};