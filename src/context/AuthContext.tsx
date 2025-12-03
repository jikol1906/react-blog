import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// 1. Define the User interface based on your db.json structure
export interface User {
  id: number;
  username: string;
  email: string;
  // We exclude 'password' from the state for security best practices
}

// 2. Define the shape of our Context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 3. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Create the Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch user from json-server filtering by email
      // See Chapter 8.1 regarding fetch API [cite: 2655]
      const response = await fetch(`http://localhost:3000/users?email=${email}`);
      
      if (!response.ok) {
        throw new Error("Server error");
      }

      const users = await response.json();

      // Check password match
      if (users.length > 0 && users[0].password === password) {
        // Create a safe user object without the password
        const userData: User = {
          id: users[0].id,
          username: users[0].username,
          email: users[0].email,
        };

        // Update State
        setUser(userData);
        
        // Persist to LocalStorage (so refresh doesn't log you out)
        localStorage.setItem("user", JSON.stringify(userData));
        
        return true; // Login successful
      } else {
        setError("Invalid email or password");
        return false; // Login failed
      }
    } catch (err) {
      setError("Network error or server unavailable");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};