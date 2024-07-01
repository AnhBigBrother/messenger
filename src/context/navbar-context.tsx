'use client';

import { createContext, useContext, useState } from 'react';

type navbarContextType = {
  activeSection: 'chat' | 'people';
  setActiveSection: React.Dispatch<React.SetStateAction<'chat' | 'people'>>;
  activeSideBox: boolean;
  setActiveSideBox: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavbarContext = createContext<navbarContextType | null>(null);

export const useNavbarContext = () => {
  const context = useContext(NavbarContext);
  if (context === null) throw new Error('useActiveSectionContext must be used within an ActiveSectionContextProvider');
  return context;
};

export default function NavbarContextProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<'chat' | 'people'>('chat');
  const [activeSideBox, setActiveSideBox] = useState<boolean>(true);
  return (
    <NavbarContext.Provider
      value={{
        activeSection,
        setActiveSection,
        activeSideBox,
        setActiveSideBox,
      }}>
      {children}
    </NavbarContext.Provider>
  );
}
