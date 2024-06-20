'use client';

import { createContext, useContext, useState } from 'react';

type navbarContextType = {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  activeSearchBox: boolean;
  setActiveSearchBox: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavbarContext = createContext<navbarContextType | null>(null);

export const useNavbarContext = () => {
  const context = useContext(NavbarContext);
  if (context === null) throw new Error('useActiveSectionContext must be used within an ActiveSectionContextProvider');
  return context;
};

export default function NavbarContextProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<string>('chat');
  const [activeSearchBox, setActiveSearchBox] = useState<boolean>(true);
  return (
    <NavbarContext.Provider
      value={{
        activeSection,
        setActiveSection,
        activeSearchBox,
        setActiveSearchBox,
      }}>
      {children}
    </NavbarContext.Provider>
  );
}
