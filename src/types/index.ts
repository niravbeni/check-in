export interface VisitorData {
  id: string;
  visitorName: string;
  visitorCompany: string;
  visitorEmail: string;
  purpose: string;
  hostName: string;
  hostEmail: string;
  meetingDate: string; // ISO date string
  meetingTime: string; // 24-hour format HH:mm
  createdAt: string;
} 