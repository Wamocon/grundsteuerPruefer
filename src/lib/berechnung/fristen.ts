/**
 * Fristenrechner (Anforderung E-05)
 *
 * § 355 AO: Einspruchsfrist = 1 Monat nach Bekanntgabe des Bescheids
 * § 122 Abs. 2 AO: Bekanntgabe gilt als 3 Tage nach Aufgabe zur Post
 * (Bekanntgabefiktion, falls nicht frueheres Datum nachgewiesen)
 */

/**
 * Calculates the Einspruchsfrist deadline.
 * @param bescheidDatum - The date printed on the Bescheid (Bescheiddatum)
 * @param bekanntgabeDatum - Optional: actual receipt date if different from fiction
 * @returns ISO date string of the last day to file an objection
 */
export function berechneEinspruchsFrist(
  bescheidDatum: Date,
  bekanntgabeDatum?: Date
): Date {
  // If no explicit receipt date, apply § 122 Abs. 2 AO: +3 days for postal delivery
  const basis = bekanntgabeDatum ?? addDays(bescheidDatum, 3);

  // § 355 AO: 1 month from Bekanntgabe
  const frist = addMonths(basis, 1);

  // If frist falls on weekend or public holiday, move to next business day
  // Simplified: only handle weekend (full public holiday list would be state-specific)
  return naechsterWerktag(frist);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const day = result.getDate();
  result.setMonth(result.getMonth() + months);
  // Handle month-end edge case (e.g. Jan 31 + 1 month = Feb 28)
  if (result.getDate() !== day) {
    result.setDate(0); // last day of previous month
  }
  return result;
}

function naechsterWerktag(date: Date): Date {
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  if (dayOfWeek === 6) result.setDate(result.getDate() + 2); // Saturday -> Monday
  if (dayOfWeek === 0) result.setDate(result.getDate() + 1); // Sunday -> Monday
  return result;
}

export function verbleibendeTage(fristDatum: Date): number {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  const frist = new Date(fristDatum);
  frist.setHours(0, 0, 0, 0);
  const diffMs = frist.getTime() - heute.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
