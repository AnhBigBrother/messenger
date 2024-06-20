export const Spinner = ({ color, size }: { color: 'black' | 'white'; size: 'sm' | 'md' | 'lg' }) => {
  return <div className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-8 w-8' : 'h-12 w-12'} animate-spin rounded-full border-b-2 ${color === 'black' ? 'border-black' : 'border-white'}`}></div>;
};
