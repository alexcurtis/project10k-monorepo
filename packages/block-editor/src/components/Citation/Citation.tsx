'use client'

import { Editor as CoreEditor } from '@tiptap/core'
import { memo, useEffect, useState } from 'react'
// import { TableOfContentsStorage } from '@tiptap-pro/extension-table-of-contents'
import { cn } from '@/lib/utils'

import { Badge } from '@/catalyst/badge'
import { Button } from '@/catalyst/button'
import { Text } from '@/catalyst/text'
import { Fragment } from '@tiptap/pm/model'

export type Citation = {
  content: Fragment
}

const demoText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas laoreet ultricies urna sit amet porta. Suspendisse lacinia turpis velit, ac pretium nulla sollicitudin quis. Phasellus non diam mi. Morbi eu dui sed diam sollicitudin congue. Ut vitae faucibus diam. Praesent et massa bibendum orci commodo hendrerit vel et nibh. Donec commodo nisi eu eleifend pharetra. Donec imperdiet, ex vel ultrices malesuada, est lectus cursus urna, in volutpat turpis nibh in turpis.'

export const Citation = memo(({ content }: Citation) => {
  //   const [data, setData] = useState<TableOfContentsStorage | null>(null)

  //   useEffect(() => {
  // const handler = ({ editor: currentEditor }: { editor: CoreEditor }) => {
  //   setData({ ...currentEditor.extensionStorage.tableOfContents })
  // }

  // handler({ editor })

  // editor.on('update', handler)
  // editor.on('selectionUpdate', handler)

  // return () => {
  //   editor.off('update', handler)
  //   editor.off('selectionUpdate', handler)
  // }
  //   }, [editor])

  return (
    <div className="">
      <div className="">
        <Badge>{'Carvana > 10-Q > Ended 03/31/24'}</Badge>
        <Button>Save changes</Button>
      </div>
      <Text>{demoText}</Text>

      {/* {data && data.content.length > 0 ? (
        <div className="flex flex-col gap-1">
          {data.content.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{ marginLeft: `${1 * item.level - 1}rem` }}
              onClick={onItemClick}
              className={cn(
                'block font-medium text-neutral-500 dark:text-neutral-300 p-1 rounded bg-opacity-10 text-sm hover:text-neutral-800 transition-all hover:bg-black hover:bg-opacity-5 truncate w-full',
                item.isActive && 'text-neutral-800 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-900',
              )}
            >
              {item.itemIndex}. {item.textContent}
            </a>
          ))}
        </div>
      ) : (
        <div className="text-sm text-neutral-500">kiss my ass</div>
      )} */}
    </div>
  )
})

Citation.displayName = 'Citation'
