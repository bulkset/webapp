import { useRef } from 'react';
import channelLogo from '../../assets/channelLogo.png';
import t from '../../locales/ES.json';
import { useScrollLock } from '../../hooks/useScrollLock';

interface EnergyModalProps {
  onClose: () => void;
  onUnlock?: () => void;
  isSecondAttempt?: boolean;
  facebookLink?: string;
  onBoostEnergy?: () => void;
}

function EnergyModal({ onClose, onUnlock, isSecondAttempt, facebookLink, onBoostEnergy }: EnergyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useScrollLock(modalRef);

  const handleButtonClick = () => {
    onClose();
    onUnlock?.();
  };

  const handleFacebookClick = () => {
    // Считаем клик по кнопке Facebook как подписку - сразу даём 50 энергии
    onBoostEnergy?.();
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="modal-inner bg-[#373737] rounded-[20px] p-[clamp(16px,4vw,32px)] w-full max-w-[720px] flex flex-col items-center gap-[clamp(10px,1.5vw,20px)] max-h-[85dvh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all z-10" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center gap-[clamp(10px,1.5vw,20px)]" data-scroll-allow>
          <svg className="shrink-0" width="50" height="47" viewBox="0 0 50 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.372 2.75591C22.3719 -0.942023 27.6887 -0.91234 29.6478 2.80785L48.8585 39.2949C50.7013 42.795 48.1634 47 44.2082 47H5.26368C1.28129 47 -1.25408 42.7455 0.640643 39.243L20.372 2.75591Z" fill="#212121" />
            <path d="M20.372 2.75591C22.3719 -0.942023 27.6887 -0.91234 29.6478 2.80785L48.8585 39.2949C50.7013 42.795 48.1634 47 44.2082 47H5.26368C1.28129 47 -1.25408 42.7455 0.640643 39.243L20.372 2.75591Z" fill="url(#paint0_linear_22_646)" />
            <path d="M24.7366 13.6047C25.5899 13.6047 26.2825 14.2973 26.2825 15.1507V29.3735C26.2825 29.7835 26.1197 30.1767 25.8297 30.4667C25.5398 30.7566 25.1466 30.9195 24.7366 30.9195C24.3266 30.9195 23.9333 30.7566 23.6434 30.4667C23.3535 30.1767 23.1906 29.7835 23.1906 29.3735V15.1507C23.1906 14.2973 23.8832 13.6047 24.7366 13.6047ZM24.7366 38.3401C25.3926 38.3401 26.0218 38.0795 26.4856 37.6156C26.9495 37.1517 27.2101 36.5226 27.2101 35.8665C27.2101 35.2105 26.9495 34.5814 26.4856 34.1175C26.0218 33.6536 25.3926 33.393 24.7366 33.393C24.0806 33.393 23.4514 33.6536 22.9875 34.1175C22.5237 34.5814 22.263 35.2105 22.263 35.8665C22.263 36.5226 22.5237 37.1517 22.9875 37.6156C23.4514 38.0795 24.0806 38.3401 24.7366 38.3401Z" fill="url(#paint1_linear_22_646)" />
            <defs>
              <linearGradient id="paint0_linear_22_646" x1="7.73103" y1="-7.34353" x2="37.6633" y2="52.6681" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFCD0F" />
                <stop offset="1" stopColor="#FE8401" />
              </linearGradient>
              <linearGradient id="paint1_linear_22_646" x1="18.1409" y1="13.6047" x2="30.0225" y2="38.9535" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4A4A4A" />
                <stop offset="1" stopColor="#242424" />
              </linearGradient>
            </defs>
          </svg>

          <h2 className="font-inter font-bold text-[clamp(16px,2vw,20px)] leading-[120%] text-white text-center">
            {isSecondAttempt ? t.energyModal.titleSecond : t.energyModal.title}
          </h2>

          <p className="font-inter text-[clamp(13px,1.4vw,16px)] leading-[113%] text-[#a6a6a6] text-center">
            {isSecondAttempt ? t.energyModal.descriptionSecond : t.energyModal.description}
          </p>

          <div className="w-[clamp(90px,10vw,117px)] h-[clamp(90px,10vw,117px)] rounded-[clamp(20px,3vw,29px)] overflow-hidden border-2 border-[rgba(255,255,255,0.1)] shrink-0">
            <img
              src={channelLogo}
              alt={t.energyModal.sponsorAlt}
              className="w-full h-full object-cover"
            />
          </div>

          {isSecondAttempt && (
            <h3 className="font-inter font-bold text-[clamp(14px,1.8vw,18px)] text-white leading-[120%] text-center">
              {t.energyModal.channelName}
            </h3>
          )}
        </div>

        {isSecondAttempt ? (
          <button
            type="button"
            className="shrink-0 w-full py-[clamp(12px,1.5vw,16px)] rounded-[9px] border border-[rgba(255,255,255,0.3)] bg-[#1877F2] font-inter font-medium text-[clamp(18px,2vw,24px)] leading-[100%] text-white text-center active:scale-[0.97] transition-transform duration-100 flex items-center justify-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const url = facebookLink || 'https://facebook.com';
              const newWindow = window.open(url, '_blank');
              handleFacebookClick();
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.477 0 0 4.477 0 10C0 14.991 3.657 19.128 8.205 19.879V12.89H6.147V10H8.205V7.797C8.205 5.324 9.69 4.014 11.83 4.014C12.791 4.014 13.566 4.106 13.795 4.138V6.625H12.519C11.543 6.625 11.339 7.21 11.339 7.879V10H13.795L13.379 12.89H11.339V19.717C15.322 19.075 18.75 15.191 18.75 10C18.75 4.477 14.523 0 10 0Z" fill="white"/>
            </svg>
            {t.energyModal.unlockButton}
          </button>
        ) : (
          <button
            className="shrink-0 w-full py-[clamp(12px,1.5vw,16px)] rounded-[9px] border border-[rgba(255,255,255,0.3)] bg-[#00af42] font-inter font-medium text-[clamp(18px,2vw,24px)] leading-[100%] text-white text-center active:scale-[0.97] transition-transform duration-100"
            onClick={handleButtonClick}
          >
            {t.energyModal.unlockButton}
          </button>
        )}
      </div>
    </div>
  );
}

export default EnergyModal;
