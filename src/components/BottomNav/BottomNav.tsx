import t from '../../locales/ES.json';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sponsorBadge?: number;
}

const HomeIcon = () => (
  <svg
    width="12"
    height="15"
    viewBox="0 0 12 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M0 13.2857V5.57143C0 5.3 0.0532499 5.04286 0.15975 4.8C0.26625 4.55714 0.413 4.35714 0.6 4.2L5.1 0.342857C5.3625 0.114286 5.6625 0 6 0C6.3375 0 6.6375 0.114286 6.9 0.342857L11.4 4.2C11.5875 4.35714 11.7345 4.55714 11.841 4.8C11.9475 5.04286 12.0005 5.3 12 5.57143V13.2857C12 13.7571 11.853 14.1609 11.559 14.4969C11.265 14.8329 10.912 15.0006 10.5 15H8.25C8.0375 15 7.8595 14.9177 7.716 14.7531C7.5725 14.5886 7.5005 14.3851 7.5 14.1429V9.85714C7.5 9.61428 7.428 9.41086 7.284 9.24686C7.14 9.08286 6.962 9.00057 6.75 9H5.25C5.0375 9 4.8595 9.08228 4.716 9.24686C4.5725 9.41143 4.5005 9.61485 4.5 9.85714V14.1429C4.5 14.3857 4.428 14.5894 4.284 14.754C4.14 14.9186 3.962 15.0006 3.75 15H1.5C1.0875 15 0.7345 14.8323 0.441 14.4969C0.1475 14.1614 0.0005 13.7577 0 13.2857Z"
      fill="currentColor"
    />
  </svg>
);

const WithdrawIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M5.34211 1H9.28948C9.60355 1 9.90476 1.12476 10.1268 1.34685C10.3489 1.56893 10.4737 1.87014 10.4737 2.18421C10.4737 2.91705 10.1826 3.61986 9.66438 4.13806C9.14618 4.65625 8.44336 4.94737 7.71053 4.94737H6.92106C6.18822 4.94737 5.4854 4.65625 4.96721 4.13806C4.44902 3.61986 4.1579 2.91705 4.1579 2.18421C4.1579 1.87014 4.28266 1.56893 4.50474 1.34685C4.72683 1.12476 5.02804 1 5.34211 1Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.71053 15.2105H4.15789C3.32037 15.2105 2.51715 14.8778 1.92493 14.2856C1.33271 13.6934 1 12.8902 1 12.0526V11.2632C0.999655 9.87029 1.45976 8.51637 2.30872 7.41212C3.15767 6.30787 4.34785 5.51524 5.69401 5.15757C7.04018 4.79991 8.46682 4.89729 9.75191 5.43454C11.037 5.9718 12.1084 6.9188 12.7995 8.12816M10.4737 13.6316H15.2105M15.2105 13.6316L12.8421 11.2632M15.2105 13.6316L12.8421 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.06943 7.92847V8.19897C7.05772 8.19879 7.046 8.198 7.03427 8.198C7.02235 8.198 7.01003 8.19878 6.99814 8.19897V7.92847H7.06943ZM6.99814 12.3708C7.01004 12.371 7.02235 12.3728 7.03427 12.3728C7.04601 12.3728 7.05771 12.371 7.06943 12.3708V12.6423H6.99814V12.3708Z"
      stroke="currentColor"
    />
  </svg>
);



function BottomNav({ activeTab, onTabChange, sponsorBadge }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: t.nav.home, Icon: HomeIcon, badge: undefined },
    { id: 'withdraw', label: t.nav.withdraw, Icon: WithdrawIcon, badge: undefined },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 flex items-stretch h-[clamp(70px,18vw,90px)] bg-[#130402] pb-[env(safe-area-inset-bottom,0px)] z-[100]">
      {tabs.map(({ id, label, Icon, badge }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-opacity duration-150 active:scale-95 relative"
            style={{ color: isActive ? '#ffdb00' : 'rgba(255,255,255,0.7)' }}
            onClick={() => onTabChange(id)}
          >
            <div className="relative">
              <Icon />
              {badge !== undefined && (
                <span className="absolute -top-3 -right-8 bg-[#ffdb00] text-black font-inter font-bold text-[12px] leading-[125%] w-[30px] h-[18px] rounded-[9px] flex items-center justify-center">
                  {badge}
                </span>
              )}
            </div>
            <span className="font-inter font-bold text-[clamp(11px,1.5vw,14px)] leading-[107%]">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
