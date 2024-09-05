"use client";

import { EditorContent } from "@tiptap/react";
import React, { useRef } from "react";
import { DebouncedFunc } from "lodash";

import { LinkMenu } from "../menus";
import { useBlockEditor } from "../../hooks/useBlockEditor";
import ImageBlockMenu from "../../extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "../../extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "../../extensions/Table/menus";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "../menus/ContentItemMenu";

import "../../styles/index.css";

export const BlockEditor = ({
  content,
  onUpdate,
  extensions,
}: {
  content: object;
  onUpdate: DebouncedFunc<(evnt: any) => void>;
  extensions: any[];
}) => {
  const menuContainerRef = useRef(null);

  const { editor } = useBlockEditor({
    content,
    onUpdate,
    extensions,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="relative" ref={menuContainerRef}>
      <ContentItemMenu editor={editor} />
      <LinkMenu editor={editor} appendTo={menuContainerRef} />
      <TextMenu editor={editor} />
      <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
      <TableRowMenu editor={editor} appendTo={menuContainerRef} />
      <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
      <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default BlockEditor;
