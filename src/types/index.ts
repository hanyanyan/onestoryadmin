export interface Actor {
  id: string;
  name: string;
  englishName: string;
  avatar: string;
  auditStatus: AuditStatus;
  auditReason: string;
  createdAt: string;
  badge: BadgeType;
  trustValue: number;
}

export type AuditStatus =
  | 'Pending Review'
  | 'Rejected'
  | 'Approved'
  | 'Pending NFT Mint'
  | 'Minted'
  | 'Offline'
  | 'Deleted';

export type BadgeType =
  | 'Official Actor'
  | 'Partner Actor'
  | 'Verified Creator'
  | 'Community Actor';

export const BADGE_OPTIONS: BadgeType[] = [
  'Official Actor',
  'Partner Actor',
  'Verified Creator',
  'Community Actor',
];

export const AUDIT_STATUS_OPTIONS: AuditStatus[] = [
  'Pending Review',
  'Rejected',
  'Approved',
  'Pending NFT Mint',
  'Minted',
  'Offline',
  'Deleted',
];