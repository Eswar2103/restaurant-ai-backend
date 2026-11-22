async function changePassword(req, res) {
  const { password, newPassword } = req.body;

  const { data, error } = await req.supabase.auth.updateUser({
    password: newPassword,
    current_password: password,
  });
  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
  return res.status(200).json({ message: "Password changed successfully" });
}

export { changePassword };
