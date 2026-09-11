import { createContext, useContext, useState } from 'react';

const VerifiedContext = createContext(null);

export const PasswordProvider = ({ children }) => {

  const [isVerified, setisVerified] = useState(false);

  const login = () => setisVerified(true);
  const logout = () => setisVerified(false);

  return (
    <VerifiedContext.Provider value={{ isVerified, login, logout }}>
      {children}
    </VerifiedContext.Provider>
  );
};

export const usePass = () => useContext(VerifiedContext);