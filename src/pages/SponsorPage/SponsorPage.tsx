import { useState, useEffect, useRef } from 'react';
import BottomNav from '../../components/BottomNav/BottomNav';
import DetailsModal from '../../components/DetailsModal/DetailsModal';
import ChannelModal from '../../components/ChannelModal/ChannelModal';
import PostCard from '../../components/PostCard/PostCard';
import channelLogo from '../../assets/channelLogo.png';
import t from '../../locales/ES.json';
import { usePostVisibilityTracker } from '../../hooks/useReadPosts';
import type { Post } from '../../types/post';

interface SponsorPageProps {
  onTabChange: (tab: string) => void;
  posts: Post[];
  postsLoading: boolean;
  loadingMore: boolean;
  postsError: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetchPosts: () => void;
  markAsRead: (id: number) => void;
  readIds: Set<number>;
  unreadCount: number;
}

function SponsorPage({ onTabChange, posts, postsLoading, loadingMore, postsError, hasMore, loadMore, refetchPosts, markAsRead, readIds, unreadCount }: SponsorPageProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showChannel, setShowChannel] = useState(false);
  const observeRef = usePostVisibilityTracker(markAsRead);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // On mount: scroll to last unread post (near the bottom), or just scroll to bottom
  useEffect(() => {
    if (hasScrolled.current || postsLoading || posts.length === 0) return;
    hasScrolled.current = true;

    requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Find the last unread post (newest unread = last in ASC list)
      const unreadPosts = posts.filter(p => !readIds.has(p.id));
      if (unreadPosts.length > 0) {
        const lastUnread = unreadPosts[unreadPosts.length - 1]!;
        const el = container.querySelector(`[data-post-id="${lastUnread.id}"]`);
        if (el) {
          el.scrollIntoView({ block: 'center' });
          return;
        }
      }

      // If all read, scroll to bottom
      container.scrollTop = container.scrollHeight;
    });
  }, [posts, postsLoading, readIds]);

  // Infinite scroll UP — observe sentinel at top to load older posts
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMoreRef.current) {
          // Save scroll position before prepending
          const container = scrollContainerRef.current;
          const prevHeight = container?.scrollHeight ?? 0;
          const prevTop = container?.scrollTop ?? 0;

          const restore = () => {
            if (!container) return;
            const newHeight = container.scrollHeight;
            container.scrollTop = prevTop + (newHeight - prevHeight);
          };

          loadMoreRef.current();
          // Restore scroll after DOM updates
          requestAnimationFrame(restore);
        }
      },
      { root: scrollContainerRef.current, rootMargin: '300px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scrollContainerRef} data-scroll-allow className="h-dvh relative overflow-y-auto" style={{ background: 'linear-gradient(180deg, #000000 0%, #440D08 38%, #B42115 100%)' }}>
      <div className="sticky top-0 z-[10] bg-[#190503] px-[clamp(12px,4vw,48px)] pt-4 pb-3">
        <div className="relative flex items-center justify-between">
          <button
            className="text-white text-[24px] leading-none active:scale-90 transition-transform duration-100 shrink-0 z-[1] px-10 py-6 -ml-10 -my-4"
            onClick={() => onTabChange('home')}
          >
            <svg width="14" height="25" viewBox="0 0 14 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.3838 23.6912L1.38379 12.1912L12.3838 0.691162" stroke="white" strokeWidth="2" />
            </svg>
          </button>
          <button
            className="absolute inset-0 left-12 flex items-center active:scale-[0.97] transition-transform duration-100"
            onClick={() => setShowChannel(true)}
          >
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="font-inter font-bold text-[clamp(14px,2vw,18px)] text-white leading-[83%]">
                {t.sponsor.channelName}
              </span>
              <span className="font-inter text-[clamp(10px,1.2vw,12px)] text-[#a6a6a6] leading-[125%] font-bold">
                {t.sponsor.subscribers}
              </span>
            </div>
            <img
              src={channelLogo}
              alt={t.sponsor.channelAvatarAlt}
              className="w-[clamp(32px,4vw,42px)] h-[clamp(32px,4vw,42px)] rounded-full object-cover shrink-0"
            />
          </button>
        </div>
      </div>

      <main className="flex flex-col px-[clamp(12px,4vw,48px)] pb-[calc(clamp(70px,18vw,90px)+env(safe-area-inset-bottom,0px))] relative z-[1]">
        <div className="flex flex-col gap-4 max-w-[600px] mx-auto w-full pt-4 pb-4">
          {/* Sentinel at top for loading older posts */}
          <div ref={sentinelRef} className="h-1" />

          {loadingMore && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {postsLoading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {postsError && (
            <div className="text-center py-12">
              <p className="font-inter text-[14px] text-[#a6a6a6] mb-3">{t.post.error}</p>
              <button
                className="font-inter font-bold text-[14px] text-white bg-[#575757] rounded-[7px] px-6 py-2 active:scale-95 transition-transform duration-100"
                onClick={refetchPosts}
              >
                {t.post.retry}
              </button>
            </div>
          )}

          {!postsLoading && !postsError && posts.length === 0 && (
            <p className="font-inter text-[14px] text-[#a6a6a6] text-center py-12">
              {t.post.noPosts}
            </p>
          )}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              ref={observeRef}
              post={post}
              onDetailsClick={(p) => setSelectedPost(p)}
            />
          ))}
        </div>

        {selectedPost && <DetailsModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
        {showChannel && <ChannelModal onClose={() => setShowChannel(false)} />}
      </main>

      <BottomNav activeTab="sponsor" onTabChange={onTabChange} sponsorUnlocked sponsorBadge={unreadCount} />
    </div>
  );
}

export default SponsorPage;
