import { Spinner } from '@/components/ui/loader';

export const SubmitButton = ({ children, isPending }: { children: any; isPending: boolean }) => {
  return (
    <button
      type='submit'
      disabled={isPending}
      className='bg-gradient-to-r from-sky-600 via-indigo-500 to-sky-600 hover:from-indigo-500 hover:via-sky-500 hover:to-indigo-500 text-white font-medium rounded-md h-11 w-full disabled:bg-opacity-70 disabled:from-indigo-500 disabled:via-sky-500 disabled:to-indigo-500 flex items-center justify-center transition-all'>
      {isPending ? (
        <Spinner
          color='white'
          size='sm'
        />
      ) : (
        children
      )}
    </button>
  );
};
