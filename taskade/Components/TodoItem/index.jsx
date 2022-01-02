import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

import { useMutation, gql } from '@apollo/client';

import Checkbox from '../Checkbox';

const UPDATE_TODO = gql`
	mutation updateTodo($id: ID!, $content: String!, $isCompleted: Boolean!) {
		updateTodo(id: $id, content: $content, isCompleted: $isCompleted) {
			id
			content
			isCompleted
		}
	}
`;



const ToDoItem = ({ todo, onSubmit, onDelete }) => {
	const [isChecked, setIsChecked] = useState(false);
	const [content, setContent] = useState('');

	const [updateItem] = useMutation(UPDATE_TODO);
	

	const callUpdateItem = () => {
		updateItem({
			variables: {
				id: todo.id,
				content,
				isCompleted: isChecked,
			},
		});
	};

	const callDeleteItem = () => {
		onDelete(todo.id);
	}

	const input = useRef(null);

	useEffect(() => {
		if (!todo) {
			return;
		}

		setIsChecked(todo.isCompleted);
		setContent(todo.content);
	}, [todo]);

	useEffect(() => {
		if (input.current) {
			input?.current?.focus();
		}
	}, [input]);


	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				marginVertical: 3,
			}}
		>
			{/* Checkbox */}
			<Checkbox
				isChecked={isChecked}
				onPress={() => {
					setIsChecked(!isChecked);
					callUpdateItem();
				}}
			/>

			{/* Text Input */}
			<TextInput
				ref={input}
				value={content}
				onChangeText={setContent}
				style={{
					flex: 1,
					fontSize: 18,
					color: 'black',
					marginLeft: 12,
				}}
				multiline
				onEndEditing={callUpdateItem}
				onSubmitEditing={onSubmit}
				blurOnSubmit
			/>
			<TouchableOpacity
				onPress={callDeleteItem}
			>
				<Text style={{color: 'red'}}>Delete</Text>
			</TouchableOpacity>
		</View>
	);
};

export default ToDoItem;
