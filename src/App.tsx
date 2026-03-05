import { useState, useEffect, useCallback } from 'react';
import HomePage from './pages/HomePage/HomePage';
import WithdrawPage from './pages/WithdrawPage/WithdrawPage';
import SponsorPage from './pages/SponsorPage/SponsorPage';
import { usePosts } from './hooks/usePosts';
import { useReadPosts } from './hooks/useReadPosts';
import coinImage from './assets/coin.png';

// Postback URLs
const LEAD_POSTBACK_URL = 'https://app.aio.tech/api/v1/trigger/conversion/{click_id}/e183a36c-27ed-4ded-92f8-9bc782e6a377';
const REG_POSTBACK_URL = 'https://app.aio.tech/api/v1/trigger/conversion/{click_id}/0325ec88-3b5b-410f-8ecf-16382fe2d8c4';

// Cookie helpers
function setCookie(name: string, value: string, days: number = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

// Get click_id from URL
function getClickIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('click_id') || params.get('clickid') || params.get('cid');
}

async function sendPostback(urlTemplate: string, clickId: string) {
  if (!clickId) return;
  const url = urlTemplate.replace('{click_id}', clickId);
  console.log('[POSTBACK] Sending:', url);
  try {
    await fetch(url, { method: 'GET', mode: 'no-cors' });
    console.log('[POSTBACK] Sent successfully');
  } catch (err) {
    console.error('[POSTBACK] Error:', err);
  }
}

// Preload coin image so it's cached before any page renders it
const preload = new Image();
preload.src = coinImage;

// Global vibration on all interactive element taps
function vibrate() {
  try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light'); } catch {}
  try { navigator.vibrate?.(10); } catch {}
}
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('button, a, [role="button"]')) vibrate();
}, { passive: true });

const BASE_ENERGY = 30;
const UNLOCKED_ENERGY = 50;
const ENERGY_REGEN_MS = 2 * 60 * 1000; // 1 energy per 2 minutes

function loadNumber(key: string, fallback: number): number {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    const n = Number(v);
    return isNaN(n) ? fallback : n;
  } catch { return fallback; }
}

function loadBool(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === 'true';
  } catch { return fallback; }
}

/** Calculate how much energy regenerated while the app was closed */
function calcOfflineRegen(savedEnergy: number, savedTimestamp: number, max: number): number {
  if (!savedTimestamp) return savedEnergy;
  const elapsed = Date.now() - savedTimestamp;
  const regenTicks = Math.floor(elapsed / ENERGY_REGEN_MS);
  return Math.min(savedEnergy + regenTicks, max);
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [balance, setBalance] = useState(() => loadNumber('balance', 100));
  const [sponsorUnlocked, setSponsorUnlocked] = useState(() => loadBool('sponsorUnlocked', false));
  const maxEnergy = sponsorUnlocked ? UNLOCKED_ENERGY : BASE_ENERGY;
  const [energy, setEnergy] = useState(() =>
    calcOfflineRegen(loadNumber('energy', maxEnergy), loadNumber('energyTimestamp', 0), maxEnergy)
  );
  const { posts, loading: postsLoading, loadingMore, error: postsError, hasMore, loadMore, refetch: refetchPosts } = usePosts();
  const { readIds, markAsRead, unreadCount } = useReadPosts();
  const unread = unreadCount(posts.map(p => p.id));

  // Persist balance
  useEffect(() => { localStorage.setItem('balance', String(balance)); }, [balance]);

  // Persist energy + timestamp
  useEffect(() => {
    localStorage.setItem('energy', String(energy));
    localStorage.setItem('energyTimestamp', String(Date.now()));
  }, [energy]);

  // Persist sponsorUnlocked
  useEffect(() => { localStorage.setItem('sponsorUnlocked', String(sponsorUnlocked)); }, [sponsorUnlocked]);

  // Handle postbacks - lead on first visit, reg on sponsor unlock
  useEffect(() => {
    const urlClickId = getClickIdFromUrl();
    const savedClickId = getCookie('click_id');
    
    // Only save click_id from URL if no click_id is already saved in cookies
    if (urlClickId && !savedClickId) {
      setCookie('click_id', urlClickId);
      console.log('[POSTBACK] Click ID saved from URL:', urlClickId);
    }
    
    // Use the saved click_id (either from cookies or from current URL)
    const clickIdToUse = savedClickId || urlClickId;
    if (!clickIdToUse) return;
    
    // Use unique key for each click_id to prevent duplicate postbacks
    const leadSentKey = `lead_postback_sent_${clickIdToUse}`;
    const leadSent = localStorage.getItem(leadSentKey);
    if (!leadSent) {
      localStorage.setItem(leadSentKey, 'true');
      sendPostback(LEAD_POSTBACK_URL, clickIdToUse);
      console.log('[POSTBACK] Lead postback sent for:', clickIdToUse);
    }
  }, []); // Only run on mount

  // Send reg postback when sponsor is unlocked
  useEffect(() => {
    const urlClickId = getClickIdFromUrl();
    const savedClickId = getCookie('click_id');
    const clickIdToUse = savedClickId || urlClickId;
    
    if (!clickIdToUse || !sponsorUnlocked) return;
    
    // Use unique key for each click_id
    const regSentKey = `reg_postback_sent_${clickIdToUse}`;
    const regSent = localStorage.getItem(regSentKey);
    if (!regSent) {
      localStorage.setItem(regSentKey, 'true');
      sendPostback(REG_POSTBACK_URL, clickIdToUse);
      console.log('[POSTBACK] Reg postback sent for:', clickIdToUse);
    }
  }, [sponsorUnlocked]);

  // Energy regeneration: 1 energy per 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(prev + 1, maxEnergy));
    }, ENERGY_REGEN_MS);
    return () => clearInterval(interval);
  }, [maxEnergy]);

  const handleUnlockSponsor = useCallback(() => {
    setSponsorUnlocked(true);
    setActiveTab('sponsor');
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="mx-auto h-dvh relative overflow-hidden">
      <div className={activeTab !== 'home' ? 'hidden' : ''}>
        <HomePage
          balance={balance}
          setBalance={setBalance}
          energy={energy}
          setEnergy={setEnergy}
          maxEnergy={maxEnergy}
          onTabChange={handleTabChange}
          sponsorUnlocked={sponsorUnlocked}
          onUnlockSponsor={handleUnlockSponsor}
          sponsorBadge={unread}
        />
      </div>
      <div className={activeTab !== 'withdraw' ? 'hidden' : ''}>
        <WithdrawPage
          balance={balance}
          onTabChange={handleTabChange}
          sponsorUnlocked={sponsorUnlocked}
          sponsorBadge={unread}
        />
      </div>
      {activeTab === 'sponsor' && (
        <SponsorPage
          onTabChange={handleTabChange}
          posts={posts}
          postsLoading={postsLoading}
          loadingMore={loadingMore}
          postsError={postsError}
          hasMore={hasMore}
          loadMore={loadMore}
          refetchPosts={refetchPosts}
          markAsRead={markAsRead}
          readIds={readIds}
          unreadCount={unread}
        />
      )}
    </div>
  );
}

export default App;
