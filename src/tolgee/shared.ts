import { BackendFetch, DevTools, FormatSimple, Tolgee } from "@tolgee/react";

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export const ALL_LANGUAGES = ["en"];

export const DEFAULT_LANGUAGE = "en";

export function TolgeeBase() {
  return (
    Tolgee()
      .use(FormatSimple())
      // .use(process.env.NODE_ENV == "development" ? DevTools() : undefined)
      // replace with .use(FormatIcu()) for rendering plurals, foramatted numbers, etc.
      // .updateDefaults({
      //   apiKey: apiKey ?? undefined,
      //   apiUrl: apiUrl ?? undefined,
      // })
      .updateDefaults({
        apiKey,
        apiUrl,
        staticData: {
          en: () => import("../../messages/en.json"),
          "en:Navigation": () => import("../../messages/Navigation/en.json"),
          "en:LandingPage": () => import("../../messages/LandingPage/en.json"),
        },
      })
  );
}
