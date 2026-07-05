"use client";

import { createContext, useContext, useState } from "react";
import { Role } from "@/lib/types";

export type PreviewRole = Role;

const RoleContext = createContext<{
  role: PreviewRole;
  setRole: (r: PreviewRole) => void;
}>({ role: "parent", setRole: () => {} });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<PreviewRole>("parent");
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function usePreviewRole() {
  return useContext(RoleContext);
}
