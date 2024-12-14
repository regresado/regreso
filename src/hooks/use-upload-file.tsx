/* 
Developed by Sadman Sakib (sadmann7) and licensed under the MIT License:
https://github.com/sadmann7
*/
import * as React from "react";
import type { UploadedFile } from "~/types";
import { toast } from "~/components/hooks/use-toast";
import type { AnyFileRoute, UploadFilesOptions } from "uploadthing/types";

import { getErrorMessage } from "~/lib/handle-error";
import { uploadFiles } from "~/lib/client/uploadthing";
import { type OurFileRouter } from "~/app/api/uploadthing/core";

interface UseUploadFileOptions<TFileRoute extends AnyFileRoute>
  extends Pick<
    UploadFilesOptions<TFileRoute>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFiles?: UploadedFile[];
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  {
    defaultUploadedFiles = [],
    ...props
  }: UseUploadFileOptions<OurFileRouter[keyof OurFileRouter]> = {},
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);
    try {
      const res: UploadedFile[] = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses((prev) => {
            return {
              ...prev,
              [file.name]: progress,
            };
          });
        },
      });

      setUploadedFiles((prev: UploadedFile[]): UploadedFile[] =>
        prev ? prev.concat(res) : res,
      );
    } catch (err) {
      toast({
        title: "Uh oh!",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
