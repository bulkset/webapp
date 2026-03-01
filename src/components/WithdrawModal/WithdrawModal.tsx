import { useState } from 'react';
import t from '../../locales/ru.json';

interface WithdrawModalProps {
  balance: number;
  onClose: () => void;
  onGoToSponsor?: () => void;
}

function WithdrawModal({ balance, onClose }: WithdrawModalProps) {
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const normalized = amount.replace(',', '.').trim();
    const numeric = Number(normalized);

    console.log('[withdraw] submit', {
      amount,
      normalized,
      numeric,
      balance,
      isFinite: Number.isFinite(numeric)
    });

    if (!Number.isFinite(numeric) || numeric <= 0) {
      setErrorText(t.withdrawModal.invalidAmountError);
      setShowError(true);
      return;
    }

    if (numeric > balance) {
      setErrorText(t.withdrawModal.insufficientBalanceError);
      setShowError(true);
      return;
    }

    if (numeric < 1000) {
      setErrorText(t.withdrawModal.minAmountError);
      setShowError(true);
      return;
    }

    setShowError(false);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#373737] rounded-[20px] p-[clamp(8px,2vw,16px)] py-[clamp(16px,2vw,28px)] w-full max-w-[720px] flex flex-col items-center gap-[clamp(10px,1.5vw,20px)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h2 className="font-inter font-bold text-[clamp(18px,2vw,24px)] text-white text-center leading-[100%]">
          {t.withdrawModal.title}
        </h2>

        <input
          type="text"
          placeholder={t.withdrawModal.inputPlaceholder}
          className="w-full py-3 px-4 mt-[clamp(16px,2vw,24px)] rounded-[9px] border border-[rgba(255,255,255,0.3)] bg-[#535353] font-inter text-[clamp(16px,1.4vw,18px)] text-white placeholder-[rgba(255,255,255,0.4)] outline-none"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        {showError && (
          <div className="w-full flex flex-col gap-2">
            <p className="font-inter font-semibold text-[clamp(14px,1.2vw,18px)] text-[#ff4d4d] text-center leading-[120%]">
              {errorText}
            </p>
          </div>
        )}

        <button
          className="w-full py-[clamp(12px,1.5vw,16px)] rounded-[9px] mt-[clamp(20px,2vw,30px)] bg-[#00af42] font-inter font-bold text-[clamp(18px,2vw,24px)] leading-[100%] text-center text-white active:scale-[0.97] transition-transform duration-100"
          onClick={handleSubmit}
        >
          {t.withdrawModal.submitButton}
        </button>
      </div>
    </div>
  );
}

export default WithdrawModal;
