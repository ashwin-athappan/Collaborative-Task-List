import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setContext} from '@apollo/client/link/context';
// The thing is, that iOS is running in a simulator and Android is running in an emulator.

// The localhost is pointing to the environment in which the code is running. The emulator emulates a real device while the simulator is only imitating the device. Therefore the localhost on Android is pointing to the emulated Android device. And not to the machine on which your server is running. The solution is to replace localhost with the IP address of your machine.

// Try changing http://localhost:4000 by http://10.0.2.2:4000/

const URI = 'http://10.0.2.2:4000/';

const httpLink = createHttpLink({
	uri: URI,
});

const authLink = setContext(async (_, {headers}) => {
	const token = await AsyncStorage.getItem('token');
	return {
		headers: {
			...headers,
			authorization: token || '',
		},
	};
});

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});
