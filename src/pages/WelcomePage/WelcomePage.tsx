import t from '../../locales/ES.json';
import coinImage from '../../assets/coin.png';

interface WelcomePageProps {
  onStart: () => void;
}

function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div 
      className="h-[100dvh] flex flex-col items-center justify-between px-[clamp(16px,4vw,48px)] py-[clamp(16px,4vh,32px)] relative z-[1]"
      style={{ 
        background: 'linear-gradient(180deg, #000000 0%, #1a1000 20%, #2d1800 40%, #4a2800 60%, #6b3500 80%, #000000 100%)',
        minHeight: '-webkit-fill-available'
      }}
    >
      {/* Main coin in center */}
      <div className="flex flex-col items-center justify-center py-1 min-h-[120px]">
        <img
          src={coinImage}
          alt="Euro coin"
          className="w-[clamp(100px,25vh,180px)] h-auto select-none animate-float"
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
          }}
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-[clamp(8px,2vh,16px)] text-center w-full max-w-[360px]">
        <h1 className="font-inter font-bold text-[clamp(18px,4vw,28px)] text-white leading-[110%]">
          {t.welcome.title}
        </h1>

        <p className="font-inter text-[clamp(12px,2.5vw,14px)] text-white/90 leading-[130%]">
          {t.welcome.subtitle}
        </p>

        <div className="flex flex-col gap-[clamp(8px,1.5vh,12px)] w-full px-1">
          {/* How to earn */}
          <div className="flex items-start gap-2 p-1.5 rounded-lg bg-white/5">
            <span className="text-[clamp(16px,4vw,22px)]">💶</span>
            <div className="text-left">
              <h3 className="font-inter font-bold text-[clamp(11px,2.5vw,13px)] text-white leading-[120%]">
                {t.welcome.howToEarn.title}
              </h3>
              <p className="font-inter text-[clamp(10px,2vw,11px)] text-white/80 leading-[130%]">
                {t.welcome.howToEarn.desc}
              </p>
            </div>
          </div>

          {/* Invite friends */}
          <div className="flex items-start gap-2 p-1.5 rounded-lg bg-white/5">
            <span className="text-[clamp(16px,4vw,22px)]">📲</span>
            <div className="text-left">
              <h3 className="font-inter font-bold text-[clamp(11px,2.5vw,13px)] text-white leading-[120%]">
                {t.welcome.inviteFriends.title}
              </h3>
              <p className="font-inter text-[clamp(10px,2vw,11px)] text-white/80 leading-[130%]">
                {t.welcome.inviteFriends.desc}
              </p>
            </div>
          </div>

          {/* Advantages */}
          <div className="flex items-start gap-2 p-1.5 rounded-lg bg-white/5">
            <span className="text-[clamp(16px,4vw,22px)]">📊</span>
            <div className="text-left">
              <h3 className="font-inter font-bold text-[clamp(11px,2.5vw,13px)] text-white leading-[120%]">
                {t.welcome.advantages.title}
              </h3>
              <p className="font-inter text-[clamp(10px,2vw,11px)] text-white/80 leading-[130%]">
                {t.welcome.advantages.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Start button */}
      <button
        className="w-full max-w-[320px] py-[clamp(12px,3vh,16px)] rounded-[12px] bg-black font-inter font-bold text-[clamp(14px,3.5vw,16px)] leading-[100%] text-white text-center active:scale-[0.97] transition-transform duration-100 border border-white/20"
        onClick={onStart}
      >
        {t.welcome.startButton}
      </button>
    </div>
  );
}

export default WelcomePage;
