import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "5h"
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 60 * 60 * 1000,
    });

    return token;
};

