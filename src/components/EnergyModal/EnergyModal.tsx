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
  isSubscribed?: boolean;
  postSubscribeClicks?: number;
}

function EnergyModal({ onClose, onUnlock, isSecondAttempt, facebookLink, onBoostEnergy, isSubscribed, postSubscribeClicks }: EnergyModalProps) {
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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
    >
      <div
        className="modal-inner bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-[24px] p-6 w-full max-w-[400px] flex flex-col items-center gap-4 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all z-10" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>


        {/* Channel Avatar */}
        <div className="w-24 h-24 rounded-[20px] overflow-hidden border-3 border-white/20 shadow-lg">
          <img
            src={channelLogo}
            alt={t.energyModal.sponsorAlt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h2 className="font-inter font-bold text-2xl leading-[120%] text-white text-center mt-2">
          {(isSubscribed || (postSubscribeClicks && postSubscribeClicks >= 50)) ? 'Martín Soler García' : isSecondAttempt ? '¡Duplica tu energía!' : t.energyModal.title}
        </h2>

        {/* Description */}
        <p className="font-inter text-base leading-[150%] text-white/70 text-center px-2">
          {(isSubscribed || (postSubscribeClicks && postSubscribeClicks >= 50)) 
            ? 'Ya has agotado todos los intentos; suscríbete al canal del patrocinador: cuenta con más de 14 años de experiencia en trading y criptomonedas y te ayudará a ganar dinero ahora mismo!'
            : isSecondAttempt 
              ? 'Suscríbete al canal de Facebook del patrocinador y obtén casi tres veces más energía y gana tres veces más rápido!'
              : t.energyModal.description}
        </p>

      

        {/* Button */}
        {(isSubscribed || (postSubscribeClicks && postSubscribeClicks >= 50)) ? (
          <button
            type="button"
            className="w-full py-4 rounded-[12px] bg-[#1877F2] font-inter font-bold text-xl leading-[100%] text-white text-center active:scale-[0.97] transition-transform duration-100 flex items-center justify-center gap-3 mt-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const url = facebookLink || 'https://facebook.com';
              window.open(url, '_blank');
              onBoostEnergy?.();
              onClose();
            }}
          >
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.477 0 0 4.477 0 10C0 14.991 3.657 19.128 8.205 19.879V12.89H6.147V10H8.205V7.797C8.205 5.324 9.69 4.014 11.83 4.014C12.791 4.014 13.566 4.106 13.795 4.138V6.625H12.519C11.543 6.625 11.339 7.21 11.339 7.879V10H13.795L13.379 12.89H11.339V19.717C15.322 19.075 18.75 15.191 18.75 10C18.75 4.477 14.523 0 10 0Z" fill="white"/>
            </svg>
            Seguirnos en Facebook
          </button>
        ) : isSecondAttempt ? (
          <button
            type="button"
            className="w-full py-4 rounded-[12px] bg-[#1877F2] font-inter font-bold text-xl leading-[100%] text-white text-center active:scale-[0.97] transition-transform duration-100 flex items-center justify-center gap-3 mt-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const url = facebookLink || 'https://facebook.com';
              const newWindow = window.open(url, '_blank');
              handleFacebookClick();
            }}
          >
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.477 0 0 4.477 0 10C0 14.991 3.657 19.128 8.205 19.879V12.89H6.147V10H8.205V7.797C8.205 5.324 9.69 4.014 11.83 4.014C12.791 4.014 13.566 4.106 13.795 4.138V6.625H12.519C11.543 6.625 11.339 7.21 11.339 7.879V10H13.795L13.379 12.89H11.339V19.717C15.322 19.075 18.75 15.191 18.75 10C18.75 4.477 14.523 0 10 0Z" fill="white"/>
            </svg>
            {t.energyModal.unlockButton}
          </button>
        ) : (
          <button
            className="w-full py-4 rounded-[12px] bg-[#00af42] font-inter font-bold text-xl leading-[100%] text-white text-center active:scale-[0.97] transition-transform duration-100 mt-2"
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
