'use client';

import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';
import { EditorLayout } from '@/components/EditorLayout';
import { SideNavigation } from '@/components/SideNavigation';
import '@/app/fonts.css';

export default function EditorPage() {
  const { resetEditor } = useEditor();

  useEffect(() => {
    // Immediately reset the editor when component mounts
    resetEditor(true);

    // Also reset when component unmounts
    return () => {
      resetEditor(true);
    };
  }, [resetEditor]);

  return <EditorLayout SideNavComponent={SideNavigation} />;
}
