const config = {
  $schema: "https://docs.tolgee.io/cli-schema.json",
  projectId: 13369,
  format: "JSON_TOLGEE",
  patterns: ["./src/**/*.ts?(x)"],
  apiKey: process.env.NEXT_PUBLIC_TOLGEE_API_KEY,
  push: {
    files: [
      {
        path: "./messages/en.json",
        language: "en",
      },
      {
        path: "./messages/Navigation/en.json",
        language: "en",
      },
      {
        path: "./messages/LandingPage/en.json",
        language: "en",
      },
    ],
    removeOtherKeys: true,
    forceMode: "OVERRIDE",
  },
  pull: {
    path: "./messages",
  },
};

export default config;
