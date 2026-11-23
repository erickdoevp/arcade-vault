"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type User = { name: string } | null;

type UserContextValue = {
  user: User;
  login: (name: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const login = (name: string) => {
    setUser({ name: (name || "PLAYER1").toUpperCase().slice(0, 10) });
  };
  const logout = () => setUser(null);

  return <UserContext value={{ user, login, logout }}>{children}</UserContext>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
