export interface CoupleProfile {
  jhonName: string;
  behetsaveName: string;
  jhonBirthday: string;
  behetsaveBirthday: string;
  anniversary: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  tag: string;
}

export interface Letter {
  title: string;
  date: string;
  preview: string;
  body: string;
  lockedUntil?: string;
}

export interface LocalPhoto {
  id: number;
  title: string;
  caption: string;
  src: string;
  date: string;
}
