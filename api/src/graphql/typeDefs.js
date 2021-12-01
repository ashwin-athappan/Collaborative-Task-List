const { gql } = require('apollo-server');

const typeDefs = gql`
	type User {
		id: ID!
		name: String!
		email: String!
		password: String!
		avatar: String
	}

	type TaskList {
		id: ID!
		createdAt: String!
		title: String!
		progress: Float!

		users: [User!]!
		todos: [Todo!]!
	}

	type Todo {
		id: ID!
		content: String!
		isCompleted: Boolean!

		taskList: TaskList!
	}

	type AuthUser {
		user: User!
		token: String!
	}

	type Query {
		myTaskList: [TaskList!]!
		getTaskList(id: ID!): TaskList!
		getAllTaskList: [TaskList!]!
		getUser: User!
	}

	input SignUpInput {
		name: String!
		email: String!
		password: String!
		avatar: String
	}

	input SignInInput {
		email: String!
		password: String!
	}

	type Mutation {
		signUp(input: SignUpInput): AuthUser!
		signIn(input: SignInInput): AuthUser!

		createTaskList(title: String!): TaskList!
		updateTaskList(id: ID!, title: String!): TaskList!
		deleteTaskList(id: ID!): Boolean!
		addUserToTaskList(taskListId: ID!, userId: ID!): TaskList!

		createTodo(content: String!, taskListId: ID!): Todo!
    	updateTodo(id: ID!, content: String, isCompleted: Boolean): Todo!
    	deleteTodo(id: ID!): Boolean!
	}
`;

module.exports = typeDefs;
