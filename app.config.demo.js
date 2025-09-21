/**
 * Demo Configuration for ResQ Connect
 * 
 * This configuration enables demo mode with mock services
 * and no real API keys or backend dependencies.
 */

const baseConfig = {
  expo: {
    name: "ResQ Connect (Demo)",
    slug: "resq-connect-demo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "resqconnectdemo",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", "expo-font", "expo-web-browser"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      demoMode: true,
      supabaseUrl: "https://demo.supabase.co",
      supabaseAnonKey: "demo_key",
    },
  },
};

module.exports = baseConfig;
