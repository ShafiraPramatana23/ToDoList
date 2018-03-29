import { StackNavigator } from 'react-navigation';
import Login from './Login';
import Todo from './ToDoList';
import Register from './Register';

export default StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
  Home: {
    screen: Todo,
    navigationOptions: {
      title: 'ToDo List'
    }
  },
  Register: {
    screen: Register,
    navigationOptions: {
      title: 'Register'
    }
  }
});