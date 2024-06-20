import toast from 'react-hot-toast';

export const FetchWrapper = async (func: Function) => {
  try {
    await func();
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong, try later!');
  }
};
