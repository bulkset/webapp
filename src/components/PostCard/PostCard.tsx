import { useState, useCallback, forwardRef } from 'react';
import type { Post } from '../../types/post';
import { likePost, unlikePost, getImageUrl } from '../../api/posts';
import t from '../../locales/ES.json';

interface PostCardProps {
  post: Post;
  onDetailsClick?: (post: Post) => void;
  onFacebookClick?: () => void;
  facebookLink?: string;
}

function getLikedIds(): Set<number> {
  try {
    const raw = localStorage.getItem('liked_posts');
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch { return new Set(); }
}

function saveLikedIds(ids: Set<number>) {
  localStorage.setItem('liked_posts', JSON.stringify([...ids]));
}

const PostCard = forwardRef<HTMLDivElement, PostCardProps>(function PostCard({ post, onDetailsClick, onFacebookClick, facebookLink }, ref) {
  const [liked, setLiked] = useState(() => getLikedIds().has(post.id));
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const hasImage = post.imageUrl && post.imageUrl.length > 0;
  const hasLinks = post.facebookLink || post.twitterLink || post.instagramLink;

  // Check if the media is a video
  const isVideo = hasImage && /\.(mp4|webm|mov|avi|mkv|ogv)$/i.test(post.imageUrl);

  // Handle clicks on <a> tags inside dangerouslySetInnerHTML content
  const handleContentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor && anchor.href) {
      e.preventDefault();
      e.stopPropagation();
      window.open(anchor.href, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

    const ids = getLikedIds();
    if (newLiked) { ids.add(post.id); } else { ids.delete(post.id); }
    saveLikedIds(ids);

    try {
      if (newLiked) {
        await likePost(post.id);
      } else {
        await unlikePost(post.id);
      }
    } catch {
      setLiked(!newLiked);
      setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
      const rollback = getLikedIds();
      if (newLiked) { rollback.delete(post.id); } else { rollback.add(post.id); }
      saveLikedIds(rollback);
    }
  };

  return (
    <div ref={ref} data-post-id={post.id} className="bg-[#232227] rounded-[clamp(12px,1.5vw,20px)] py-[clamp(12px,1.5vw,24px)] px-[clamp(10px,1.3vw,20px)] flex flex-col gap-[clamp(12px,1.5vw,24px)]">
      {hasImage && (
        <div className="w-full rounded-[12px] overflow-hidden">
          {isVideo ? (
            <video
              controls
              className="w-full h-auto max-h-[400px] object-contain"
              playsInline
            >
              <source src={getImageUrl(post.imageUrl)} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={getImageUrl(post.imageUrl)}
              alt=""
              className="w-full h-auto max-h-[400px] object-contain"
            />
          )}
        </div>
      )}

      <div
        className="post-content font-inter text-[clamp(13px,1.4vw,16px)] text-white leading-[140%]"
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: post.description }}
      />

      {hasLinks && (
        <div className="flex gap-[11px]">
          {(facebookLink || post.facebookLink) && (
            <button
              type="button"
              className="flex items-center gap-1.5 bg-[#1877F2] rounded-[8px] px-2 py-2 active:scale-95 transition-transform duration-100 min-w-0 flex-1 no-underline"
              onClick={(e) => {
                e.preventDefault();
                const url = facebookLink || post.facebookLink;
                window.open(url, '_blank');
                onFacebookClick?.();
              }}
            >
              <svg className="shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.477 0 0 4.477 0 10C0 14.991 3.657 19.128 8.205 19.879V12.89H6.147V10H8.205V7.797C8.205 5.324 9.69 4.014 11.83 4.014C12.791 4.014 13.566 4.106 13.795 4.138V6.625H12.519C11.543 6.625 11.339 7.21 11.339 7.879V10H13.795L13.379 12.89H11.339V19.717C15.322 19.075 18.75 15.191 18.75 10C18.75 4.477 14.523 0 10 0Z" fill="white"/>
              </svg>
              <span className="font-inter font-bold text-[10px] text-white text-center leading-[150%]">{t.post.facebook}</span>
            </button>
          )}
          {post.twitterLink && (
            <a href={post.twitterLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#000000] rounded-[8px] px-2 py-2 active:scale-95 transition-transform duration-100 min-w-0 flex-1 no-underline">
              <svg className="shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="white" />
              </svg>
              <span className="font-inter font-bold text-[10px] text-white text-center leading-[150%]">{t.post.twitter}</span>
            </a>
          )}
          {post.instagramLink && (
            <a href={post.instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#f60d8a] rounded-[8px] px-2 py-2 active:scale-95 transition-transform duration-100 min-w-0 flex-1 no-underline">
              <svg className="shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.6562 0C11.7432 0.00289878 12.2949 0.00869635 12.7713 0.022224L12.9587 0.0289878C13.1752 0.0367179 13.3887 0.0463805 13.6467 0.0579756C14.6748 0.106289 15.3763 0.268621 15.9918 0.507287C16.6295 0.752718 17.1667 1.08511 17.7039 1.62139C18.1954 2.10426 18.5756 2.6886 18.818 3.3336C19.0567 3.94911 19.219 4.65062 19.2673 5.67968C19.2789 5.93671 19.2886 6.15025 19.2963 6.36766L19.3021 6.55512C19.3166 7.03052 19.3224 7.58225 19.3243 8.6693L19.3253 9.39013V10.6559C19.3276 11.3607 19.3202 12.0655 19.303 12.7701L19.2972 12.9576C19.2895 13.175 19.2799 13.3885 19.2683 13.6455C19.2199 14.6746 19.0557 15.3751 18.818 15.9916C18.5756 16.6366 18.1954 17.221 17.7039 17.7038C17.2211 18.1954 16.6367 18.5756 15.9918 18.8179C15.3763 19.0566 14.6748 19.2189 13.6467 19.2673L12.9587 19.2962L12.7713 19.302C12.2949 19.3156 11.7432 19.3223 10.6562 19.3243L9.93539 19.3252H8.67058C7.96549 19.3277 7.26039 19.3203 6.5555 19.303L6.36804 19.2972C6.13867 19.2885 5.90935 19.2785 5.68008 19.2673C4.65201 19.2189 3.95052 19.0566 3.33406 18.8179C2.68942 18.5755 2.10544 18.1953 1.62286 17.7038C1.13099 17.2211 0.750454 16.6367 0.507824 15.9916C0.269163 15.3761 0.106835 14.6746 0.0585237 13.6455L0.0295366 12.9576L0.0247056 12.7701C0.00689403 12.0655 -0.0011588 11.3607 0.000549592 10.6559V8.6693C-0.00212485 7.96451 0.00496164 7.25971 0.0218069 6.55512L0.0285705 6.36766C0.0363004 6.15025 0.0459627 5.93671 0.0575575 5.67968C0.105869 4.65062 0.268197 3.95008 0.506857 3.3336C0.750053 2.68833 1.13126 2.10397 1.62383 1.62139C2.10613 1.13009 2.68977 0.74989 3.33406 0.507287C3.95052 0.268621 4.65104 0.106289 5.68008 0.0579756C5.9371 0.0463805 6.15161 0.0367179 6.36804 0.0289878L6.5555 0.0231902C7.26007 0.00602242 7.96484 -0.00138629 8.66962 0.000966191L10.6562 0ZM9.66291 4.83131C8.3816 4.83131 7.15277 5.34032 6.24675 6.24636C5.34073 7.15241 4.83173 8.38127 4.83173 9.66261C4.83173 10.944 5.34073 12.1728 6.24675 13.0789C7.15277 13.9849 8.3816 14.4939 9.66291 14.4939C10.9442 14.4939 12.173 13.9849 13.0791 13.0789C13.9851 12.1728 14.4941 10.944 14.4941 9.66261C14.4941 8.38127 13.9851 7.15241 13.0791 6.24636C12.173 5.34032 10.9442 4.83131 9.66291 4.83131ZM9.66291 6.76383C10.0436 6.76377 10.4205 6.83868 10.7722 6.9843C11.1239 7.12992 11.4435 7.34339 11.7127 7.61252C11.982 7.88165 12.1955 8.20118 12.3413 8.55285C12.487 8.90452 12.562 9.28146 12.5621 9.66213C12.5622 10.0428 12.4872 10.4198 12.3416 10.7715C12.196 11.1232 11.9826 11.4428 11.7134 11.712C11.4443 11.9812 11.1248 12.1948 10.7731 12.3406C10.4215 12.4863 10.0445 12.5613 9.66388 12.5614C8.89509 12.5614 8.15779 12.256 7.61418 11.7124C7.07057 11.1687 6.76517 10.4314 6.76517 9.66261C6.76517 8.89381 7.07057 8.15649 7.61418 7.61286C8.15779 7.06924 8.89509 6.76383 9.66388 6.76383M14.7366 3.38191C14.4163 3.38191 14.1091 3.50917 13.8826 3.73568C13.6561 3.96219 13.5288 4.26941 13.5288 4.58974C13.5288 4.91008 13.6561 5.21729 13.8826 5.4438C14.1091 5.67032 14.4163 5.79757 14.7366 5.79757C15.0569 5.79757 15.3641 5.67032 15.5907 5.4438C15.8172 5.21729 15.9444 4.91008 15.9444 4.58974C15.9444 4.26941 15.8172 3.96219 15.5907 3.73568C15.3641 3.50917 15.0569 3.38191 14.7366 3.38191Z" fill="white" />
              </svg>
              <span className="font-inter font-bold text-[10px] text-white text-center leading-[150%]">{t.post.instagram}</span>
            </a>
          )}
        </div>
      )}

      {onDetailsClick && (
        <button
          className="w-full py-2 rounded-[7px] bg-[#575757] font-inter font-bold text-[10px]! text-white text-center active:scale-[0.97] transition-transform duration-100 leading-[150%]"
          onClick={() => onDetailsClick(post)}
        >
          {t.post.detailsButton}
        </button>
      )}

      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95 outline-none border-none bg-transparent"
        onClick={handleLike}
      >
        <svg width="20" height="19" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {liked ? (
            <>
              <path d="M12.6321 23.3645C13.3989 23.3645 19.3234 18.3257 22.7806 14.1808C26.1064 10.1923 24.9061 5.4827 24.1747 4.17194C23.3099 2.62362 12.3091 7.71662 12.3091 7.71662C12.3091 7.71662 2.06056 1.95886 1.29369 3.20919C0.253834 4.90547 -1.2028 9.36705 1.73756 13.5161C4.85921 17.9235 11.8089 23.3645 12.6321 23.3645Z" fill="#DB0A28" />
              <path d="M12.58 22.0081C12.58 22.0081 23.4703 13.9476 24.406 9.02549C25.2916 4.36385 23.4787 2.10284 21.2468 1.01297C15.5891 -1.75025 12.7342 3.672 12.4653 3.672C12.1965 3.672 9.5375 -1.76067 4.06731 0.589947C1.05402 1.88404 -0.208807 5.40579 0.985256 9.3735C2.7378 15.1959 12.58 22.0081 12.58 22.0081Z" fill="#FF262E" />
            </>
          ) : (
            <path d="M12.58 22.0081C12.58 22.0081 23.4703 13.9476 24.406 9.02549C25.2916 4.36385 23.4787 2.10284 21.2468 1.01297C15.5891 -1.75025 12.7342 3.672 12.4653 3.672C12.1965 3.672 9.5375 -1.76067 4.06731 0.589947C1.05402 1.88404 -0.208807 5.40579 0.985256 9.3735C2.7378 15.1959 12.58 22.0081 12.58 22.0081Z" fill="none" stroke="white" strokeWidth="1.5" />
          )}
        </svg>
        <span className={`font-inter font-bold text-[12px] leading-[125%] ${liked ? 'text-[#FF262E]' : 'text-white'}`}>
          {likeCount}
        </span>
      </button>
    </div>
  );
});

export default PostCard;
