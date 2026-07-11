"use client";

import { createContext, useContext } from "react";

const SendContext = createContext(false);

export function SendProvider({ hasSend, children }: { hasSend: boolean; children: React.ReactNode }) {
  return <SendContext.Provider value={hasSend}>{children}</SendContext.Provider>;
}

export function useHasSendProfile() {
  return useContext(SendContext);
}
