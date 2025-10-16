import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();
export const toggleFavourite = async (userId, spaceId) => {
  // 1️⃣ Fetch existing favourites
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("favourite")
    .eq("id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching user:", fetchError);
    return null;
  }

  let updatedFavourites = user.favourite || [];

  // 2️⃣ Toggle the space ID
  if (updatedFavourites.includes(spaceId)) {
    updatedFavourites = updatedFavourites.filter((id) => id !== spaceId);
  } else {
    updatedFavourites.push(spaceId);
  }

  // 3️⃣ Update in Supabase
  const { data, error: updateError } = await supabase
    .from("users")
    .update({ favourite: updatedFavourites })
    .eq("id", userId)
    .select();

  if (updateError) {
    console.error("Error updating favourites:", updateError);
    return null;
  }

  return updatedFavourites;
};
