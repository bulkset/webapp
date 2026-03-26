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

  const handleCoinTap = () => {
    if (energy <= 0) {
      setShowModal(true);
      return;
    }
    // Vibration feedback — try Telegram first, then browser API
    try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium'); } catch {}
    try { navigator.vibrate?.(15); } catch {}
    setBalance((prev) => prev + 0.05);
    setEnergy((prev) => prev - 1);
  };

  return (
    <div className="h-dvh flex flex-col relative bg-gradient-to-b from-black to-[#b42115] overflow-hidden">
      <main className="home-main flex-1 flex flex-col items-center justify-center px-[clamp(12px,4vw,40px)] pb-[calc(clamp(70px,18vw,90px)+env(safe-area-inset-bottom,0px))] relative z-[1] gap-[clamp(20px,6vh,72px)] max-w-[700px] mx-auto w-full">
        <BalanceHeader amount={balance.toFixed(2)} currency={t.currency} />
        <CoinHero onTap={handleCoinTap} />
        <EnergyBar current={energy} max={maxEnergy} onPlusClick={maxEnergy <= 20 ? () => setShowModal(true) : undefined} onBoostClick={() => setShowModal(true)} />
      </main>

      <BottomNav activeTab="home" onTabChange={onTabChange} sponsorBadge={sponsorBadge} />

      {showModal && (
        <EnergyModal
          onClose={() => setShowModal(false)}
          onUnlock={onUnlockSponsor}
          isSecondAttempt={facebookClicked}
          facebookLink={channelSettings?.facebookLink}
          onBoostEnergy={onBoostEnergy}
        />
      )}
    </div>
  );
}

export default HomePage;
