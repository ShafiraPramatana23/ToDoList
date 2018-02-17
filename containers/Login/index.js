import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
// import { Container, Header, Content, Item, Input, Button, Text, Body } from 'native-base';
import { NavigationActions } from 'react-navigation';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      isLoading: false,
      isLogin: false,
    }
  }

  login() {
    this.setState({
      isLoading: true
    })

    const {
      username,
      password
    } = this.state;

    if (!username || !password) {
      alert("Username and password is empty")
      this.setState({
        isLoading: false
      });
    } else {
      const body = {
        "username": username,
        "password": password
      }

      fetch('https://ngc-todo.herokuapp.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(data => {
          const param = data.data;
          if (data.success == true) {
            this.saveLogin(param);

            this.setState({
              isLoading: false
            }); // loading

            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Home' })],
            });
            this.props.navigation.dispatch(resetAction);
          } else {
            this.setState({
              isLoading: false
            }); // loading
            alert('Login failed');
          }
        })
        .catch((error) => {
          this.setState({
            isLoading: false
          }); // loading
          console.log(error);
        });
    }
  }

  async saveLogin(dataLogin) {
    try {
      await AsyncStorage.setItem('Login', JSON.stringify(dataLogin));
      console.log('sukses simpan local');
    } catch (error) {
      alert(error);
    }
  }

  async getDataLogin() {
    try {
      const dataLogin = await AsyncStorage.getItem('Login');
      if (dataLogin !== null) {
        console.log(dataLogin);
        this.setState({ isLogin: true });
      }
    } catch (error) {
      alert(error);
    }
  }

  // componentWillMount() {
  //   this.getDataLogin();
  // }

  render() {
    const { isLoading, isLogin } = this.state;
    return (
      <View style={style.container}>
        {isLoading == true ? (
            <ActivityIndicator size="large" />
          ) : (
              <View>
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                  <Image
                    style={style.imageLogo}
                    source={require('../../assets/todo.png')}
                  />
                </View>

                <TextInput
                  underlineColorAndroid='transparent'
                  style={[style.buttonStyle, { marginBottom: 10, textAlign: 'center' }]}
                  placeholder="Username"
                  onChangeText={(text) => this.setState({ username: text })}
                />
                <TextInput
                  underlineColorAndroid='transparent'
                  style={[style.buttonStyle, { marginBottom: 10, textAlign: 'center' }]}
                  placeholder="Password"
                  onChangeText={(text) => this.setState({ password: text })}
                />

                <TouchableOpacity
                  style={[style.buttonStyle,
                  {
                    backgroundColor: '#5d84c1', alignItems: 'center',
                    justifyContent: 'center'
                  }]}
                  onPress={() => this.login()}>
                  <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Sign In</Text>
                </TouchableOpacity>

                <View style={{ marginTop: 20, flexDirection: 'row' }}>
                  <Text>Don't have an account? </Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Register')}>
                    <Text> Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonStyle: {
    borderWidth: 3,
    borderColor: '#748baf',
    borderRadius: 14,
    width: 200,
    height: 45
  },
  imageLogo: {
    width: 120,
    height: 120,
  }
})