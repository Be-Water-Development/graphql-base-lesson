import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    users: (parent, args, context) => {
      console.log("HIT USERS");
      return prisma.user.findMany();
    },
    user: (_, { id }) => prisma.user.findUnique({ where: { id } }), // => {id: id, name: name, email: email, posts: ?????, comments: ??? }
    posts: () => prisma.post.findMany(),
    post: (_, { id }) => prisma.post.findUnique({ where: { id } }),
  },
  Mutation: {
    createUser: (_, { name, email }) =>
      prisma.user.create({ data: { name, email } }),
    createPost: (_, { title, content, authorId }) =>
      prisma.post.create({ data: { title, content, authorId } }),
    createComment: (_, { content, postId, authorId }) =>
      prisma.comment.create({ data: { content, postId, authorId } }),
  },
  User: {
    posts: (parent) => {
      console.log("HIT POSTS")
      return prisma.post.findMany({ where: { authorId: parent.id } });
    },
    comments: (parent) =>
      prisma.comment.findMany({ where: { authorId: parent.id } }),
  },
  Post: {
    author: (parent) =>
      prisma.user.findUnique({ where: { id: parent.authorId } }),
    comments: (parent) =>
      prisma.comment.findMany({ where: { postId: parent.id } }),
  },
  Comment: {
    post: (parent) => prisma.post.findUnique({ where: { id: parent.postId } }),
    author: (parent) =>
      prisma.user.findUnique({ where: { id: parent.authorId } }),
  },
};
