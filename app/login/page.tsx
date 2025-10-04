"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthDialog } from "@/components/AuthDialog";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      // Check if we have a session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/custom-editor");
        return;
      }
      // If no session but we have a code, we're in the OAuth callback
      const code = searchParams.get("code");
      if (code) {
        router.push("/custom-editor");
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <AuthDialog
        isOpen={true}
        onClose={() => router.push("/custom-editor")}
        returnUrl="/custom-editor"
      />
    </div>
  );
}
