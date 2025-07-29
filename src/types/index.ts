export interface VisitorData {
  id: string;
  visitorName: string;
  visitorCompany: string;
  visitorEmail: string;
  purpose: string;
  hostEmail: string;
  createdAt: string;
}

export interface CheckInNotificationData {
  hostEmail: string;
  visitorName: string;
  visitorCompany: string;
  purpose: string;
  checkedInAt: string;
  // Optional notes that can be added during scanning
  identificationNotes?: string;
  locationNotes?: string;
} 