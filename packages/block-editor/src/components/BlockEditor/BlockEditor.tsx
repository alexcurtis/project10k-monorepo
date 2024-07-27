'use client'

import { EditorContent, useCurrentEditor } from '@tiptap/react'
import React, { useRef } from 'react'

import { LinkMenu } from '@/components/menus'

import { useBlockEditor } from '@/hooks/useBlockEditor'

import '@/styles/index.css'

import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'

export const BlockEditor = ({ content, onUpdate }: { content: object, onUpdate: () => void }) => {
    const menuContainerRef = useRef(null)

    const { editor } = useBlockEditor({
        content,
        onUpdate
    });

    if (!editor) { return null }

    console.log('Rendering Block Editor', content);

    return (
        <div className="overflow-auto" ref={menuContainerRef}>
            <div className="relative flex flex-col flex-1 h-full overflow-hidden">
                <ContentItemMenu editor={editor} />
                <LinkMenu editor={editor} appendTo={menuContainerRef} />
                <TextMenu editor={editor} />
                <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
                <TableRowMenu editor={editor} appendTo={menuContainerRef} />
                <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
                <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
                <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
            </div>
        </div>
    )
}

export default BlockEditor
