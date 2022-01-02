import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import { useMutation, useQuery, gql } from '@apollo/client';
import ToDoItem from '../Components/TodoItem';

const UPDATE_TASK_LIST = gql`
	mutation updateTaskList($id: ID!, $title: String!) {
		updateTaskList(id: $id, title: $title) {
			id
			title
		}
	}
`;

const GET_TODO_ITEMS = gql`
	query getTodos($id: ID!) {
		getTaskList(id: $id) {
			todos {
				id
				content
				isCompleted
			}
		}
	}
`;

const CREATE_NEW_TODO = gql`
	mutation createTodo($content: String!, $id: ID!) {
		createTodo(content: $content, taskListId: $id) {
			content
			taskList {
				id
			}
		}
	}
`;

const DELETE_TODO = gql`
	mutation deleteTodo($id: ID!) {
		deleteTodo(id: $id)
	}
`;

const TodoScreen = ({ navigation, route }) => {
	const [title, setTitle] = useState(route.params.title);
	const [todos, setTodos] = useState([]);

	const [
		updateTaskList,
		{
			data: taskListTitleData,
			loading: taskListLoading,
			error: taskListError,
		},
	] = useMutation(UPDATE_TASK_LIST);

	const {
		data: todoData,
		loading: todoLoading,
		error: todoError,
		refetch: todoRefetch,
	} = useQuery(GET_TODO_ITEMS, { variables: { id: route.params.id } });

	const [
		createTodo,
		{
			data: createTodoData,
			loading: createTodoLoading,
			error: createTodoError,
		},
	] = useMutation(CREATE_NEW_TODO, {
		onCompleted: todoRefetch,
	});

	const [deleteTodo] = useMutation(DELETE_TODO, {
		onCompleted: todoRefetch,
	});

	useEffect(() => {
		if (taskListTitleData) {
			setTitle(taskListTitleData.updateTaskList.title);
		}
	}, [taskListTitleData]);

	useEffect(() => {
		if (todoData && !todoLoading) {
			setTodos([...todoData.getTaskList.todos]);
		}
	}, [todoData]);

	const handleBack = () => {
		navigation.goBack();
	};

	const createNewItem = (index) => {
		createTodo({ variables: { content: '', id: route.params.id } });
	};

	const deleteItem = (id) => {
		console.log('delete');
		deleteTodo({ variables: { id } });
	};

	const handleTitleChange = (text) => {
		updateTaskList({ variables: { id: route.params.id, title: text } });
	};

	return (
		<KeyboardAvoidingView
			// behavior={Platform.OS === 'android' ? 'padding' : 'height'}
			// keyboardVerticalOffset={Platform.OS === 'android' ? 130 : 0}
			style={{ flex: 1 }}
		>
			<View style={styles.container}>
				<TouchableOpacity
					style={{ alignSelf: 'flex-start' }}
					onPress={handleBack}
				>
					<Text style={{ color: '#1597E5' }}>{'⬅️ Back'}</Text>
				</TouchableOpacity>

				<View style={styles.horizontalSeparator} />

				<TextInput
					value={title}
					onChangeText={setTitle}
					onSubmitEditing={() => handleTitleChange(title)}
					placeholder={'Title'}
					style={styles.title}
				/>

				{todos.length !== 0 ? (
					<FlatList
						data={todos}
						renderItem={({ item, index }) => (
							<ToDoItem
								todo={item}
								onSubmit={() => createNewItem(index + 1)}
								onDelete={(id) => deleteItem(id)}
							/>
						)}
						style={{ width: '100%' }}
					/>
				) : (
					<ToDoItem
						todo={{ content: '', isCompleted: false }}
						onSubmit={() => createNewItem(1)}
					/>
				)}
			</View>
		</KeyboardAvoidingView>
	);
};

export default TodoScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 12,
		marginTop: 50,
	},
	title: {
		width: '100%',
		fontSize: 20,
		color: 'black',
		fontWeight: 'bold',
		marginBottom: 10,
	},
	horizontalSeparator: {
		width: '100%',
		height: '0.5%',
		backgroundColor: '#1597E5',
		marginVertical: 5,
	},
});
