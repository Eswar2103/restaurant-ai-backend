import { supabase } from "../../services/supabase.js";
import constants from "../../constants/constants.js";

async function signup(req, res) {
  const { email, password, name, role } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  if (!data?.user?.id) {
    return res.status(400).json({ success: false, error: "User Not found!" });
  }

  const { error: userError } = await supabase.from("users").insert({
    id: data.user.id,
    name,
    role,
  });
  if (userError) {
    return res.status(400).json({ success: false, error: userError.message });
  }

  const { id, e } = data?.user;

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
    success: true,
    message: "User signup successfully",
    data: { id, email: e },
  });
}

export { signup };
