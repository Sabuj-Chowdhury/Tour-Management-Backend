/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVariable } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

// for custom authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        // if (!isUserExist) {
        //   return done(null, false, { message: "User does not exist" });
        // }
        if (!isUserExist) {
          return done("User does not exist");
        }

        if (!isUserExist.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified!");
          return done(`User is not verified!`);
        }
        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          // throw new AppError(
          //   httpStatus.BAD_REQUEST,
          //   `User is ${isUserExist.isActive}!`
          // );
          return done(`User is ${isUserExist.isActive}!`);
        }
        if (isUserExist.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted!");
          return done(`User is Deleted!`);
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider === "google"
        );

        // if (isGoogleAuthenticated) {
        //   return done(null, false, {
        //     message:
        //       "authenticated through Google login, please set a password to login!",
        //   });
        // }
        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(
            "authenticated through Google login, please set a password to login!"
          );
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );
        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match!" });
        }
        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

// for google login
passport.use(
  new GoogleStrategy(
    {
      clientID: envVariable.GOOGLE_CLIENT_ID,
      clientSecret: envVariable.GOOGLE_CLIENT_SECRET,
      callbackURL: envVariable.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "no email found!" });
        }
        let isUserExist = await User.findOne({ email });

        if (isUserExist && !isUserExist.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified!");
          return done(null, false, { message: `User is not verified!` });
        }
        if (
          isUserExist &&
          (isUserExist.isActive === IsActive.BLOCKED ||
            isUserExist.isActive === IsActive.INACTIVE)
        ) {
          // throw new AppError(
          //   httpStatus.BAD_REQUEST,
          //   `User is ${isUserExist.isActive}!`
          // );
          return done(null, false, {
            message: `User is ${isUserExist.isActive}!`,
          });
        }
        if (isUserExist && isUserExist.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted!");
          return done(null, false, { message: `User is Deleted!` });
        }

        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerID: profile.id,
              },
            ],
          });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(`Google Strategy error:  ${error}`);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
