const { ApolloServer } = require('apollo-server');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

dotenv.config();

const { DB_URI, DB_NAME, JWT_SECRET } = process.env;

const getUserFromToken = async (token, db) => {
	if (!token) return null;

	const tokenData = jwt.verify(token, JWT_SECRET);

	if (!tokenData?.id) return null;

	const user = await db.collection('Users').findOne({ _id: new ObjectId(tokenData.id) });
	return user;
};

const start = async () => {
	const client = new MongoClient(DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await client.connect();
	const db = client.db(DB_NAME);

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }) => {
			const user = await getUserFromToken(req.headers.authorization, db);
			return { db, user };
		},
	});

	server.listen().then(({ url }) => {
		console.log(`🚀  Server ready at ${url}`);
	});
};

start();
