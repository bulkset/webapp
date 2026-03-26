import t from '../../locales/ES.json';
import coinImage from '../../assets/coin.png';

interface WelcomePageProps {
  onStart: () => void;
}

function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div 
      className="h-dvh flex flex-col items-center justify-between px-[clamp(16px,5vw,48px)] py-[clamp(40px,10vh,80px)] relative z-[1] overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #440D08 38%, #B42115 100%)' }}
    >
      {/* Main coin in center */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <img
          src={coinImage}
          alt="Euro coin"
          className="w-[clamp(180px,45vh,350px)] h-auto select-none animate-float"
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
          }}
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-[clamp(12px,3vh,24px)] text-center">
        <h1 className="font-inter font-bold text-[clamp(22px,5vw,32px)] text-white leading-[120%]">
          {t.welcome.title}
        </h1>

        <p className="font-inter text-[clamp(14px,3vw,18px)] text-white leading-[140%]">
          {t.welcome.subtitle}
        </p>

        <div className="flex flex-col gap-[clamp(16px,4vh,32px)] mt-2">
          {/* How to earn */}
          <div className="flex items-start gap-3">
            <span className="text-[clamp(20px,4vw,28px)]">💶</span>
            <div className="text-left">
              <h3 className="font-inter font-bold text-[clamp(14px,3vw,16px)] text-white leading-[120%]">
                {t.welcome.howToEarn.title}
              </h3>
              <p className="font-inter text-[clamp(12px,2.5vw,14px)] text-white/80 leading-[140%]">
                {t.welcome.howToEarn.desc}
              </p>
            </div>
          </div>

          {/* Invite friends */}
          <div className="flex items-start gap-3">
            <span className="text-[clamp(20px,4vw,28px)]">📲</span>
            <div className="text-left">
              <h3 className="font-inter font-bold text-[clamp(14px,3vw,16px)] text-white leading-[120%]">
                {t.welcome.inviteFriends.title}
              </h3>
              <p className="font-inter text-[clamp(12px,2.5vw,14px)] text-white/80 leading-[140%]">
                {t.welcome.inviteFriends.desc}
              </p>
            </div>
          </div>

          {/* Advantages */}
          <div className="flex items-start gap-3">
            <span className="text-[clamp(20px,4vw,28px)]">📊</span>
            <div className="text-left">
              <h3 className="font-inter font-bold text-[clamp(14px,3vw,16px)] text-white leading-[120%]">
                {t.welcome.advantages.title}
              </h3>
              <p className="font-inter text-[clamp(12px,2.5vw,14px)] text-white/80 leading-[140%]">
                {t.welcome.advantages.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Start button */}
      <button
        className="w-full max-w-[320px] py-[clamp(14px,3.5vh,20px)] rounded-[12px] bg-[#ffdb00] font-inter font-bold text-[clamp(16px,4vw,20px)] leading-[100%] text-black text-center active:scale-[0.97] transition-transform duration-100"
        onClick={onStart}
      >
        {t.welcome.startButton}
      </button>
    </div>
  );
}

export default WelcomePage;
