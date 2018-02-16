import { StackNavigator } from 'react-navigation';
import Login from './Login';
import Todo from './ToDoList';
import Register from './Register';

export default StackNavigator({
  Login: {
    screen: Login
  },
  Home: {
    screen: Todo
  },
  Register: {
    screen: Register
  }
},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   }
);