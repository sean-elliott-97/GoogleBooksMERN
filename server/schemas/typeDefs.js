const { gql } = require("apollo-server-express");

//look into input type for the savebook part of mutation
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

 
  type Book{
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String!
    link: String!

  }

  type Auth {
    token: ID!
    user: User
  }

  input savedBook{
    authors: [String]
    description: String!
    title: String!
    bookId: String!
    image: String!
    link: String!
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: savedBook): User
    removeBook(bookId: String!): User
  }
  type Query {
    me: User
  }
`;

module.exports = typeDefs;
