import bcrypt from "bcrypt";
import client from "../../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { username, email, name, location, password, avatarURL, githubUsername }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          return {
            ok: false,
            error: "This username or email is already taken.",
          };
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await client.user.create({
          data: {
            username,
            email,
            name,
            location,
            password: hashPassword,
            avatarURL,
            githubUsername,
          },
        });
        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          error: e,
        };
      }
    },
  },
};
