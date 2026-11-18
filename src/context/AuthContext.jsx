import { createContext, useContext, useMemo, useState } from "react";

const AUTH_KEY = "sample-admin-session";

export const DEMO_ACCOUNT = {
  email: "admin@samplepadel.id",
  password: "admin123",
  name: "Admin Sample",
  role: "Super Admin",
  initials: "AS",
};

const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const value = useMemo(
    () => ({
      user,
      login(email, password) {
        const matches =
          email.trim().toLowerCase() === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password;
        if (!matches) return "Email atau kata sandi tidak cocok.";
        const session = {
          name: DEMO_ACCOUNT.name,
          email: DEMO_ACCOUNT.email,
          role: DEMO_ACCOUNT.role,
          initials: DEMO_ACCOUNT.initials,
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        setUser(session);
        return null;
      },
      logout() {
        localStorage.removeItem(AUTH_KEY);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return context;
}
