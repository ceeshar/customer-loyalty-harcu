// Stellar/Soroban Configuration
export const STELLAR_CONFIG = {
  // Network Configuration
  NETWORK_PASSPHRASE: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
  SOROBAN_RPC_URL: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org",
  HORIZON_URL: process.env.NEXT_PUBLIC_HORIZON_URL || "https://horizon-testnet.stellar.org",
  
  // Contract Configuration
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
  
  // Admin Configuration
  ADMIN_ADDRESS: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || "",
  
  // Demo Mode - Enable this if contract is not deployed
  DEMO_MODE: !process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
};

// Helper to check if we're in demo mode
export const isDemoMode = () => STELLAR_CONFIG.DEMO_MODE;

// Helper to check if contract is configured
export const isContractConfigured = () => !!STELLAR_CONFIG.CONTRACT_ADDRESS; 