import { create } from 'zustand'

interface EditorStore {
  codeContent: string
  isEditorVisible: boolean
  setEditorVisible: (visible: boolean) => void
  setCodeContent: (content: string) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  codeContent: '',
  isEditorVisible: false,
  setEditorVisible: (visible) => set({ isEditorVisible: visible }),
  setCodeContent: (content) => set({ codeContent: content }),
})) 