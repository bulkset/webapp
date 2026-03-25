import t from '../../locales/ES.json';

interface EnergyBarProps {
  current: number;
  max: number;
  fillPercent?: number;
  label?: string;
  onPlusClick?: () => void;
  onBoostClick?: () => void;
}

function EnergyBar({ current, max, fillPercent, label, onPlusClick, onBoostClick }: EnergyBarProps) {
  const percentage = fillPercent ?? (current / max) * 100;

  return (
    <div className="flex flex-col gap-2 w-full max-w-[min(80%,500px)] mx-auto">
      {/* Progress bar — full width on top */}
      <div className="w-full h-[clamp(6px,0.5vw,10px)] bg-black rounded-[2px] overflow-hidden">
        <div
          className="h-full bg-[#ffdb00] rounded-[2px] transition-[width] duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <svg
            className="w-[14px] h-[22px] shrink-0"
            viewBox="0 0 14 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8.05046 12.2229L7.23121 9.53924L5.26873 20.6234L8.62508 11.7959L1.33545 11.6239L8.05046 12.2229ZM8.73207 4.30306e-05C8.69618 4.30306e-05 8.6603 0.00139847 8.62508 0.00413087C8.39044 0.023774 8.23489 0.105014 8.05046 0.233415C7.9466 0.305132 7.85297 0.391574 7.77228 0.490218C7.74806 0.51983 7.72521 0.550616 7.7038 0.582474L0.255008 10.7936C-0.0391149 11.2112 -0.0823195 11.7623 0.143673 12.2229C0.369334 12.6835 0.82564 12.9754 1.32582 12.9792L5.16304 13.0081L3.95664 20.3704C3.84198 21.0031 4.16768 21.6337 4.74097 21.8878C4.90757 21.9619 5.08703 22.0001 5.26837 22C5.68613 22 6.02944 21.7976 6.28702 21.432L10.0161 15.8994L13.7451 10.3668C14.0392 9.94919 14.0821 9.39738 13.8565 8.93747C13.6308 8.47688 13.1745 8.18494 12.6743 8.18118L8.83709 8.17429L10.0305 1.70088C10.0558 1.5949 10.0685 1.48612 10.0684 1.37696C10.0684 0.632022 9.49579 0.0247852 8.77926 0.000688478C8.76333 0 8.74767 4.30306e-05 8.73207 4.30306e-05Z"
              fill="#FFDB00"
            />
          </svg>

          <span className="font-inter font-bold text-[clamp(14px,1.5vw,16px)] leading-[107%] text-white">
            {label ?? `${current}/${max}`}
          </span>
        </div>

        {onPlusClick && (
          <button
            className="w-[25px] h-[25px] rounded-[7px] bg-[#000] flex items-center justify-center shrink-0 transition-all duration-100 active:scale-90 active:brightness-90"
            aria-label={t.energyBar.addEnergy}
            onClick={onPlusClick}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1V6M6 11V6M6 6H11H1" stroke="#FFDB02" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {onBoostClick && (
          <button
            className="w-[25px] h-[25px] rounded-[7px] bg-[#00af42] flex items-center justify-center shrink-0 transition-all duration-100 active:scale-90 active:brightness-90 ml-2"
            aria-label={t.energyBar.boost}
            onClick={onBoostClick}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default EnergyBar;
