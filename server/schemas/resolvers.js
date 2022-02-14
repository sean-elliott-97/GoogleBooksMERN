const { User, Book } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({_id:context.user._id})
          .select("-__v -password")
          .populate("books");
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const userNewBook = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.input } },
          { new: true }
        );
        return userNewBook;
      }
      throw new AuthenticationError("You must be signed in to add a new book!");
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const userRemoveBook = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: args._id } },
          { new: true }
        );
        return userRemoveBook;
      }
      throw new AuthenticationError("You must be signed in to remove a book");
    },
  },
};

module.exports = resolvers;
