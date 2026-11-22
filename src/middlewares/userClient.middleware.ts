import type { Request, Response, NextFunction } from "express";
import { errors, jwtVerify } from "jose";
import { getJWKKey } from "../services/jwtVerify.js";
import { createUserClient, refreshSession } from "../services/supabase.js";
import constants from "../constants/constants.ts";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const { access_token: cookieAccessToken, refresh_token: cookieRefreshToken } =
    req.cookies;
  const JWK = getJWKKey();
  try {
    await jwtVerify(cookieAccessToken, JWK);
    return next();
  } catch (error) {
    console.error(error);
    if (!cookieRefreshToken) {
      return res
        .status(400)
        .json({ success: false, error: "Unauthorised, Please login!" });
    }
    if (error instanceof errors.JWTExpired) {
      // if (error?.code === "ERR_JWT_EXPIRED") {
      const {
        error: refreshError,
        token: refreshedAccessToken,
        refreshToken: refreshedRefreshToken,
      } = await refreshSession(cookieRefreshToken);
      if (refreshError) {
        return res
          .status(400)
          .json({ success: false, error: refreshError.message });
      }
      if (!refreshedAccessToken || !refreshedRefreshToken) {
        return res
          .status(400)
          .json({ success: false, error: "Unauthorised, Please login!" });
      }

      req.cookies.access_token = refreshedAccessToken;
      req.cookies.refresh_token = refreshedRefreshToken;
      res.cookie("access_token", refreshedAccessToken, {
        ...constants.cookieOptions,
        maxAge: constants.accessTokenExpiryTime,
      });

      res.cookie("refresh_token", refreshedRefreshToken, {
        ...constants.cookieOptions,
        maxAge: constants.refreshTokenExpiryTime,
      });
      return next();
    }

    if (error instanceof errors.JOSEError) {
      return res.status(401).json({ error: error.message, code: error.code });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}

async function userClient(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies?.access_token;
  const refreshToken = req.cookies?.refresh_token;
  if (!accessToken || !refreshToken) {
    return res
      .status(400)
      .json({ success: false, error: "Unauthorised, Please login!" });
  }

  try {
    const { client, error } = await createUserClient(accessToken, refreshToken);
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    req.supabase = client;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({
        success: false,
        error: err instanceof Error ? err.message : "Unauthorised",
      });
  }
}

export { userClient, authenticate };
