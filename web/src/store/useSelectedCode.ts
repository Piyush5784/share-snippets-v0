import { create } from "zustand";

type createProps = {
  title: string;
  description: string;
  isPublic: boolean;
  language: string;
  code: string;
  id: string;
  isStarred: boolean;
  tags: string[];
};

type State = createProps;

type Actions = {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setIsPublic: (isPublic: boolean) => void;
  setLanguage: (language: string) => void;
  setCode: (code: string) => void;
  setIsStarred: (isStarred: boolean) => void;
  setTags: (tags: string[]) => void;
  setId: (id: string) => void;
  reset: () => void;
};

const initialState: State = {
  title: "",
  description: "",
  isPublic: false,
  isStarred: false,
  language: "",
  code: "",
  id: "",
  tags: [],
};

export const useSelectedCodeStore = create<State & Actions>((set) => ({
  ...initialState,
  setTitle: (title) => set((state) => ({ ...state, title })),
  setDescription: (description) => set((state) => ({ ...state, description })),
  setIsPublic: (isPublic) => set((state) => ({ ...state, isPublic })),
  setIsStarred: (isStarred) => set((state) => ({ ...state, isStarred })),
  setLanguage: (language) => set((state) => ({ ...state, language })),
  setCode: (code) => set((state) => ({ ...state, code })),
  setTags: (tags) => set((state) => ({ ...state, tags })),
  setId: (id: string) => set((state) => ({ ...state, id })),

  reset: () => set(() => ({ ...initialState })),
}));
