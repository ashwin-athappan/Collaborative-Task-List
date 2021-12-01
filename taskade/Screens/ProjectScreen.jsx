import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { useQuery, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProjectItem from '../Components/ProjectItem';

const GET_MY_PROJECTS = gql`
	query getMyTaskList {
		myTaskList {
			id
			title
		}
	}
`;

const ProjectScreen = ({ navigation, route }) => {
	// console.log(route);

	// const { data, loading, error } = useQuery(GET_USER);

	// console.log(data);

	const [project, setProjects] = useState([]);

	const {data, error, loading} = useQuery(GET_MY_PROJECTS);

	useEffect(() => {
		if (error) {
			Alert.alert('Error Fetching Projects', error.message);
		}
	}, [error]);

	useEffect(() => {
		if (data) {
			setProjects(data.myTaskList);
		}
	}, [data]);

	const signOut = async () => {
		await AsyncStorage.removeItem('token');
		navigation.navigate('Sign In');
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.heading}>Projects</Text>
				<TouchableOpacity style={styles.signOutButton} onPress={signOut}>
					<Text>Sign Out</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				data={project}
				renderItem={({ item }) => <ProjectItem project={item} />}
			/>
		</View>
	);
};

export default ProjectScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 50,
		backgroundColor: '#77ACF1',
	},
	heading: {
		fontSize: 20,
		padding: 10,
		color: 'black',
		fontWeight: 'bold',
	},
	signOutButton: {
		borderRadius: 5,
		padding: 5,
		backgroundColor: 'white',
	},
	header: {
		height: 50,
		backgroundColor: '#77ACF1',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
});
