import type { Barber, TimeSlot } from "../types";

const API = import.meta.env.PUBLIC_API_URL || "https://api.onbarber.com.py";

export async function getBarbers(): Promise<Barber[]> {
  const res = await fetch(`${API}/api/barbers`);
  if (!res.ok) throw new Error("Error al cargar barberos");
  return res.json();
}

export function getAvailableDates(
  _barberId: number,
  startDate: Date,
  endDate: Date
): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates: string[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    // Not Sunday (0) and not in the past
    if (current.getDay() !== 0 && current >= today) {
      dates.push(formatDate(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export async function getAvailableSlots(
  barberId: number,
  date: string
): Promise<TimeSlot[]> {
  const res = await fetch(`${API}/api/barbers/${barberId}/slots?date=${date}`);
  if (!res.ok) return [];
  const data: { slots: string[] } = await res.json();

  // Filter out past times if date is today
  const now = new Date();
  const todayStr = formatDate(now);
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return data.slots.map((time) => ({
    time,
    available: date !== todayStr || time > currentTime,
  }));
}

export async function createAppointment(
  barberId: number,
  date: string,
  time: string,
  clientName: string,
  clientPhone: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        barber_id: barberId,
        client_name: clientName,
        client_phone: clientPhone,
        appointment_date: date,
        appointment_time: time,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { success: false, error: data?.message || "Error al reservar" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Error de conexión" };
  }
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
