export const Query = {
  users: (parent: any, args: any, { prisma }: any) => {
    return prisma.user.findMany();
  },
};
