import React, { useRef } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

interface Props {
  initialValue?: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<Props> = ({ initialValue = "", onChange }) => {
  const editorRef = useRef<any>(null);

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
            input.setAttribute("accept", "image/*");
            // don't remove this line, it is important for the file picker to work
            console.log(value, "value");
            input.onchange = function () {
              const file = (this as HTMLInputElement).files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = function () {
                  const base64 = reader.result as string;
                  callback(base64, { title: file.name }); // insert base64 image
                };
                reader.readAsDataURL(file);
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
