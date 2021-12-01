import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ApolloProvider } from '@apollo/client';

import Navigation from './Navigation';
import { client } from './apollo';

export default function App() {
	return (
		<ApolloProvider client={client}>
			<Navigation />
		</ApolloProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1597E5',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
