"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Inserts a new reservation into Supabase table.
 * @param {Object} reservation - The reservation object
 * @param {string} reservation.user_id - ID of the logged-in user
 * @param {string} reservation.user_name - Name of the logged-in user
 * @param {string} reservation.space_id - Parking space ID
 * @param {string} reservation.vehicle_type - 'car' or 'bike'
 * @param {string} reservation.space_owner - Parking space owner (optional)
 * @returns {Object} { data, error }
 */
export const insertReservation = async (reservation) => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("pre_reserve") // change this to your table name
    .insert([reservation]);

  if (error) {
    console.error("Supabase insert error:", error);
    return { data: null, error };
  }

  return { data, error: null };
};
