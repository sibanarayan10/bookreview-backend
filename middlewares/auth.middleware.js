import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, [], "Please Sign-in to continue!"));
    }
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Token Expired!", error));
  }
};
