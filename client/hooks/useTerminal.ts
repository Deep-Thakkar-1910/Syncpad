import { create } from "zustand";

type TerminalStore = {
  terminalOpen: boolean;
  toggleTerminal: () => void;
};

export const useTerminal = create<TerminalStore>((set) => ({
  terminalOpen: false,
  toggleTerminal: () =>
    set(({ terminalOpen }) => ({ terminalOpen: !terminalOpen })),
}));
