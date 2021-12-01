import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';

import styles from './styles';

const SIGN_UP_MUTATION = gql`
	mutation signUp($email: String!, $name: String!, $password: String!) {
		signUp(input: { name: $name, email: $email, password: $password }) {
			token
			user {
				id
				name
				email
			}
		}
	}
`;

const SignUpScreen = () => {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');

	const navigation = useNavigation();

	const [signup, { data, loading, error }] = useMutation(SIGN_UP_MUTATION);

	const onSignUp = () => {
		signup({
			variables: {
				email,
				name,
				password,
			},
		});
	};

	useEffect(() => {
		if (error) {
			console.log(error);
			Alert.alert('Error has occured while signing up. Please try again');
		}
	}, [error]);

	useEffect(() => {
		if (data) {
			AsyncStorage.setItem('token', data.signUp.token).then(() => {
				navigation.navigate('Home');
			});
		}
	}, [data]);

	return (
		<View style={styles.container}>
			<TextInput
				placeholder='Name'
				value={name}
				onChangeText={setName}
				style={styles.input}
			/>
			<TextInput
				placeholder='Email'
				value={email}
				onChangeText={setEmail}
				style={styles.input}
			/>
			<TextInput
				placeholder='Password'
				value={password}
				secureTextEntry
				onChangeText={setPassword}
				style={styles.input}
			/>
			<TouchableOpacity
				style={styles.signupButton}
				onPress={onSignUp}
				disabled={loading}
			>
				<Text style={styles.signUpText}>
					Sign Up
					{loading ? (
						<ActivityIndicator size='small' color='#fff' animating={loading} />
					) : null}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					marginTop: 30,
					alignSelf: 'center',
				}}
				onPress={() => navigation.goBack()}
			>
				<Text style={styles.signUpText}>Already have an account? Sign In</Text>
			</TouchableOpacity>
		</View>
	);
};

export default SignUpScreen;
