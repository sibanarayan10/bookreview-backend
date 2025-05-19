import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error happen at :");
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
const signUp = async (req, res) => {
  const { fullname, email, phone, password, confirm_password } = req.body;
  console.log(req.body);
  try {
    // if (
    //   [fullname, phone, password, confirm_password, email].some(
    //     (item) => item?.trim()
    //   )
    // ) {
    //   return res
    //     .status(400)
    //     .json(new ApiError(400, "All fields are required!"));
    // }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res
        .status(402)
        .json(
          new ApiError(
            402,
            "User Already exist with this Email!Try with another"
          )
        );
    }
    if (password !== confirm_password) {
      return res.status(400).json(new ApiError(400, "Password mismatched!"));
    }

    const user = await User.create({ fullname, phone, email, password });

    return res
      .status(201)
      .json(new ApiResponse(true, 201, "Sign-Up successfully", user));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Server is not responding for some reason.Try after some time",
          error
        )
      );
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    if (!email || !password) {
      throw new ApiError(400, "Email or password is required");
    }
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      throw new ApiError(
        404,
        "User does not exist!,Please Sign up to create an Account"
      );
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json(new ApiError(400, "Password for this email is incorrect!"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!loggedInUser) {
      return res
        .status(402)
        .json(new ApiResponse(false, 402, "user not authenticated!"));
    }
    const options = {
      httpOnly: true,
      sameSite: None, //cross-site
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          true,
          200,
          "User logged in successfully",

          { user: loggedInUser, accessToken, refreshToken }
        )
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    } else {
      return res
        .status(500)
        .json(new ApiError(500, "An unexpected error occurred", error.message));
    }
  }
};

export { signUp, loginUser };
