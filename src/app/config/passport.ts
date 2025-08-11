import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envVariable } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVariable.GOOGLE_CLIENT_ID,
      clientSecret: envVariable.GOOGLE_CLIENT_SECRET,
      callbackURL: envVariable.GOOGLE_CALLBACK_URL,
    },
    async () => {}
  )
);
