import bcrypt from "bcrypt";
import client from "../../client";
import { protectResolver } from "../users.utils";

export default {
  Mutation: {
    editProfile: protectResolver(
      async (
        _,
        {
          username,
          email,
          name,
          location,
          password: newPassword,
          avatarURL,
          githubUsername,
        },
        { loggedInUser }
      ) => {
        if (!loggedInUser) {
          return {
            ok: false,
            error: "You need to login.",
          };
        }
        let hashPassword = null;
        if (newPassword) {
          hashPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            username,
            email,
            name,
            location,
            avatarURL,
            githubUsername,
            ...(hashPassword && { password: hashPassword }),
          },
        });
        if (updatedUser.id) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "Could not update profile.",
          };
        }
      }
    ),
  },
};
