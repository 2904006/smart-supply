 import apiClient from './api';

export const productService = {
  // Récupérer tous les produits
  getAll: async () => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors du chargement des produits';
    }
  },

  // Récupérer un produit par ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors du chargement du produit';
    }
  },

  // Créer un produit
  create: async (product) => {
    try {
      const response = await apiClient.post('/products', product);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la création du produit';
    }
  },

  // Mettre à jour un produit
  update: async (id, product) => {
    try {
      const response = await apiClient.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la mise à jour du produit';
    }
  },

  // Supprimer un produit
  delete: async (id) => {
    try {
      await apiClient.delete(`/products/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la suppression du produit';
    }
  },
};