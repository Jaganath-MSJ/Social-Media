import pkg from "jsonwebtoken";
const { sign } = pkg;

export const createAccessToken = (userId, role) => {
  return sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (userId) => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const sendAccessToken = (req, res, accessToken) => {
  res.send({
    status: true,
    accessToken,
    msg: "Login successfully",
  });
};

export const sendRefreshToken = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/api/auth/refresh_token",
  });
};
