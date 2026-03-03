 module.exports = {
  name: 'Smart Supply',
  slug: 'smart-supply',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#2e86ab'
  },
  ios: {
    jsEngine: 'jsc',  // ← Ça désactive Hermes pour iOS
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2e86ab'
    }
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    eas: {
      projectId: "smartsupply-pfe-estn"
    }
  }
};