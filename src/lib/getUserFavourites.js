import { supabase } from "@/lib/supabaseClient";

/**
 * Fetch all favourite parking lots for a given user ID
 * @param {string} userId - UUID of the user
 * @returns {Promise<Array>} - List of favourite parking lots
 */
export const getUserFavourites = async (userId) => {
  try {
    // 1️⃣ Fetch favourite IDs from user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("favourite")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    const favouriteIds = userData?.favourite || [];

    // 2️⃣ If no favourites, return empty
    if (favouriteIds.length === 0) {
      return [];
    }

    // 3️⃣ Fetch parking lots matching favourite IDs
    const { data: parkingData, error: parkingError } = await supabase
      .from("parking_lots")
      .select("*")
      .in("id", favouriteIds);

    if (parkingError) throw parkingError;

    return parkingData;
  } catch (err) {
    console.error("❌ Error fetching favourites:", err);
    return [];
  }
};
