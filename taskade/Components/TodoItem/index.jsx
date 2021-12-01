import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput } from 'react-native';

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

const ToDoItem = ({ todo, onSubmit }) => {
	const [isChecked, setIsChecked] = useState(false);
	const [content, setContent] = useState('');

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

	const onKeyPress = ({ nativeEvent }) => {
		if (nativeEvent.key === 'Backspace' && content === '') {
			// Delete item
			console.warn('Delete item');
		}
	};

	return (
		<View
			style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}
		>
			{/* Checkbox */}
			<Checkbox
				isChecked={isChecked}
				onPress={() => {
					setIsChecked(!isChecked);
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
				onSubmitEditing={onSubmit}
				blurOnSubmit
				onKeyPress={onKeyPress}
			/>
		</View>
	);
};

export default ToDoItem;
