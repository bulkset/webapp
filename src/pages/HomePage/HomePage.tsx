import { useState } from 'react';
import BalanceHeader from '../../components/BalanceHeader/BalanceHeader';
import CoinHero from '../../components/CoinHero/CoinHero';
import EnergyBar from '../../components/EnergyBar/EnergyBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import EnergyModal from '../../components/EnergyModal/EnergyModal';
import t from '../../locales/ES.json';

interface HomePageProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  energy: number;
  setEnergy: React.Dispatch<React.SetStateAction<number>>;
  maxEnergy: number;
  onTabChange: (tab: string) => void;
  sponsorUnlocked?: boolean;
  onUnlockSponsor?: () => void;
  sponsorBadge?: number;
  onBoostClick?: () => void;
  onBoostEnergy?: () => void;
  facebookClicked?: boolean;
  channelSettings?: { facebookLink: string; twitterLink: string; instagramLink: string };
}

function HomePage({ balance, setBalance, energy, setEnergy, maxEnergy, onTabChange, sponsorUnlocked, onUnlockSponsor, sponsorBadge, onBoostClick, onBoostEnergy, facebookClicked, channelSettings }: HomePageProps) {
  const [showModal, setShowModal] = useState(false);
  const [hasShownEnergyModal, setHasShownEnergyModal] = useState(false);

  const handleCoinTap = () => {
    // Если энергия уже 0 - ничего не делаем
    if (energy <= 0) {
      return;
    }
    
    // Сначала уменьшаем энергию
    const newEnergy = energy - 1;
    
    // Показываем модальное окно только если спонсор ещё не разблокирован
    // и энергия стала 0 (после 20 кликов)
    if (newEnergy <= 0 && !sponsorUnlocked) {
      if (!hasShownEnergyModal) {
        setHasShownEnergyModal(true);
      }
      setShowModal(true);
      // Но всё равно начисляем баланс
      try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium'); } catch {}
      try { navigator.vibrate?.(15); } catch {}
      setBalance((prev) => prev + 0.05);
      setEnergy(0);
      return;
    }
    // Vibration feedback — try Telegram first, then browser API
    try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium'); } catch {}
    try { navigator.vibrate?.(15); } catch {}
    setBalance((prev) => prev + 0.05);
    setEnergy(newEnergy);
  };

  return (
    <div className="h-[100dvh] flex flex-col relative bg-gradient-to-b from-black to-[#b42115] overflow-hidden">
      <main className="home-main flex-1 flex flex-col items-center justify-center px-[clamp(12px,4vw,40px)] pb-[calc(clamp(70px,18vw,90px)+env(safe-area-inset-bottom,0px))] relative z-[1] gap-[clamp(20px,6vh,72px)] max-w-[700px] mx-auto w-full overflow-y-auto">
        <BalanceHeader amount={balance.toFixed(2)} currency={t.currency} />
        <CoinHero onTap={handleCoinTap} />
        <EnergyBar current={energy} max={maxEnergy} onPlusClick={!sponsorUnlocked ? () => setShowModal(true) : undefined} onBoostClick={() => setShowModal(true)} />
      </main>

      <BottomNav activeTab="home" onTabChange={onTabChange} sponsorBadge={sponsorBadge} />

      {showModal && (
        <EnergyModal
          onClose={() => setShowModal(false)}
          onUnlock={onUnlockSponsor}
          isSecondAttempt={hasShownEnergyModal}
          facebookLink={channelSettings?.facebookLink}
          onBoostEnergy={onBoostEnergy}
        />
      )}
    </div>
  );
}

export default HomePage;
