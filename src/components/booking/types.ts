export interface Barber {
  id: number;
  name: string;
  phone: string | null;
  photo_url: string | null;
  active: boolean;
}

export interface TimeSlot {
  time: string; // "HH:mm"
  available: boolean;
}

export interface Appointment {
  barberId: number;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  clientName: string;
  clientPhone: string;
}

export interface BookingState {
  step: 1 | 2 | 3 | 4 | 5;
  barberId: number | null;
  date: string | null;
  time: string | null;
  clientName: string;
  clientPhone: string;
}

export type BookingAction =
  | { type: "SELECT_BARBER"; barberId: number }
  | { type: "SELECT_DATE"; date: string }
  | { type: "SELECT_TIME"; time: string }
  | { type: "SET_CLIENT_NAME"; name: string }
  | { type: "SET_CLIENT_PHONE"; phone: string }
  | { type: "CONFIRM" }
  | { type: "GO_TO_STEP"; step: BookingState["step"] }
  | { type: "RESET" };
