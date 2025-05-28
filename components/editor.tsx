import React, { useRef } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import { useMutation } from "@tanstack/react-query";
import { ApiErrorResponse, ApiResponse } from "@/types/common";
import Media from "@/api/media";
import Notify from "@/lib/notification";

interface Props {
  initialValue?: string;
  onChange: (content: string) => void;
}

interface UpladResponse {
  image: string;
  name: string;
}

const Editor: React.FC<Props> = ({ initialValue = "", onChange }) => {
  const editorRef = useRef<any>(null);
  const image = useRef<string>("");
  const name = useRef<string>("");
  const { mutateAsync: uploadFile } = useMutation<
    ApiResponse<UpladResponse>,
    ApiErrorResponse,
    File
  >({
    mutationFn: Media.create,
    onSuccess: (data) => {
      image.current = data.result.data.image;
      name.current = data.result.data.name;
      console.log(data.result.data.image);
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <TinyMCEEditor
      onInit={(_, editor: any) => (editorRef.current = editor)}
      initialValue={initialValue}
      onEditorChange={handleEditorChange}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      init={{
        base_url: "/tinymce",
        height: 500,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image media insertdatetime table | code help | callToActionButton",

        // content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",

        automatic_uploads: true,
        file_picker_types: "image",
        file_picker_callback: function (
          callback: (url: string, obj?: { title: string }) => void,
          value: string,
          meta: Record<string, any>
        ) {
          if (meta.filetype === "image") {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*,image/gif");
            input.onchange = async function () {
              const file = (this as HTMLInputElement).files?.[0];
              if (file) {
                await uploadFile(file);
                callback(image.current, { title: name.current });
              }
            };
            input.click();
          }
        },
      }}
    />
  );
};

export default Editor;
