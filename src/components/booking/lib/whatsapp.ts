import type { Appointment } from "../types";

const WHATSAPP_NUMBER = import.meta.env.PUBLIC_WHATSAPP_NUMBER || "595981000000";

export function buildWhatsAppUrl(appointment: Appointment, barberName: string): string {
  const dateObj = new Date(appointment.date + "T12:00:00");
  const formattedDate = dateObj.toLocaleDateString("es-PY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const message = [
    `Hola! Quiero confirmar mi turno en ONBarber.`,
    ``,
    `Barbero: ${barberName}`,
    `Fecha: ${formattedDate}`,
    `Hora: ${appointment.time}`,
    `Nombre: ${appointment.clientName}`,
    `Teléfono: ${appointment.clientPhone}`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
