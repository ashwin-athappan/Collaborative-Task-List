import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProjectItem = ({ project, onDelete }) => {
	const navigation = useNavigation();

	const onPress = () => {
		console.log(`open project ${project.title}`);
		navigation.navigate('Todo', { id: project.id, title: project.title });
	};
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<View style={styles.root}>
				<View style={styles.iconContainer}>
					<MaterialCommunityIcons
						name='file-outline'
						size={24}
						color='black'
					/>
				</View>
				<View
					style={{
						flexDirection: 'column',
						alignItems: 'flex-start',
					}}
				>
					<Text style={styles.title}>{project.title}</Text>
					<Text style={styles.time}>
						{project.createdAt.substring(0, 10)}
					</Text>
				</View>
			</View>
			<TouchableOpacity
				onPress={() => {
					onDelete(project.id);
				}}
			>
				<MaterialCommunityIcons
					name='delete'
					size={24}
					color='#FE1D48'
				/>
			</TouchableOpacity>
		</TouchableOpacity>
	);
};

export default ProjectItem;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 10,
		justifyContent: 'space-between',
	},
	root: {
		flexDirection: 'row',
		padding: 10,
	},
	iconContainer: {
		width: 40,
		height: 40,
		backgroundColor: '#1597E5',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5,
		marginRight: 10,
	},
	title: {
		fontSize: 20,
		marginRight: 5,
		color: '#19456B',
		fontWeight: '800',
	},
	time: {
		color: '#11698E',
	},
});
