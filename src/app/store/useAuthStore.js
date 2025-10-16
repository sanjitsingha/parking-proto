import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),

      // ✅ New function to refresh user from Supabase
      fetchUserData: async (userId) => {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
          return;
        }

        set({ user: data }); // Update persisted user
      },
    }),
    {
      name: "auth-storage", // key in localStorage
    }
  )
);
