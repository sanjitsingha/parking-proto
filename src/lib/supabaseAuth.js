import { supabase } from "./supabaseClient";

// Register user
export const registerUser = async (fullName, phone, password, vehicleType) => {
  // Check if phone already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("phone_number", phone)
    .single();

  if (existingUser) {
    throw new Error("Phone number is already registered.");
  }

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        fullname: fullName,
        phone_number: phone,
        password: password, // ❌ Note: plain text for now. You can hash it later for security.
        vehicle_type: vehicleType,
        favourite: [],
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Login user
export const loginUser = async (phone, password) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("phone_number", phone)
    .eq("password", password) // match exactly
    .single();

  if (error || !data) {
    throw new Error("Invalid phone or password");
  }

  return data;
};

// Forgot password (your support team will handle reset, but here's a placeholder)
export const resetPassword = async (phone, newPassword) => {
  const { data, error } = await supabase
    .from("users")
    .update({ password: newPassword })
    .eq("phone_number", phone)
    .select();

  if (error) throw error;
  return data;
};
