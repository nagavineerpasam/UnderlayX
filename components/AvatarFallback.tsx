import { User } from "lucide-react";

export const AvatarFallback = ({ email }: { email: string }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center rounded-full">
      <User className="w-4 h-4 text-white" />
    </div>
  );
};
