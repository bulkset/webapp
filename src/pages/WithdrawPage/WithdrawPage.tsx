import { useState } from 'react';
import coinImage from '../../assets/coin.png';
import BottomNav from '../../components/BottomNav/BottomNav';
import WithdrawModal from '../../components/WithdrawModal/WithdrawModal';
import t from '../../locales/ES.json';

interface WithdrawPageProps {
  balance: number;
  onTabChange: (tab: string) => void;
  sponsorUnlocked?: boolean;
  sponsorBadge?: number;
}

function WithdrawPage({ balance, onTabChange, sponsorUnlocked, sponsorBadge }: WithdrawPageProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col relative bg-gradient-to-b from-black to-[#b42115]">
      <main className="flex-1 flex flex-col items-center justify-center px-[clamp(12px,4vw,40px)] pb-[calc(clamp(70px,18vw,90px)+env(safe-area-inset-bottom,0px))] relative z-[1] gap-[clamp(8px,2vh,32px)] max-w-[700px] mx-auto w-full">
        <h1 className="font-inter font-medium text-[clamp(28px,3.5vw,40px)] leading-[100%] text-center text-white">
          {t.withdraw.title}
        </h1>
        <img
          src={coinImage}
          alt={t.withdraw.euroCoinAlt}
          className="w-[clamp(100px,25vh,340px)] h-auto select-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          style={{ WebkitTouchCallout: 'none' } as React.CSSProperties}
        />

        <span className="font-inter font-black text-[clamp(28px,3.5vw,40px)] leading-[100%] text-center text-white">
          {balance.toFixed(2)} {t.currency}
        </span>

        <button
          className="flex items-center gap-[clamp(12px,2vw,24px)] bg-black rounded-[11px] py-[clamp(12px,1.5vw,20px)] mt-[clamp(16px,2vw,40px)] px-[clamp(20px,3vw,40px)] active:scale-[0.97] transition-transform duration-100"
          onClick={() => setShowModal(true)}
        >
          <svg className="w-[clamp(28px,3vw,41px)] h-auto" viewBox="0 0 41 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39.4229 36C39.1833 36 38.9468 35.9458 38.7314 35.8416C38.516 35.7373 38.3274 35.5857 38.1799 35.3983C35.9266 32.5345 33.8359 30.3244 30.9528 28.8431C28.2845 27.4763 24.9331 26.763 20.4975 26.63V34.4346C20.4965 34.7401 20.4055 35.0387 20.2356 35.2936C20.0658 35.5484 19.8245 35.7483 19.5415 35.8687C19.2586 35.989 18.9463 36.0246 18.6433 35.9709C18.3402 35.9172 18.0596 35.7766 17.8361 35.5666L0.487776 19.1296C0.333609 18.9834 0.2109 18.8078 0.127062 18.6132C0.0432248 18.4186 0 18.2092 0 17.9976C0 17.786 0.0432248 17.5766 0.127062 17.382C0.2109 17.1874 0.333609 17.0118 0.487776 16.8656L17.8361 0.428646C18.0596 0.218572 18.3402 0.07803 18.6433 0.0243483C18.9463 -0.0293334 19.2586 0.0061928 19.5415 0.126546C19.8245 0.246899 20.0658 0.446817 20.2356 0.701649C20.4055 0.956481 20.4965 1.25509 20.4975 1.56064V9.42299C27.8054 9.75662 33.2504 12.4472 36.6974 17.4331C39.553 21.5629 41 27.2825 41 34.4346C41 34.8498 40.8338 35.2479 40.5381 35.5415C40.2423 35.8351 39.8412 36 39.4229 36Z" fill="white" />
          </svg>
          <span className="font-inter font-medium text-[clamp(16px,2vw,24px)] leading-[100%] text-white">
            {t.withdraw.buttonText}
          </span>
        </button>
      </main>

      <BottomNav activeTab="withdraw" onTabChange={onTabChange} sponsorUnlocked={sponsorUnlocked} sponsorBadge={sponsorBadge} />

      {showModal && (
        <WithdrawModal
          balance={balance}
          onClose={() => setShowModal(false)}
          onGoToSponsor={sponsorUnlocked ? () => onTabChange('sponsor') : undefined}
        />
      )}
    </div>
  );
}

export default WithdrawPage;
