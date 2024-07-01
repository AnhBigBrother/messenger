import { useEffect, useState } from 'react';

type hasName = {
  name?: string;
};

const useSearchResult = <T extends hasName>({ allData, setIsPending }: { allData: T[]; setIsPending: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [showData, setShowData] = useState<T[]>([]);
  const [search, setSearch] = useState<string>('');
  useEffect(() => {
    setIsPending(true);
    const timmer = setTimeout(() => {
      const patten = new RegExp(`${search}`, 'i');
      const showChats: T[] = allData.filter(p => {
        return patten.test(p.name!);
      });
      setShowData(showChats);
      setIsPending(false);
    }, 300);

    return () => clearTimeout(timmer);
  }, [search, allData]);

  return { showData, search, setSearch };
};

export default useSearchResult;
