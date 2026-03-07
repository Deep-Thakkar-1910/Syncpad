import { create } from "zustand";

type PresenceStore = {
  presenceOpen: boolean;
  togglePresence: () => void;
};

export const usePresence = create<PresenceStore>((set) => ({
  presenceOpen: false,
  togglePresence: () =>
    set(({ presenceOpen }) => ({ presenceOpen: !presenceOpen })),
}));
