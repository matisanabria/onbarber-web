import type { Barber, TimeSlot } from "../types";

export const mockBarbers: Barber[] = [
  { id: 1, name: "Kevin", active: true },
  { id: 2, name: "Carlos", active: true },
];

// Schedule: Mon-Fri 9:00-19:00, Sat 9:00-14:00, Sun closed
const weekdaySlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

const saturdaySlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
];

// Some pre-booked slots to simulate availability
const bookedSlots: Record<string, string[]> = {
  // barber1 bookings
  "1:2026-03-17": ["10:00", "14:00"],
  "1:2026-03-18": ["09:00", "11:00", "15:00"],
  "1:2026-03-19": ["13:00"],
  "1:2026-03-20": ["10:00", "16:00"],
  "1:2026-03-22": ["09:00", "11:00"],
  // barber2 bookings
  "2:2026-03-17": ["09:00", "13:00"],
  "2:2026-03-18": ["12:00"],
  "2:2026-03-19": ["10:00", "14:00", "17:00"],
  "2:2026-03-21": ["11:00", "15:00"],
};

export function getMockAvailableDates(barberId: number, startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    const day = current.getDay();
    // Not Sunday (0) and not in the past
    if (day !== 0 && current >= today) {
      const dateStr = formatDate(current);
      dates.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function getMockSlots(barberId: number, date: string): TimeSlot[] {
  const d = new Date(date + "T12:00:00");
  const day = d.getDay();

  if (day === 0) return []; // Sunday

  const baseSlots = day === 6 ? saturdaySlots : weekdaySlots;
  const booked = bookedSlots[`${barberId}:${date}`] || [];

  // Filter out past times if date is today
  const now = new Date();
  const isToday = formatDate(now) === date;

  return baseSlots.map((time) => ({
    time,
    available: !booked.includes(time) && (!isToday || time > `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`),
  }));
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
