import { createContext, useContext, useState, useEffect, useRef } from "react";
import { BankifyUserDto } from "../models/bankifyUser";

type AuthContextType = {
  user: BankifyUserDto | null;
  setUser: (user: BankifyUserDto | null) => void;
  logout: () => void;
  sessionExpired: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const IDLE_TIMEOUT_MS = 2 * 60 * 1000;
const LAST_ACTIVITY_KEY = "bankify_last_activity";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<BankifyUserDto | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const clearIdleTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const logout = (showModal = false) => {
    clearIdleTimer();
    setUserState(null);
    setSessionExpired(showModal);
    localStorage.removeItem("bankify_user");
    localStorage.removeItem("token");
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  };

  const expireSession = () => {
    if (user) {
      logout(true);
    }
  };

  const resetIdleTimer = () => {
    clearIdleTimer();
    timeoutRef.current = window.setTimeout(() => {
      expireSession();
    }, IDLE_TIMEOUT_MS);
  };

  const updateLastActivity = () => {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    resetIdleTimer();
  };

  const handleUserActivity = () => {
    if (user) {
      updateLastActivity();
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("bankify_user");
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as BankifyUserDto;
      setUserState(parsedUser);

      if (lastActivity) {
        const lastTime = Number(lastActivity);
        if (!Number.isNaN(lastTime) && Date.now() - lastTime >= IDLE_TIMEOUT_MS) {
          expireSession();
          return;
        }
      }

      updateLastActivity();
    }
  }, []);

  useEffect(() => {
    if (!user) {
      clearIdleTimer();
      return;
    }

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleUserActivity);
    });

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LAST_ACTIVITY_KEY && event.newValue) {
        const lastTime = Number(event.newValue);
        if (!Number.isNaN(lastTime) && Date.now() - lastTime >= IDLE_TIMEOUT_MS) {
          expireSession();
        }
      }

      if (event.key === "bankify_user" && event.newValue === null) {
        logout();
      }
    };

    window.addEventListener("storage", handleStorage);

    resetIdleTimer();

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserActivity);
      });
      window.removeEventListener("storage", handleStorage);
      clearIdleTimer();
    };
  }, [user]);

  const setUser = (userData: BankifyUserDto | null) => {
    setUserState(userData);
    setSessionExpired(false);

    if (userData) {
      localStorage.setItem("bankify_user", JSON.stringify(userData));
      updateLastActivity();
    } else {
      localStorage.removeItem("bankify_user");
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      clearIdleTimer();
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, sessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Wrap app with AuthProvider");
  return context;
};