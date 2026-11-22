import { supabase } from "../../services/supabase.js";
import constants from "../../constants/constants.js";

async function login(req, res) {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
  if (!data?.user?.id) {
    return res.status(400).json({ success: false, error: "User Not found!" });
  }
  const id = data.user.id;
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (userError) {
    return res.status(400).json({ success: false, error: userError.message });
  }

  if (data?.session) {
    res.cookie("access_token", data?.session?.access_token, {
      ...constants.cookieOptions,
      maxAge: constants.accessTokenExpiryTime,
    });

    res.cookie("refresh_token", data?.session?.refresh_token, {
      ...constants.cookieOptions,
      maxAge: constants.refreshTokenExpiryTime,
    });
  }

  return res.status(201).json({
    id: data.user.id,
    email: data.user.email,
    role: userData.role,
    name: userData.name,
  });
}

export { login };
