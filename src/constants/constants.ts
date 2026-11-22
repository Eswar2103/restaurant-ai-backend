interface AppConfig {
  emailRegex: RegExp;
  passwordRegex: RegExp;
  roles: string[];
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
    path: string;
  };
  accessTokenExpiryTime: number;
  refreshTokenExpiryTime: number;
}

export default Object.freeze({
  emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  passwordRegex:
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{4,12}$/,
  roles: ["reviewer", "owner"],
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
  accessTokenExpiryTime: 1000 * 60 * 60 * 12,
  refreshTokenExpiryTime: 1000 * 60 * 60 * 24,
} as const satisfies AppConfig);
