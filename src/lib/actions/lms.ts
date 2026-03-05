"use server";

import { redirect } from "next/navigation";

import { getRequiredUserId } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

const MAX_SEASON_NAME_LENGTH = 120;
const MAX_SEASON_CODE_LENGTH = 32;
const MAX_SUBJECT_NAME_LENGTH = 120;
const MAX_SUBJECT_CODE_LENGTH = 32;

function getValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function toDashboardMessage(key: "error" | "message", value: string): string {
  return `/dashboard?${key}=${encodeURIComponent(value)}`;
}

function normalizeCode(code: string): string {
  return code.replace(/\s+/g, "-").toUpperCase();
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function parseDate(value: string): string | null {
  if (!value) {
    return null;
  }

  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return isValid ? value : null;
}

export async function createSeasonAction(formData: FormData) {
  const userId = await getRequiredUserId();
  const supabase = await createClient();

  const name = normalizeText(getValue(formData, "name"));
  const code = normalizeCode(getValue(formData, "code"));
  const startDate = parseDate(getValue(formData, "startDate"));
  const endDate = parseDate(getValue(formData, "endDate"));

  if (
    name.length < 2 ||
    name.length > MAX_SEASON_NAME_LENGTH ||
    code.length < 2 ||
    code.length > MAX_SEASON_CODE_LENGTH
  ) {
    redirect(toDashboardMessage("error", "Season nomi va kodi to'g'ri to'ldirilishi kerak."));
  }

  if (startDate && endDate && startDate > endDate) {
    redirect(toDashboardMessage("error", "Season sanalari noto'g'ri: start date <= end date bo'lishi shart."));
  }

  const { error } = await supabase.from("seasons").insert({
    user_id: userId,
    name,
    code,
    start_date: startDate,
    end_date: endDate,
  });

  if (error) {
    redirect(toDashboardMessage("error", "Season yaratilmadi. Nom/kod takroriy bo'lishi mumkin."));
  }

  redirect(toDashboardMessage("message", "Season muvaffaqiyatli yaratildi."));
}

export async function setActiveSeasonAction(formData: FormData) {
  const userId = await getRequiredUserId();
  const supabase = await createClient();

  const seasonId = getValue(formData, "seasonId");
  if (!isUuid(seasonId)) {
    redirect(toDashboardMessage("error", "Noto'g'ri season id."));
  }

  const clearResult = await supabase
    .from("seasons")
    .update({ is_active: false })
    .eq("user_id", userId);

  if (clearResult.error) {
    redirect(toDashboardMessage("error", "Active season yangilanmadi."));
  }

  const activateResult = await supabase
    .from("seasons")
    .update({ is_active: true })
    .eq("user_id", userId)
    .eq("id", seasonId);

  if (activateResult.error) {
    redirect(toDashboardMessage("error", "Season aktiv holatga o'tmadi."));
  }

  redirect(toDashboardMessage("message", "Active season yangilandi."));
}

export async function deleteSeasonAction(formData: FormData) {
  const userId = await getRequiredUserId();
  const supabase = await createClient();

  const seasonId = getValue(formData, "seasonId");
  if (!isUuid(seasonId)) {
    redirect(toDashboardMessage("error", "Noto'g'ri season id."));
  }

  const { error } = await supabase
    .from("seasons")
    .delete()
    .eq("user_id", userId)
    .eq("id", seasonId);

  if (error) {
    redirect(toDashboardMessage("error", "Season o'chirilmadi."));
  }

  redirect(toDashboardMessage("message", "Season o'chirildi."));
}

export async function createSubjectAction(formData: FormData) {
  const userId = await getRequiredUserId();
  const supabase = await createClient();

  const seasonId = getValue(formData, "seasonId");
  const name = normalizeText(getValue(formData, "name"));
  const code = normalizeCode(getValue(formData, "code"));

  if (
    !isUuid(seasonId) ||
    name.length < 2 ||
    name.length > MAX_SUBJECT_NAME_LENGTH ||
    code.length < 2 ||
    code.length > MAX_SUBJECT_CODE_LENGTH
  ) {
    redirect(toDashboardMessage("error", "Subject maydonlari noto'g'ri to'ldirilgan."));
  }

  const { error } = await supabase.from("subjects").insert({
    user_id: userId,
    season_id: seasonId,
    name,
    code,
  });

  if (error) {
    redirect(toDashboardMessage("error", "Subject yaratilmadi. Kod takroriy bo'lishi mumkin."));
  }

  redirect(toDashboardMessage("message", "Subject muvaffaqiyatli yaratildi."));
}

export async function deleteSubjectAction(formData: FormData) {
  const userId = await getRequiredUserId();
  const supabase = await createClient();

  const subjectId = getValue(formData, "subjectId");
  if (!isUuid(subjectId)) {
    redirect(toDashboardMessage("error", "Noto'g'ri subject id."));
  }

  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("user_id", userId)
    .eq("id", subjectId);

  if (error) {
    redirect(toDashboardMessage("error", "Subject o'chirilmadi."));
  }

  redirect(toDashboardMessage("message", "Subject o'chirildi."));
}
