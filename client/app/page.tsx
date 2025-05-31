"use client";
import React, { useEffect, useState } from "react";
import freighterApi from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

interface Reward {
  id: number;
  name: string;
  cost: number;
  description: string;
}

const rewards: Reward[] = [
  { id: 1, name: "Kahve Kuponu", cost: 50, description: "Ücretsiz kahve kuponu" },
  { id: 2, name: "Yemek İndirimi", cost: 100, description: "%20 yemek indirimi" },
  { id: 3, name: "Alışveriş Çeki", cost: 200, description: "50 TL alışveriş çeki" },
  { id: 4, name: "Premium Üyelik", cost: 500, description: "1 aylık premium üyelik" }
];

export default function LoyaltyApp() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string>("");

  // Freighter cüzdan bağlantısını kontrol et
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const connected = await freighterApi.isConnected();
        if (connected) {
          const { address } = await freighterApi.getAddress();
          setPublicKey(address);
          // Bakiye bilgisini al
          await fetchBalance(address);
        }
      } catch (error) {
        console.error("Freighter bağlantı hatası:", error);
      }
    };
    checkFreighter();
  }, []);

  // Cüzdan bağlantısı
  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      await freighterApi.setAllowed();
      const { address } = await freighterApi.getAddress();
      setPublicKey(address);
      await fetchBalance(address);
    } catch (error) {
      console.error("Cüzdan bağlantı hatası:", error);
      setTransactionStatus("Cüzdan bağlantısında hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Bakiye sorgulama (demo için sabit değer, gerçekte akıllı sözleşmeden gelecek)
  const fetchBalance = async (address: string) => {
    try {
      // Bu kısım gerçek Soroban sözleşmesi ile entegre edilecek
      // Şimdilik demo için rastgele bir değer atıyoruz
      const demoBalance = Math.floor(Math.random() * 1000) + 100;
      setBalance(demoBalance);
    } catch (error) {
      console.error("Bakiye alma hatası:", error);
    }
  };

  // Puan kazandırma (demo işlemi)
  const handleEarnPoints = async () => {
    if (!publicKey) return;
    
    try {
      setLoading(true);
      setTransactionStatus("Puan kazandırılıyor...");
      
      // Demo için rastgele puan ekleme
      const earnedPoints = Math.floor(Math.random() * 50) + 10;
      setBalance(prev => prev + earnedPoints);
      setTransactionStatus(`${earnedPoints} puan kazandınız!`);
      
      setTimeout(() => setTransactionStatus(""), 3000);
    } catch (error) {
      console.error("Puan kazandırma hatası:", error);
      setTransactionStatus("Puan kazandırmada hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Ödül satın alma
  const handleRedeemReward = async (reward: Reward) => {
    if (!publicKey || balance < reward.cost) return;
    
    try {
      setLoading(true);
      setTransactionStatus("Ödül alınıyor...");
      
      // Demo için bakiyeden düşme
      setBalance(prev => prev - reward.cost);
      setTransactionStatus(`${reward.name} başarıyla alındı!`);
      setSelectedReward(null);
      
      setTimeout(() => setTransactionStatus(""), 3000);
    } catch (error) {
      console.error("Ödül alma hatası:", error);
      setTransactionStatus("Ödül almada hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Cüzdan bağlantısı koparan fonksiyon
  const handleDisconnectWallet = () => {
    setPublicKey(null);
    setBalance(0);
    setTransactionStatus("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Müşteri Sadakat Programı
          </h1>
          <p className="text-gray-600">
            Stellar Soroban ile güçlendirilmiş sadakat puanları
          </p>
        </header>

        {/* Cüzdan Durumu */}
        <div className="max-w-4xl mx-auto">
          {!publicKey ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Cüzdanınızı Bağlayın
              </h2>
              <p className="text-gray-600 mb-6">
                Sadakat puanlarınızı görüntülemek ve ödülleri almak için Freighter cüzdanınızı bağlayın
              </p>
              <button
                onClick={handleConnectWallet}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? "Bağlanıyor..." : "Freighter Cüzdanını Bağla"}
              </button>
            </div>
          ) : (
            <>
              {/* Cüzdan Bilgileri */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Bağlı Cüzdan
                    </h3>
                    <p className="text-sm text-gray-600 break-all">
                      {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
                    </p>
                  </div>
                  <button
                    onClick={handleDisconnectWallet}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Bağlantıyı Kes
                  </button>
                </div>
              </div>

              {/* Puan Bakiyesi */}
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg p-8 text-white text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">Sadakat Puanınız</h2>
                <div className="text-5xl font-bold mb-4">{balance}</div>
                <p className="text-lg opacity-90">TRY Sabit Koin</p>
                <button
                  onClick={handleEarnPoints}
                  disabled={loading}
                  className="mt-4 bg-white text-blue-600 hover:bg-gray-100 disabled:bg-gray-200 font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? "İşleniyor..." : "Demo: Puan Kazan"}
                </button>
              </div>

              {/* Durum Mesajı */}
              {transactionStatus && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded">
                  {transactionStatus}
                </div>
              )}

              {/* Ödüller */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Mevcut Ödüller
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">
                        {reward.name}
                      </h4>
                      <p className="text-gray-600 mb-3">{reward.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-green-600">
                          {reward.cost} Puan
                        </span>
                        <button
                          onClick={() => handleRedeemReward(reward)}
                          disabled={balance < reward.cost || loading}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                          {balance < reward.cost ? "Yetersiz Puan" : "Al"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}