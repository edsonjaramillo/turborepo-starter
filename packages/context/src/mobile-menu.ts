import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";

export type MobileMenuContext = ReturnType<typeof createMobileMenuStore>;

interface State {
	isOpen: boolean;
}

interface Actions {
	open: () => void;
	close: () => void;
	toggle: () => void;
}

export interface MobileMenuStore extends State, Actions {}

export function createMobileMenuStore(): UseBoundStore<StoreApi<MobileMenuStore>> {
	return create<MobileMenuStore>((set) => ({
		isOpen: false,
		open() {
			set({ isOpen: true });
		},
		close() {
			set({ isOpen: false });
		},
		toggle() {
			set((state) => ({ isOpen: !state.isOpen }));
		},
	}));
}
