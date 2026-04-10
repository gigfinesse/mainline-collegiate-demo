export type OrgType = 'fraternity' | 'sorority' | 'club' | 'student_org';
export type OrgRole = 'exec' | 'member' | 'friend';
export type EventVisibility = 'members_only' | 'friends_and_members' | 'open';
export type RSVPStatus = 'going' | 'waitlisted' | 'requested' | 'declined' | 'none';
export type EventTag =
  | 'darty'
  | 'formal'
  | 'mixer'
  | 'rush'
  | 'philanthropy'
  | 'tailgate'
  | 'party'
  | 'concert'
  | 'pregame'
  | 'social';

export interface School {
  id: string;
  name: string;
  shortName: string;
  domain: string;
}

export interface User {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  schoolId: string;
  avatarUrl: string;
  bio?: string;
}

export interface Org {
  id: string;
  name: string;
  shortName: string;
  greekLetters?: string;
  type: OrgType;
  schoolId: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
}

export interface OrgMembership {
  orgId: string;
  userId: string;
  role: OrgRole;
}

export interface Friendship {
  userId1: string;
  userId2: string;
  source: 'org' | 'request';
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface PosterTheme {
  background: string;
  fontColor: string;
  fontFamily: string;
  overlay?: string;
}

export interface Event {
  id: string;
  orgId: string;
  createdByUserId: string;
  title: string;
  description: string;
  coverImageUrl: string;
  posterTheme: PosterTheme;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  visibility: EventVisibility;
  capacity?: number;
  tags: EventTag[];
  cost: number;
  createdAt: string;
}

export interface RSVP {
  eventId: string;
  userId: string;
  status: RSVPStatus;
  respondedAt: string;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  text: string;
  reactions: Reaction[];
  createdAt: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
}

// Feed item types for the home feed
export type FeedItem =
  | FeedItemFriendActivity
  | FeedItemOrgEvent
  | FeedItemOpenEvent;

export interface FeedItemFriendActivity {
  type: 'friend_activity';
  event: Event;
  friends: User[];
}

export interface FeedItemOrgEvent {
  type: 'org_event';
  event: Event;
  org: Org;
}

export interface FeedItemOpenEvent {
  type: 'open_event';
  event: Event;
  org: Org;
  goingCount: number;
}
