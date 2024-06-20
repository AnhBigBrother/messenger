'use client';

import { useNavbarContext } from '@/context/navbar-context';

type ItemProps = {
  children: React.ReactNode;
  sectionName: string;
};

export const NavItem = ({ children, sectionName }: ItemProps) => {
  const { activeSection, setActiveSection, activeSearchBox, setActiveSearchBox } = useNavbarContext();

  return (
    <button
      onClick={() => {
        if (sectionName === activeSection) {
          setActiveSearchBox(prev => !prev);
        } else {
          setActiveSection(sectionName);
          setActiveSearchBox(true);
        }
      }}
      className={`flex justify-center items-center w-fit h-fit hover:text-sky-500 hover:bg-gray-200 p-3 rounded-md ${activeSection === sectionName ? 'text-sky-500' : 'text-gray-500'}`}>
      {children}
    </button>
  );
};
