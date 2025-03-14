import { prisma } from "../../prisma/prisma";
import { comparePassword, hashPassword } from "./bcrypt";
import { redis } from "./redis-store";
import nodemailer from "nodemailer";

const REDIS_PREFIX = "otp";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_EMAIL_USER, // Your Gmail email
    pass: process.env.NEXT_EMAIL_PASS, // Your Gmail app password
  },
});

//helper to issue a new 2fa challenge for user and send them them code
//if there is already a valid code it just resend the same code
export const issueChallenge = async (userId: string, email: string) => {
  try {
    const array = new Uint32Array(1);
    const code = (crypto.getRandomValues(array)[0] % 900000) + 100000;
    const hash = await hashPassword(code.toString());
    const challenge = { codeHash: hash, email };

    await redis.setex(`${REDIS_PREFIX}:uid-${userId}`, 60 * 5, challenge);

    // Send email with the OTP code
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your 2FA Code",
      text: `Your authentication code is: ${code}. It will expire in 5 minutes.`,
    });
  } catch (error) {
    throw error;
  }
};

interface Challenge {
  codeHash: string;
  email: string;
}

//Check whether a user supplied challenge code is correct, and if so, update the session

export const completeChallenge = async (userId: string, code: string) => {
  const challenge = await redis.get<Challenge>(`${REDIS_PREFIX}:uid-${userId}`);

  if (challenge) {
    const isCorrect = await comparePassword(code, challenge.codeHash);
    if (isCorrect) {
      const session = await prisma.session.findFirst({
        where: { userId, requires2FA: true },
      });
      if (session) {
        await prisma.session.updateMany({
          where: {
            sessionToken: session.sessionToken,
            userId,
          },
          data: {
            requires2FA: false,
          },
        });
        await redis.del(`${REDIS_PREFIX}:uid-${userId}`);
        return { success: true, message: "2FA enabled successfully!" };
      }
      return {
        success: false,
        message: "Could not find the session for the user",
      };
    }
    return {
      success: false,
      message: "Incorrect verification code - please try again!",
    };
  }
  return {
    success: false,
    message: "Challenge does not exist - please try again!",
  };
};
