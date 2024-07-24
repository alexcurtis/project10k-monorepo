'use client'

import { EditorContent } from '@tiptap/react'
import React, { useMemo, useRef } from 'react'

import { LinkMenu } from '@/components/menus'

import { useBlockEditor } from '@/hooks/useBlockEditor'

import '@/styles/index.css'

import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'

export const BlockEditor = ({ initialContent, onUpdate }: { initialContent: string, onUpdate: () => void }) => {
    const menuContainerRef = useRef(null)

    const { editor, characterCount, leftSidebar } = useBlockEditor({
        initialContent,
        onUpdate
    });

    const providerValue = useMemo(() => {
        return {
        }
    }, [])

    if (!editor) {
        return null
    }

    console.log('Rendering Block Editor');

    return (
        <div className="overflow-auto" ref={menuContainerRef}>
            <div className="relative flex flex-col flex-1 h-full overflow-hidden">
                <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
                <ContentItemMenu editor={editor} />
                <LinkMenu editor={editor} appendTo={menuContainerRef} />
                <TextMenu editor={editor} />
                <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
                <TableRowMenu editor={editor} appendTo={menuContainerRef} />
                <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
                <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
            </div>
        </div>
    )
}

export default BlockEditor
