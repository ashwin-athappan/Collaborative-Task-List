import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Alert,
	Modal,
	Animated,
	Image,
	Button,
	TextInput,
} from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProjectItem from '../Components/ProjectItem';

const GET_MY_PROJECTS = gql`
	query getMyTaskList {
		myTaskList {
			id
			title
			createdAt
		}
	}
`;

const CREATE_TASK_LIST = gql`
	mutation createTaskList($title: String!) {
		createTaskList(title: $title) {
			id
			createdAt
			title
			progress
		}
	}
`;

const DELETE_TASK_LIST = gql`
	mutation deleteTaskList($id: ID!) {
		deleteTaskList(id: $id)
	}
`;

const ProjectScreen = ({ navigation, route }) => {
	// console.log(route);

	// const { data, loading, error } = useQuery(GET_USER);

	// console.log(data);

	const [project, setProjects] = useState([]);
	const [newProjectTitle, setNewProjectTitle] = useState('');
	const [visible, setVisible] = useState(false);
	const {
		data,
		error,
		loading,
		refetch: todoRefetch,
	} = useQuery(GET_MY_PROJECTS);
	const [
		createTaskList,
		{ data: taskListData, error: taskListError, loading: taskListLoading },
	] = useMutation(CREATE_TASK_LIST, {
		onCompleted: todoRefetch,
	});

	const [deleteTaskList] = useMutation(DELETE_TASK_LIST, {
		onCompleted: todoRefetch,
	});

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

	const removeTaskList = (id) => {
		deleteTaskList({ variables: { id } });
	};

	const addNewTaskList = () => {
		if (newProjectTitle) {
			createTaskList({ variables: { title: newProjectTitle } });
			setNewProjectTitle('');
		} else {
			Alert.alert('Please Enter Task List Name');
		}
		setVisible(false);
	};

	const signOut = async () => {
		await AsyncStorage.removeItem('token');
		navigation.navigate('Sign In');
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.heading}>Projects</Text>
				<TouchableOpacity
					style={styles.signOutButton}
					onPress={signOut}
				>
					<Text>Sign Out</Text>
				</TouchableOpacity>
			</View>

			<View style={{ width: '100%' }}>
				<FlatList
					data={project}
					renderItem={({ item }) => <ProjectItem project={item} onDelete={removeTaskList} />}
				/>
			</View>

			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<ModalPoup visible={visible}>
					<View style={{ alignItems: 'center' }}>
						<View style={styles.modalHeader}>
							<TouchableOpacity onPress={() => setVisible(false)}>
								<Image
									source={require('../assets/x.png')}
									style={{ height: 30, width: 30 }}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ alignItems: 'center' }}>
						<TextInput
							style={{
								marginTop: 20,
								height: 30,
								width: 200,
								borderBottomWidth: 2,
							}}
							value={newProjectTitle}
							onChangeText={setNewProjectTitle}
						/>
						<TouchableOpacity
							style={{
								marginTop: 20,
								borderRadius: 10,
								backgroundColor: '#00b894',
								padding: 5,
								width: 80,
								alignItems: 'center',
							}}
							onPress={addNewTaskList}
						>
							<Text
								style={{
									fontSize: 20,
								}}
							>
								Add
							</Text>
						</TouchableOpacity>
					</View>
				</ModalPoup>
			</View>

			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'flex-end',
				}}
			>
				<TouchableOpacity
					style={styles.createNewTaskListButton}
					onPress={() => setVisible(true)}
				>
					<Text>Create New Tasklist</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const ModalPoup = ({ visible, children }) => {
	const [showModal, setShowModal] = React.useState(visible);
	const scaleValue = React.useRef(new Animated.Value(0)).current;
	React.useEffect(() => {
		toggleModal();
	}, [visible]);
	const toggleModal = () => {
		if (visible) {
			setShowModal(true);
			Animated.spring(scaleValue, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			setTimeout(() => setShowModal(false), 200);
			Animated.timing(scaleValue, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	};
	return (
		<Modal transparent visible={showModal}>
			<View style={styles.modalBackGround}>
				<Animated.View
					style={[
						styles.modalContainer,
						{ transform: [{ scale: scaleValue }] },
					]}
				>
					{children}
				</Animated.View>
			</View>
		</Modal>
	);
};

export default ProjectScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 50,
		backgroundColor: '#77ACF1',
		// alignItems: 'center',
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
	createNewTaskListButton: {
		borderRadius: 5,
		padding: 5,
		width: 150,
		marginBottom: 30,
		backgroundColor: '#1597E5',
	},
	header: {
		height: 50,
		backgroundColor: '#77ACF1',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	modalBackGround: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		width: '80%',
		backgroundColor: 'white',
		paddingHorizontal: 20,
		paddingVertical: 30,
		borderRadius: 20,
		elevation: 20,
	},
	modalHeader: {
		width: '100%',
		height: 40,
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
});
