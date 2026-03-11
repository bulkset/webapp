import { useState, useRef, useEffect } from 'react';
import channelLogo from '../../assets/channelLogo.png';
import t from '../../locales/ES.json';
import { useScrollLock } from '../../hooks/useScrollLock';
import { getChannelSettings, type ChannelSettings } from '../../api/posts';

interface ChannelModalProps {
  onClose: () => void;
}

function ChannelModal({ onClose }: ChannelModalProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(211);
  const [settings, setSettings] = useState<ChannelSettings>({
    telegramLink: '',
    twitterLink: '',
    instagramLink: '',
  });
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  useScrollLock(modalRef);

  useEffect(() => {
    getChannelSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="modal-inner bg-[#373737] rounded-[20px] p-[clamp(8px,2vw,16px)] py-[clamp(14px,2vw,24px)] w-full max-w-[720px] flex flex-col items-center max-h-[85dvh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all z-10" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col w-full" data-scroll-allow>
          {/* Avatar and name centered */}
          <div className="flex flex-col items-center mb-4">
            <div className="modal-avatar w-[117px] h-[117px] rounded-[29px] overflow-hidden shrink-0">
              <img
                src={channelLogo}
                alt={t.channelModal.actorAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-inter font-bold text-[20px] text-white leading-[75%] mt-3 shrink-0">
              {t.channelModal.actorName}
            </span>
          </div>
          
          {/* Text content left-aligned */}
          <h3 className="font-inter font-semibold text-[20px] text-[#a6a6a6] leading-[110%] text-left mb-3 px-3">
            {t.channelModal.title}
          </h3>
          <p className="font-inter font-semibold text-[14px] text-[#a6a6a6] leading-[129%] text-left px-3">
            {t.channelModal.text1}
          </p>
          <p className="font-inter font-semibold text-[14px] text-[#a6a6a6] leading-[129%] text-left mt-2 px-3">
            {t.channelModal.text2}
          </p>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex gap-[11px] shrink-0 px-3 w-full mt-4">
              {settings.telegramLink && (
                <a 
                  href={settings.telegramLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#37afe3] rounded-[8px] px-2 py-2 active:scale-95 transition-transform duration-100 min-w-0 flex-1 no-underline"
                >
                  <svg className="shrink-0" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.12602 0C4.08846 0 0 4.08846 0 9.12602C0 14.1636 4.08846 18.252 9.12602 18.252C14.1636 18.252 18.252 14.1636 18.252 9.12602C18.252 4.08846 14.1636 0 9.12602 0ZM13.3605 6.2057C13.2236 7.64761 12.6304 11.152 12.3293 12.7673C12.2015 13.4518 11.946 13.6799 11.7087 13.7073C11.1794 13.7529 10.7778 13.3605 10.2668 13.0228C9.46369 12.4935 9.00739 12.165 8.23167 11.6539C7.3282 11.0607 7.91226 10.7322 8.43245 10.2029C8.56933 10.066 10.9056 7.93964 10.9512 7.74799C10.9576 7.71897 10.9567 7.68883 10.9488 7.6602C10.9408 7.63158 10.926 7.60532 10.9056 7.58373C10.8508 7.5381 10.7778 7.55635 10.714 7.56547C10.6318 7.58372 9.35417 8.43245 6.86277 10.1116C6.49773 10.358 6.16919 10.4858 5.87716 10.4767C5.54862 10.4675 4.92805 10.2942 4.46263 10.139C3.88769 9.95649 3.44051 9.8561 3.47701 9.53669C3.49527 9.37243 3.72342 9.20816 4.15234 9.03476C6.81714 7.87576 8.58759 7.10917 9.47281 6.74413C12.0098 5.68551 12.53 5.50299 12.8768 5.50299C12.9498 5.50299 13.1232 5.52124 13.2327 5.6125C13.324 5.68551 13.3514 5.7859 13.3605 5.85891C13.3514 5.91366 13.3696 6.07793 13.3605 6.2057Z" fill="white" />
                  </svg>
                  <span className="font-inter font-bold text-[10px] text-white text-center leading-[150%]">{t.channelModal.telegram}</span>
                </a>
              )}
              {settings.twitterLink && (
                <a 
                  href={settings.twitterLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#000000] rounded-[8px] px-2 py-2 active:scale-95 transition-transform duration-100 min-w-0 flex-1 no-underline"
                >
                  <svg className="shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="white" />
                  </svg>
                  <span className="font-inter font-bold text-[10px] text-white text-center leading-[150%]">{t.channelModal.twitter}</span>
                </a>
              )}
              {settings.instagramLink && (
                <a 
                  href={settings.instagramLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#f60d8a] rounded-[8px] px-2 py-2 active:scale-95 transition-transform duration-100 min-w-0 flex-1 no-underline"
                >
                  <svg className="shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.6562 0C11.7432 0.00289878 12.2949 0.00869635 12.7713 0.022224L12.9587 0.0289878C13.1752 0.0367179 13.3887 0.0463805 13.6467 0.0579756C14.6748 0.106289 15.3763 0.268621 15.9918 0.507287C16.6295 0.752718 17.1667 1.08511 17.7039 1.62139C18.1954 2.10426 18.5756 2.6886 18.818 3.3336C19.0567 3.94911 19.219 4.65062 19.2673 5.67968C19.2789 5.93671 19.2886 6.15025 19.2963 6.36766L19.3021 6.55512C19.3166 7.03052 19.3224 7.58225 19.3243 8.6693L19.3253 9.39013V10.6559C19.3276 11.3607 19.3202 12.0655 19.303 12.7701L19.2972 12.9576C19.2895 13.175 19.2799 13.3885 19.2683 13.6455C19.2199 14.6746 19.0557 15.3751 19.818 15.9916C18.5756 16.6366 18.1954 17.221 17.7039 17.7038C17.2211 18.1954 16.6367 18.5756 15.9918 18.8179C15.3763 19.0566 14.6748 19.2189 13.6467 19.2673L12.9587 19.2962L12.7713 19.302C12.2949 19.3156 11.7432 19.3223 10.6562 19.3243L9.93539 19.3252H8.67058C7.96549 19.3277 7.26039 19.3203 6.5555 19.303L6.36804 19.2972C6.13867 19.2885 5.90935 19.2785 5.68008 19.2673C4.65201 19.2189 3.95052 19.0566 3.33406 18.8179C2.68942 18.5755 2.10544 18.1953 1.62286 17.7038C1.13099 17.2211 0.750454 16.6367 0.507824 15.9916C0.269163 15.3761 0.106835 14.6746 0.0585237 13.6455L0.0295366 12.9576L0.0247056 12.7701C0.00689403 12.0655 -0.0011588 11.3607 0.000549592 10.6559V8.6693C-0.00212485 7.96451 0.00496164 7.25971 0.0218069 6.55512L0.0285705 6.36766C0.0363004 6.15025 0.0459627 5.93671 0.0575575 5.67968C0.105869 4.65062 0.268197 3.95008 0.506857 3.3336C0.750053 2.68833 1.13126 2.10397 1.62383 1.62139C2.10613 1.13009 2.68977 0.74989 3.33406 0.507287C3.95052 0.268621 4.65104 0.106289 5.68008 0.0579756C5.9371 0.0463805 6.15161 0.0367179 6.36804 0.0289878L6.5555 0.0231902C7.26007 0.00602242 7.96484 -0.00138629 8.66962 0.000966191L10.6562 0ZM9.66291 4.83131C8.3816 4.83131 7.15277 5.34032 6.24675 6.24636C5.34073 7.15241 4.83173 8.38127 4.83173 9.66261C4.83173 10.944 5.34073 12.1728 6.24675 13.0789C7.15277 13.9849 8.3816 14.4939 9.66291 14.4939C10.9442 14.4939 12.173 13.9849 13.0791 13.0789C13.9851 12.1728 14.4941 10.944 14.4941 9.66261C14.4941 8.38127 13.9851 7.15241 13.0791 6.24636C12.173 5.34032 10.9442 4.83131 9.66291 4.83131ZM9.66291 6.76383C10.0436 6.76377 10.4205 6.83868 10.7722 6.9843C11.1239 7.12992 11.4435 7.34339 11.7127 7.61252C11.982 7.88165 12.1955 8.20118 12.3413 8.55285C12.487 8.90452 12.562 9.28146 12.5621 9.66213C12.5622 10.0428 12.4872 10.4198 12.3416 10.7715C12.196 11.1232 11.9826 11.4428 11.7134 11.712C11.4443 11.9812 11.1248 12.1948 10.7731 12.3406C10.4215 12.4863 10.0445 12.5613 9.66388 12.5614C8.89509 12.5614 8.15779 12.256 7.61418 11.7124C7.07057 11.1687 6.76517 10.4314 6.76517 9.66261C6.76517 8.89381 7.07057 8.15649 7.61418 7.61286C8.15779 7.06924 8.89509 6.76383 9.66388 6.76383M14.7366 3.38191C14.4163 3.38191 14.1091 3.50917 13.8826 3.73568C13.6561 3.96219 13.5288 4.26941 13.5288 4.58974C13.5288 4.91008 13.6561 5.21729 13.8826 5.4438C14.1091 5.67032 14.4163 5.79757 14.7366 5.79757C15.0569 5.79757 15.3641 5.67032 15.5907 5.4438C15.8172 5.21729 15.9444 4.91008 15.9444 4.58974C15.9444 4.26941 15.8172 3.96219 15.5907 3.73568C15.3641 3.50917 15.0569 3.38191 14.7366 3.38191Z" fill="white" />
                  </svg>
                  <span className="font-inter font-bold text-[10px] text-white text-center leading-[150%]">{t.channelModal.instagram}</span>
                </a>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ChannelModal;
