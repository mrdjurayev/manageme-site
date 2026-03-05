"use server";

import { redirect } from "next/navigation";

import { getRequiredUserId } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

type AttendanceStatus = "present" | "absent" | "late";

const ATTENDANCE_STATUSES: AttendanceStatus[] = ["present", "absent", "late"];
const MAX_TITLE_LENGTH = 160;
const MAX_LOCATION_LENGTH = 120;
const MAX_NOTE_LENGTH = 400;

function getValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function parseDate(value: string): string | null {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function parseWeekday(value: string): number | null {
  const num = Number(value);
  if (Number.isInteger(num) && num >= 1 && num <= 7) {
    return num;
  }
  return null;
}

function parseTime(value: string): string | null {
  return /^\d{2}:\d{2}$/.test(value) ? value : null;
}

function normalizeStatus(value: string): AttendanceStatus | null {
  if (ATTENDANCE_STATUSES.includes(value as AttendanceStatus)) {
    return value as AttendanceStatus;
  }
  return null;
}

function toScheduleMessage(key: "error" | "message", value: string): string {
  return `/schedule?${key}=${encodeURIComponent(value)}`;
}

export async function createLessonAction(formData: FormData) {
  const userId = await getRequiredUserId();
  const supabase = await createClient();

  const seasonId = getValue(formData, "seasonId");
  const subjectId = getValue(formData, "subjectId");
  const title = normalizeText(getValue(formData, "title"));
  const weekday = parseWeekday(getValue(formData, "weekday"));
  const startTime = parseTime(getValue(formData, "startTime"));
  const endTime = parseTime(getValue(formData, "endTime"));
  const location = normalizeText(getValue(formData, "location"));

  if (
    !isUuid(seasonId) ||
    !isUuid(subjectId) ||
    title.length < 2 ||
    !weekday ||
    !startTime ||
    !endTime ||
    title.length > MAX_TITLE_LENGTH ||
    location.length > MAX_LOCATION_LENGTH
  ) {
    redirect(toScheduleMessage("error", "Dars jadvali maydonlari noto'g'ri to'ldirildi."));
  }

  if (startTime >= endTime) {
    redirect(toScheduleMessage("error", "Vaqt oralig'i noto'g'ri: start < end bo'lishi kerak."));
  }

  const { error } = await supabase.from("schedule_lessons").insert({
    user_id: userId,
    season_id: seasonId,
    subject_id: subjectId,
    title,
    weekday,
    start_time: startTime,
    end_time: endTime,
    location: location || null,
  });

  if (error) {
    redirect(
      toScheduleMessage("error", "Dars qo'shilmadi. Subject/season mosligi yoki vaqt bandligi bo'lishi mumkin."),
    );
  }

  redirect(toScheduleMessage("message", "Dars jadvalga qo'shildi."));
}

export async function deleteLessonAction(formData: FormData) {
  const userId = await getRequiredUserId();
  const supabase = await createClient();

  const lessonId = getValue(formData, "lessonId");
  if (!isUuid(lessonId)) {
    redirect(toScheduleMessage("error", "Noto'g'ri dars identifikatori."));
  }

  const { error } = await supabase
    .from("schedule_lessons")
    .delete()
    .eq("user_id", userId)
    .eq("id", lessonId);

  if (error) {
    redirect(toScheduleMessage("error", "Dars o'chirilmadi."));
  }

  redirect(toScheduleMessage("message", "Dars o'chirildi."));
}

export async function recordAttendanceAction(formData: FormData) {
  const userId = await getRequiredUserId();
  const supabase = await createClient();

  const lessonId = getValue(formData, "lessonId");
  const lessonDate = parseDate(getValue(formData, "lessonDate"));
  const status = normalizeStatus(getValue(formData, "status"));
  const note = normalizeText(getValue(formData, "note"));

  if (!isUuid(lessonId) || !lessonDate || !status || note.length > MAX_NOTE_LENGTH) {
    redirect(toScheduleMessage("error", "Davomat maydonlari noto'g'ri to'ldirildi."));
  }

  const { error } = await supabase.from("attendance_records").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      lesson_date: lessonDate,
      status,
      note: note || null,
    },
    {
      onConflict: "user_id,lesson_id,lesson_date",
    },
  );

  if (error) {
    redirect(toScheduleMessage("error", "Davomat saqlanmadi."));
  }

  redirect(toScheduleMessage("message", "Davomat yozuvi saqlandi."));
}

export async function deleteAttendanceAction(formData: FormData) {
  const userId = await getRequiredUserId();
  const supabase = await createClient();

  const attendanceId = getValue(formData, "attendanceId");
  if (!isUuid(attendanceId)) {
    redirect(toScheduleMessage("error", "Noto'g'ri davomat identifikatori."));
  }

  const { error } = await supabase
    .from("attendance_records")
    .delete()
    .eq("user_id", userId)
    .eq("id", attendanceId);

  if (error) {
    redirect(toScheduleMessage("error", "Davomat yozuvi o'chirilmadi."));
  }

  redirect(toScheduleMessage("message", "Davomat yozuvi o'chirildi."));
}
