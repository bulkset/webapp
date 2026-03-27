import t from '../../locales/ES.json';
import coinImage from '../../assets/coin.png';

interface WelcomePageProps {
  onStart: () => void;
}

function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div 
      className="h-[100dvh] flex flex-col items-center justify-between px-[clamp(16px,4vw,48px)] py-[clamp(24px,5vh,60px)] relative z-[1] overflow-y-auto -webkit-overflow-scrolling:touch"
      style={{ 
        background: 'linear-gradient(180deg, #000000 0%, #1a1000 20%, #2d1800 40%, #4a2800 60%, #6b3500 80%, #000000 100%)',
        minHeight: '-webkit-fill-available'
      }}
    >
      {/* Main coin in center */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 min-h-[180px]">
        <img
          src={coinImage}
          alt="Euro coin"
          className="w-[clamp(140px,35vh,280px)] h-auto select-none animate-float"
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
          }}
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-[clamp(12px,3vh,24px)] text-center w-full max-w-[360px] overflow-y-auto max-h-[45vh]">
        <h1 className="font-inter font-bold text-[clamp(20px,5vw,32px)] text-white leading-[110%]">
          {t.welcome.title}
        </h1>

        <p className="font-inter text-[clamp(13px,3vw,16px)] text-white/90 leading-[140%] px-2">
          {t.welcome.subtitle}
        </p>

        <div className="flex flex-col gap-[clamp(14px,3vh,24px)] mt-2 w-full px-1">
          {/* How to earn */}
          <div className="flex items-start gap-3 p-2 rounded-lg bg-white/5">
            <span className="text-[clamp(20px,5vw,28px)]">💶</span>
            <div className="text-left">
              <h3 className="font-inter font-bold text-[clamp(13px,3vw,15px)] text-white leading-[120%]">
                {t.welcome.howToEarn.title}
              </h3>
              <p className="font-inter text-[clamp(11px,2.5vw,13px)] text-white/80 leading-[140%]">
                {t.welcome.howToEarn.desc}
              </p>
            </div>
          </div>

          {/* Invite friends */}
          <div className="flex items-start gap-3 p-2 rounded-lg bg-white/5">
            <span className="text-[clamp(20px,5vw,28px)]">📲</span>
            <div className="text-left">
              <h3 className="font-inter font-bold text-[clamp(13px,3vw,15px)] text-white leading-[120%]">
                {t.welcome.inviteFriends.title}
              </h3>
              <p className="font-inter text-[clamp(11px,2.5vw,13px)] text-white/80 leading-[140%]">
                {t.welcome.inviteFriends.desc}
              </p>
            </div>
          </div>

          {/* Advantages */}
          <div className="flex items-start gap-3 p-2 rounded-lg bg-white/5">
            <span className="text-[clamp(20px,5vw,28px)]">📊</span>
            <div className="text-left">
              <h3 className="font-inter font-bold text-[clamp(13px,3vw,15px)] text-white leading-[120%]">
                {t.welcome.advantages.title}
              </h3>
              <p className="font-inter text-[clamp(11px,2.5vw,13px)] text-white/80 leading-[140%]">
                {t.welcome.advantages.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Start button */}
      <button
        className="w-full max-w-[320px] py-[clamp(14px,4vh,18px)] rounded-[12px] bg-black font-inter font-bold text-[clamp(15px,4vw,18px)] leading-[100%] text-white text-center active:scale-[0.97] transition-transform duration-100 border border-white/20"
        onClick={onStart}
      >
        {t.welcome.startButton}
      </button>
    </div>
  );
}

export default WelcomePage;
