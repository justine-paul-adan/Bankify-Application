import { createContext, useContext, useState, useEffect } from "react";
import { BankifyUserDto } from "../models/bankifyUser";

type AuthContextType = {
  user: BankifyUserDto | null;
  setUser: (user: BankifyUserDto | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<BankifyUserDto | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("bankify_user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  const setUser = (userData: BankifyUserDto | null) => {
    setUserState(userData);

    if (userData) {
      localStorage.setItem("bankify_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("bankify_user");
    }
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("bankify_user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Wrap app with AuthProvider");
  return context;
};