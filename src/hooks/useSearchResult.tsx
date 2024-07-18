import { useEffect, useState } from 'react';

type hasName = {
  name?: string;
};

const useSearchResult = <T extends hasName>({ allData, isLoading }: { allData: T[]; isLoading: boolean }) => {
  const [showData, setShowData] = useState<T[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(true);
  useEffect(() => {
    let timmer: NodeJS.Timeout;
    if (!isLoading) {
      setIsPending(true);
      timmer = setTimeout(() => {
        console.log('hi');
        const patten = new RegExp(`${search}`, 'i');
        const showChats: T[] = allData.filter(p => {
          return patten.test(p.name!);
        });
        setShowData(showChats);
        setIsPending(false);
      }, 300);
    }

    return () => {
      if (timmer) clearTimeout(timmer);
    };
  }, [search, isLoading]);

  return { isPending, showData, search, setSearch };
};

export default useSearchResult;
