import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TodoScreen from '../Screens/TodoScreen';
import ProjectScreen from '../Screens/ProjectScreen';
import SignInScreen from '../Screens/SignInScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import SplashScreen from '../Screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default RootNavigator = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name='Splash Screen'
					component={SplashScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen name='Sign In' component={SignInScreen} />
				<Stack.Screen name='Sign Up' component={SignUpScreen} />
				<Stack.Screen
					name='Home'
					component={ProjectScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name='Todo'
					component={TodoScreen}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
