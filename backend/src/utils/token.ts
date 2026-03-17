import jwt, { SignOptions } from "jsonwebtoken";
import ENV from "../config/env.js";

/**
 * Utility to generate a signed JSON Web Token (JWT)
 * @param payload Data to encode in the token (e.g., userId)
 * @param secret Encryption key (defaults to JWT_SECRET env)
 * @param options JWT options like expiration (defaults to JWT_EXPIRES_IN env)
 */
export const createToken = (
  payload: any,
  secret: string = ENV.JWT.SECRET,
  options: SignOptions = {
    expiresIn: ENV.JWT.EXPIRES_IN as SignOptions["expiresIn"],
  },
) => jwt.sign(payload, secret, options);

/**
 * Utility to verify a JWT's integrity and decode its payload
 * @param token The JWT string to verify
 * @param secret The encryption key used to sign the token
 * @returns Decoded payload if valid, throws error otherwise
 */
export const verifyToken = (
  token: string,
  secret: string = ENV.JWT.SECRET,
) => jwt.verify(token, secret);
