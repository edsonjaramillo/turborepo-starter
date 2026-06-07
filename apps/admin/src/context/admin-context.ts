import { createDisclosureStore } from "@repo/context/disclosure";
import { createSessionStore } from "@repo/context/session";

export const useAvatarDisclosure = createDisclosureStore();
export const useSession = createSessionStore();
