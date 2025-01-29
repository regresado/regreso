"use server";

import { cookies, headers } from "next/headers";

import { detectLanguageFromHeaders } from "@tolgee/react/server";

import { ALL_LANGUAGES, DEFAULT_LANGUAGE } from "./shared";

const LANGUAGE_COOKIE = "NEXT_LOCALE";

export async function setLanguage(locale: string) {
  const cookieStore = cookies();
  (await cookieStore).set(LANGUAGE_COOKIE, locale, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // one year in milisecods
  });
}

export async function getLanguage() {
  const cookieStore = cookies();
  const locale = (await cookieStore).get(LANGUAGE_COOKIE)?.value;
  if (locale && ALL_LANGUAGES.includes(locale)) {
    return locale;
  }

  // try to detect language from headers or use default
  const detected = detectLanguageFromHeaders(await headers(), ALL_LANGUAGES);
  return detected || DEFAULT_LANGUAGE;
}
