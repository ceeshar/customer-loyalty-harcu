#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

// Contract data keys
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    UserBalance(Address),
    TotalSupply,
    TokenName,
    TokenSymbol,
    TokenDecimals,
}

// Events
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PointsEarned {
    pub user: Address,
    pub amount: i128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PointsRedeemed {
    pub user: Address,
    pub amount: i128,
}

// Contract trait
pub trait LoyaltyTrait {
    fn initialize(env: Env, admin: Address);
    fn earn_points(env: Env, user: Address, amount: i128);
    fn redeem_points(env: Env, user: Address, amount: i128) -> bool;
    fn get_balance(env: Env, user: Address) -> i128;
    fn get_total_supply(env: Env) -> i128;
    fn transfer(env: Env, from: Address, to: Address, amount: i128) -> bool;
}

#[contract]
pub struct LoyaltyContract;

#[contractimpl]
impl LoyaltyTrait for LoyaltyContract {
    fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }
        
        // Set admin
        env.storage().instance().set(&DataKey::Admin, &admin);
        
        // Set token metadata
        env.storage().instance().set(&DataKey::TokenName, &symbol_short!("TRYPoint"));
        env.storage().instance().set(&DataKey::TokenSymbol, &symbol_short!("TRYP"));
        env.storage().instance().set(&DataKey::TokenDecimals, &7u32);
        
        // Initialize total supply
        env.storage().instance().set(&DataKey::TotalSupply, &0i128);
    }
    
    fn earn_points(env: Env, user: Address, amount: i128) {
        // Verify admin
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        
        // Get current balance
        let balance_key = DataKey::UserBalance(user.clone());
        let current_balance: i128 = env.storage().instance()
            .get(&balance_key)
            .unwrap_or(0);
        
        // Update balance
        let new_balance = current_balance + amount;
        env.storage().instance().set(&balance_key, &new_balance);
        
        // Update total supply
        let total_supply: i128 = env.storage().instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0);
        env.storage().instance().set(&DataKey::TotalSupply, &(total_supply + amount));
        
        // Emit event
        env.events().publish((symbol_short!("earned"),), PointsEarned {
            user: user.clone(),
            amount,
        });
    }
    
    fn redeem_points(env: Env, user: Address, amount: i128) -> bool {
        user.require_auth();
        
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        
        // Get current balance
        let balance_key = DataKey::UserBalance(user.clone());
        let current_balance: i128 = env.storage().instance()
            .get(&balance_key)
            .unwrap_or(0);
        
        // Check if user has enough points
        if current_balance < amount {
            return false;
        }
        
        // Update balance
        let new_balance = current_balance - amount;
        env.storage().instance().set(&balance_key, &new_balance);
        
        // Update total supply
        let total_supply: i128 = env.storage().instance()
            .get(&DataKey::TotalSupply)
            .unwrap();
        env.storage().instance().set(&DataKey::TotalSupply, &(total_supply - amount));
        
        // Emit event
        env.events().publish((symbol_short!("redeemed"),), PointsRedeemed {
            user: user.clone(),
            amount,
        });
        
        true
    }
    
    fn get_balance(env: Env, user: Address) -> i128 {
        let balance_key = DataKey::UserBalance(user);
        env.storage().instance()
            .get(&balance_key)
            .unwrap_or(0)
    }
    
    fn get_total_supply(env: Env) -> i128 {
        env.storage().instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0)
    }
    
    fn transfer(env: Env, from: Address, to: Address, amount: i128) -> bool {
        from.require_auth();
        
        if amount <= 0 {
            panic!("Amount must be positive");
        }
        
        // Get sender balance
        let from_key = DataKey::UserBalance(from.clone());
        let from_balance: i128 = env.storage().instance()
            .get(&from_key)
            .unwrap_or(0);
        
        if from_balance < amount {
            return false;
        }
        
        // Get receiver balance
        let to_key = DataKey::UserBalance(to.clone());
        let to_balance: i128 = env.storage().instance()
            .get(&to_key)
            .unwrap_or(0);
        
        // Update balances
        env.storage().instance().set(&from_key, &(from_balance - amount));
        env.storage().instance().set(&to_key, &(to_balance + amount));
        
        true
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation};
    use soroban_sdk::{symbol_short, vec, Address, Env, IntoVal};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, LoyaltyContract);
        let client = LoyaltyContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        client.initialize(&admin);
        
        // Test that double initialization fails
        std::panic::catch_unwind(|| {
            client.initialize(&admin);
        }).expect_err("Should panic on double initialization");
    }
    
    #[test]
    fn test_earn_and_redeem_points() {
        let env = Env::default();
        let contract_id = env.register_contract(None, LoyaltyContract);
        let client = LoyaltyContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        
        // Initialize contract
        client.initialize(&admin);
        
        // Mock admin auth for earning points
        env.mock_all_auths();
        
        // Earn points
        client.earn_points(&user, &100);
        assert_eq!(client.get_balance(&user), 100);
        assert_eq!(client.get_total_supply(), 100);
        
        // Test auth for earn_points
        assert_eq!(
            env.auths(),
            std::vec![(
                admin.clone(),
                AuthorizedInvocation {
                    function: AuthorizedFunction::Contract((
                        contract_id.clone(),
                        symbol_short!("earn_pts"),
                        vec![&env, user.to_val(), 100i128.into_val(&env)]
                    )),
                    sub_invocations: std::vec![]
                }
            )]
        );
        
        // Redeem points
        env.mock_all_auths_allowing_non_root_auth();
        let success = client.redeem_points(&user, &50);
        assert!(success);
        assert_eq!(client.get_balance(&user), 50);
        assert_eq!(client.get_total_supply(), 50);
        
        // Try to redeem more than balance
        let failed = client.redeem_points(&user, &100);
        assert!(!failed);
        assert_eq!(client.get_balance(&user), 50);
    }
}
