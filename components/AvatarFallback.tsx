export const AvatarFallback = ({ email }: { email: string }) => {
  const initials = email.slice(0, 2).toUpperCase();
  return (
    <div className="w-full h-full bg-gray-500 flex items-center justify-center rounded-full">
      <span className="text-white text-sm font-medium">{initials}</span>
    </div>
  );
};
