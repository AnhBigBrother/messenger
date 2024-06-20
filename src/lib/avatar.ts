const AvatarUrlArray: string[] = [
  '/images/man-avatar-1.jpg',
  '/images/man-avatar-2.jpg',
  '/images/man-avatar-3.jpg',
  '/images/man-avatar-4.jpg',
  '/images/woman-avatar-1.jpg',
  '/images/woman-avatar-2.jpg',
  '/images/woman-avatar-3.jpg',
  '/images/woman-avatar-4.jpg',
];

const getRandomAvatar = () => {
  return AvatarUrlArray[Math.floor(Math.random() * 8)];
};

export { AvatarUrlArray, getRandomAvatar };
