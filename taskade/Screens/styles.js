import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		padding: 30,
	},
	input: {
		color: 'black',
		fontSize: 18,
		width: '100%',
		marginVertical: 10,
		padding: 5,
		borderBottomWidth: 1,
		borderBottomColor: '#aaaaaa',
	},
	button: {
		backgroundColor: '#e33062',
		height: 50,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 30,
	},
	signupButton: {
		borderColor: '#e33062',
		borderWidth: 2,
		height: 50,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 30,
	},
	signInText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	signUpText: {
		color: '#e33062',
		fontSize: 14,
	},
});

export default styles;
