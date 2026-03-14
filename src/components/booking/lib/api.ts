import type { Barber, TimeSlot } from "../types";
import { mockBarbers, getMockAvailableDates, getMockSlots } from "./mock";

// When Laravel is ready, replace these implementations with fetch calls
// to PUBLIC_API_URL endpoints.

export async function getBarbers(): Promise<Barber[]> {
  return mockBarbers.filter((b) => b.active);
}

export async function getAvailableDates(
  barberId: number,
  startDate: Date,
  endDate: Date
): Promise<string[]> {
  return getMockAvailableDates(barberId, startDate, endDate);
}

export async function getAvailableSlots(
  barberId: number,
  date: string
): Promise<TimeSlot[]> {
  return getMockSlots(barberId, date);
}
