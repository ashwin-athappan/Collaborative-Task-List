import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './styles';

const SIGN_IN_MUTATION = gql`
	mutation signIn($email: String!, $password: String!) {
		signIn(input: { email: $email, password: $password }) {
			token
			user {
				id
				name
			}
		}
	}
`;

const SignInScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [signIn, { data, loading, error }] = useMutation(SIGN_IN_MUTATION);

	const navigation = useNavigation();

	const onSignIn = () => {
		signIn({ variables: { email, password } });
	};

	useEffect(() => {
		if (error) {
			console.log(error);
			Alert.alert('Invalid Credentials.');
		}
	}, [error]);

	useEffect(() => {
		if (data) {
			AsyncStorage.setItem('token', data.signIn.token).then(() => {
				navigation.navigate('Home');
			});
		}
	}, [data]);

	return (
		<View style={styles.container}>
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
			<TouchableOpacity style={styles.button} onPress={onSignIn}>
				<Text style={styles.signInText}>Sign In</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					marginTop: 30,
					alignSelf: 'center',
				}}
				onPress={() => navigation.navigate('Sign Up')}
			>
				<Text style={styles.signUpText}>New here? Sign Up</Text>
			</TouchableOpacity>
		</View>
	);
};

export default SignInScreen;
