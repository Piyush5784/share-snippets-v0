import { create } from "zustand";

type createProps = {
  searchQuery: string;
};

type State = createProps;

type Actions = {
  setSearchQuery: (search: string) => void;
  reset: () => void;
};

const initialState: State = {
  searchQuery: "",
};

export const useSearch = create<State & Actions>((set) => ({
  ...initialState,
  setSearchQuery(search) {
    set((state) => ({ ...state, searchQuery: search }));
  },

  reset() {
    set(() => ({ ...initialState }));
  },
}));
