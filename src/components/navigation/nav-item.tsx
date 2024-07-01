'use client';

import { useNavbarContext } from '@/context/navbar-context';

type ItemProps = {
  children: React.ReactNode;
  sectionName: 'chat' | 'people';
};

export const NavItem = ({ children, sectionName }: ItemProps) => {
  const { activeSection, setActiveSection, setActiveSideBox } = useNavbarContext();

  return (
    <button
      onClick={() => {
        if (sectionName === activeSection) {
          setActiveSideBox(prev => !prev);
        } else {
          setActiveSection(sectionName);
          setActiveSideBox(true);
        }
      }}
      title={sectionName}
      className={`flex justify-center items-center w-fit h-fit hover:text-sky-500 hover:bg-gray-200 p-3 rounded-md ${activeSection === sectionName ? 'text-sky-500' : 'text-gray-500'}`}>
      {children}
    </button>
  );
};
