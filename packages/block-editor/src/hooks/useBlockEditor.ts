import { useEffect } from "react";
import { Editor, useEditor } from "@tiptap/react";
import { DebouncedFunc } from "lodash";

import { ExtensionKit } from "../extensions/extension-kit";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  content,
  onUpdate,
  extensions,
}: {
  content: object;
  onUpdate: DebouncedFunc<(evnt: any) => void>;
  extensions: any[];
}) => {
  const editor = useEditor(
    {
      // Performance Options
      // https://tiptap.dev/blog/release-notes/say-hello-to-tiptap-2-5-our-most-performant-editor-yet
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      //----
      content: content,
      autofocus: true,
      onCreate: ({ editor }) => {},
      onUpdate: onUpdate,
      extensions: [...ExtensionKit({}), ...extensions],
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full",
        },
      },
    },
    []
  );

  useEffect(() => {
    if (!editor || editor === null) {
      return;
    }
    const { from, to } = editor.state.selection;
    editor.commands.setContent(content);
    editor.commands.setTextSelection({ from, to });
  }, [content]);

  window.editor = editor;
  return { editor };
};
