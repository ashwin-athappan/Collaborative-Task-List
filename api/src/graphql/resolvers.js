const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { UserInputError } = require('apollo-server');
const { ObjectId } = require('bson');

dotenv.config();

const { JWT_SECRET } = process.env;

const userValidationSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string().required().email(),
	password: Joi.string().min(3).required(),
});

const getToken = (user) =>
	jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7 days' });

const resolvers = {
	Query: {
		myTaskList: async (_, __, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}
			console.log(user._id);
			return await db
				.collection('TaskList')
				.find({ userIds: user._id })
				.toArray();
		},

		getTaskList: async (_, { id }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}
			const result = await db
				.collection('TaskList')
				.findOne({ _id: ObjectId(id) });
			return result;
		},
		getAllTaskList: async (_, __, { db }) => {
			const result = await db.collection('TaskList').find().toArray();
			return result;
		},
		getUser: async (_, __, { user }) => {
			return user;
		},
	},

	Mutation: {
		signUp: async (_, { input }, { db }) => {
			let user = {
				...input,
			};
			try {
				const { u, error } = await userValidationSchema.validate(user);

				if (error) {
					throw error.details[0].message;
				}

				const userExists = await db
					.collection('Users')
					.findOne({ email: input.email });

				console.log(userExists);

				if (userExists) {
					throw 'User Already Exists';
				}

				const hashedPassword = bcrypt.hashSync(input.password);

				const newUser = {
					...input,
					password: hashedPassword,
				};

				const result = await db.collection('Users').insertOne(newUser);
				const createdUser = await db
					.collection('Users')
					.findOne({ _id: result.insertedId });

				console.log(createdUser);
				user = createdUser;
			} catch (e) {
				e = e.replace(/"/g, '');
				throw new UserInputError('Bad Input', { error: e });
			}
			return {
				token: getToken(user),
				user,
			};
		},
		signIn: async (_, { input }, { db }) => {
			let user;
			try {
				user = await db.collection('Users').findOne({ email: input.email });

				if (!user || !bcrypt.compareSync(input.password, user.password)) {
					throw 'Invalid credentials';
				}
			} catch (e) {
				throw new UserInputError('Bad Input', { error: e });
			}

			return {
				token: getToken(user),
				user,
			};
		},

		createTaskList: async (_, { title }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}
			const newTaskList = {
				title,
				createdAt: new Date().toISOString(),
				userIds: [user._id],
			};

			const result = await db.collection('TaskList').insertOne(newTaskList);
			const createdTaskList = await db
				.collection('TaskList')
				.findOne({ _id: result.insertedId });
			return createdTaskList;
		},

		updateTaskList: async (_, { id, title }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}
			const result = await db.collection('TaskList').updateOne(
				{ _id: ObjectId(id) },
				{
					$set: {
						title,
					},
				}
			);
			return await db.collection('TaskList').findOne({ _id: ObjectId(id) });
		},

		deleteTaskList: async (_, { id }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}
			await db.collection('Todo').deleteMany({ taskList: ObjectId(id) });
			const result = await db
				.collection('TaskList')
				.deleteOne({ _id: ObjectId(id) });
			return result.acknowledged;
		},

		addUserToTaskList: async (_, { taskListId, userId }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}
			const taskList = await db
				.collection('TaskList')
				.findOne({ _id: ObjectId(taskListId) });
			if (!taskList) {
				return null;
			}
			console.log(ObjectId(userId));
			if (
				taskList.userIds.find((uid) => uid.toString() === userId.toString())
			) {
				return taskList;
			}

			const result = await db
				.collection('TaskList')
				.updateOne(
					{ _id: ObjectId(taskListId) },
					{ $push: { userIds: ObjectId(userId) } }
				);
			taskList.userIds.push(ObjectId(userId));
			return taskList;
		},

		createTodo: async (_, { content, taskListId }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please sign in');
			}
			const newTodo = {
				content,
				taskList: ObjectId(taskListId),
				isCompleted: false,
			};
			const result = await db.collection('Todo').insertOne(newTodo);
			const createdTodo = await db
				.collection('Todo')
				.findOne({ _id: result.insertedId });
			return createdTodo;
		},

		updateTodo: async (_, { id, content, isCompleted }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please sign in');
			}
			const updatedTodo = await db
				.collection('Todo')
				.updateOne({ _id: ObjectId(id) }, { $set: { content, isCompleted } });
			return await db.collection('Todo').findOne({ _id: ObjectId(id) });
		},

		deleteTodo: async (_, { id }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please sign in');
			}

			const result = await db
				.collection('Todo')
				.deleteOne({ _id: ObjectId(id) });
			return result.acknowledged;
		},
	},

	User: {
		id: ({ _id, id }) => _id || id,
	},

	Todo: {
		id: ({ _id, id }) => _id || id,
		taskList: async ({ taskList }, _, { db }) => {
			const res = await db.collection('TaskList').findOne({ _id: taskList });
			return res;
		},
	},

	TaskList: {
		id: ({ _id, id }) => _id || id,
		progress: async ({ _id }, _, { db }) => {
			const todos = await db.collection('Todo').find({taskList: ObjectId(_id)}).toArray();

			if (todos.length === 0) {
				return 0;
			}

			const completed = todos.filter(todo => todo.isCompleted);

			return 100 * completed.length / todos.length;
		},
		users: async ({ userIds }, _, { db }) =>
			Promise.all(
				userIds.map((userId) => db.collection('Users').findOne({ _id: userId }))
			),
		todos: async ({ _id }, _, { db }) =>
			await db
				.collection('Todo')
				.find({ taskList: ObjectId(_id) })
				.toArray(),
	},
};

module.exports = resolvers;
