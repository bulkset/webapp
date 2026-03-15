export type BotStep =
  | 'idle'
  | 'awaiting_text'
  | 'awaiting_image'
  | 'awaiting_details'
  | 'awaiting_facebook_link'
  | 'awaiting_twitter_link'
  | 'awaiting_instagram_link'
  | 'confirm_create'
  | 'awaiting_edit_field'
  | 'awaiting_edit_value'
  | 'awaiting_delete_confirm'
  | 'awaiting_channel_facebook'
  | 'awaiting_channel_twitter'
  | 'awaiting_channel_instagram'
  | 'confirm_channel_social';

export interface BotSession {
  step: BotStep;
  postDraft: {
    text?: string;
    imageUrl?: string;
    detailsText?: string;
    facebookLink?: string;
    twitterLink?: string;
    instagramLink?: string;
  };
  editPostId?: number;
  editField?: string;
  channelDraft?: {
    facebookLink?: string;
    twitterLink?: string;
    instagramLink?: string;
  };
  listPostsPage?: number;
}

const sessions = new Map<number, BotSession>();

export function getSession(chatId: number): BotSession {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, { step: 'idle', postDraft: {} });
  }
  return sessions.get(chatId)!;
}

export function resetSession(chatId: number) {
  sessions.set(chatId, { step: 'idle', postDraft: {} });
}
