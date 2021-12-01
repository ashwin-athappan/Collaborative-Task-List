import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
	const navigation = useNavigation();

	useEffect(() => {
		const checkUser = async () => {
			if (await isAuthenticated()) {
				setTimeout(() => {
					navigation.navigate('Home');
				}, 2000);
			} else {
				setTimeout(() => {
					navigation.navigate('Sign In');
				}, 2000);
			}
		};
		checkUser();
	});

	const isAuthenticated = async () => {
        // await AsyncStorage.removeItem('token')
		const token = await AsyncStorage.getItem('token');
        console.log(token);
		return !!token;
	};

	return (
		<View style={{ flex: 1, justifyContent: 'center' }}>
			<ActivityIndicator size='large' color='#111111' />
		</View>
	);
};

export default SplashScreen;
