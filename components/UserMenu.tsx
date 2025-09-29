"use client";

import { User } from "@supabase/supabase-js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AvatarFallback } from "./AvatarFallback";

interface UserMenuProps {
  user: User;
}

interface UserInfo {
  expires_at: string | null;
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <Popover>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/10 cursor-pointer">
                {user.user_metadata.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement
                        ?.querySelector(".avatar-fallback")
                        ?.classList.remove("hidden");
                    }}
                  />
                ) : (
                  <AvatarFallback email={user.email || ""} />
                )}
                <div className="avatar-fallback hidden">
                  <AvatarFallback email={user.email || ""} />
                </div>
              </div>
            </PopoverTrigger>
          </TooltipTrigger>

          <TooltipContent side="bottom">
            <p className="text-sm">{user.email}</p>
          </TooltipContent>

          <PopoverContent
            className="w-auto px-4 py-3"
            side="bottom"
            align="end"
          >
            <p className="text-sm font-medium">{user.email}</p>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
}
