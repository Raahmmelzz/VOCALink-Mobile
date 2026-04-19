export type StudentStatus = "online" | "idle" | "request" | "urgent";

export interface Student {
  id: number;
  name: string;
  status: StudentStatus;
  lastMsg: string;
  time: string;
  bg: string;
  color: string;
  unread: number;
}

export interface Message {
  from: "student" | "teacher";
  text: string;
  time: string;
}

export type Messages = Record<number, Message[]>;

export interface AACIcon {
  id: string;
  label: string;
  emoji: string;
  category: AACCategory;
  bg: string;
}

export type AACCategory =
  | "all"
  | "needs"
  | "emotions"
  | "classroom"
  | "actions";

export interface CCLine {
  text: string;
  time: string;
  speaker: "teacher" | "reply";
}
