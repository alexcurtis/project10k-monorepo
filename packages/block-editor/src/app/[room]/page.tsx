'use client'

import dynamic from "next/dynamic";
import 'iframe-resizer/js/iframeResizer.contentWindow'

import { BlockEditor } from '@/components/BlockEditor'

function Document() {
  return (
    <>
        <BlockEditor/>
    </>
  )
}

// Turn Off SSR for Main App
export default dynamic(async () => Document, { ssr: false });

