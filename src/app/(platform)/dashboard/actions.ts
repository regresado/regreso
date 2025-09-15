"use server";

import { getWebDetails, SiteTagger } from "@regreso/utils";

type ActionResult = {
  url: string | undefined;
  title: (string | undefined)[];
  description: (string | undefined)[];
  error?: string;
  tags?: string[];
};

export async function getWebDetailsAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const url = formData.get("location");
  const aiTaggingInstance = formData.get("aiTaggingInstance");

  let webDetails: ActionResult = {
    url: url?.toString(),
    title: ["Unknown Destination", undefined, undefined],
    description: ["", undefined, undefined],
  };

  if (!url) {
    return { ...webDetails, error: "No URL provided" };
  }

  try {
    webDetails = await getWebDetails(url.toString());
  } catch (error) {
    return { ...webDetails, error: "Failed to fetch web details" };
  }

  if (aiTaggingInstance && aiTaggingInstance.toString().length > 0) {
    try {
      const tagger = new SiteTagger({
        maxTags: 3,
        aiInstance: aiTaggingInstance.toString(),
        maxRetries: 2,
      });

      const result = await tagger.generateTags({
        url: url.toString(),
        headline:
          webDetails.title[0] ||
          webDetails.title[1] ||
          webDetails.title[2] ||
          "",
        description:
          webDetails.description[0] ||
          webDetails.description[1] ||
          webDetails.description[2] ||
          "",
      });

      if (result.success) {
        return { ...webDetails, tags: result.tags };
      } else {
        return { ...webDetails, error: "Failed to generate tags" };
      }
    } catch (e) {
      return { ...webDetails, error: "Failed to generate tags" };
    }
  }

  return { ...webDetails, tags: [] };
}
