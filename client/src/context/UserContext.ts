import { createContext, useContext } from "react";

export interface UserProfile {
  id: number;
  email: string;
  username?: string;
}

interface UserContextValue {
  currentUser: UserProfile | null;
  updateUsername: (username: string) => void;
}

export const UserContext = createContext<UserContextValue>({
  currentUser: null,
  updateUsername: () => {},
});

export const useCurrentUser = () => useContext(UserContext);
