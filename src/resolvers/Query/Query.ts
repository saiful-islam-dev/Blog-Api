export const Query = {
  me: async (parent: any, args: any, { prisma, userInfo }: any) => {
    return await prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },

  profile: async (parent: any, args: any, { prisma, userInfo }: any) => {
    return await prisma.profile.findUnique({
      where: {
        userId: Number(args.userId),
      },
    });
  },

  users: (parent: any, args: any, { prisma }: any) => {
    return prisma.user.findMany();
  },

  posts: async (parent: any, args: any, { prisma, userInfo }: any) => {
    console.log("Posts");
    return await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [

        {
          createdAt: "desc",
        },
      ],
    });
  },
};
