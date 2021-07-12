const { ApolloServer, PubSub } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");

const PORT = process.env.PORT || 5000;

// const typeDefs = gql`
//   type Post {
//     id: ID!
//     username: String!
//     body: String!
//     createdAt: String!
//   }
//   type Query {
//     getPosts: [Post]
//   }
// `;

// const resolvers = {
//   Query: {
//     async getPosts() {
//       try {
//         const posts = await Post.find({});
//         console.log(posts);
//         return posts;
//       } catch (err) {
//         throw new Error(err);
//       }
//     },
//   },
// };
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB connected");
    server.listen({ port: PORT }).then((res) => {
      console.log(`Server running at ${res.url}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
