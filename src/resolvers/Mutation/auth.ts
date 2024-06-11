import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtHelper } from "../../utils/jwtHelpers";
import config from "../../config";

interface userInfo {
  name: string;
  email: string;
  password: string;
}

export const authResolvers = {
  signup: async (parent: any, args: userInfo, { prisma }: any) => {
    const hashedPassword = await bcrypt.hash(args.password, 12);
    console.log(hashedPassword);

    const isExist = await prisma.user.findFirst({
      where: {
        email: args.email,
      },
    });

    console.log(isExist);

    if (isExist) {
      return {
        userError: "Already this email is registered!",
        token: null,
      };
    }

    const user = await prisma.user.create({
      data: {
        name: args.name,
        email: args.email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, "signTrue", {
      expiresIn: "1d",
    });

    return {
      token,
    };
  },

  signin: async (parent: any, args: any, { prisma }: any) => {
    const user = await prisma.user.findFirst({
      where: {
        email: args.email,
      },
    });

    if (!user) {
      return {
        userError: "User not found!",
        token: null,
      };
    }

    const correctPass = await bcrypt.compare(args.password, user.password);

    if (!correctPass) {
      return {
        userError: "Incorrect Password!",
        token: null,
      };
    }
    const token = await jwtHelper.generateToken(
      { userId: user.id },
      config.jwt.secret as string
    );
    return {
      userError: null,
      token,
    };
  },
};
