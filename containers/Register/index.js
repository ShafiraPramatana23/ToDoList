import React, { Component } from 'react';
import {
  Button,
  Image,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import DatePicker from 'react-native-datepicker';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      gender: null,
      birthdate: null,
    }
  }

  registerAccount() {
    const {
      username,
      password,
      gender,
      birthdate
    } = this.state;

    if (!username || !password || !gender || !birthdate) {
      alert("Form input is empty")
    } else if (username.length <= 5) {
      alert("Username should at least 5 characters");
    } else if (password.length < 8) {
      alert("Password should at least 8 characters");
    } else {
      const body = {
        "username": username,
        "password": password,
        "gender": gender,
        "birthdate": birthdate
      }

      console.log(JSON.stringify(body));

      fetch('https://ngc-todo.herokuapp.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(data => {
          console.log("sukses: " + JSON.stringify(data))
          if (data.success == true) {
            const navigateAction = NavigationActions.navigate({
              routeName: 'Login',
              action: NavigationActions.navigate({ routeName: 'Login' }),
            });
            this.props.navigation.dispatch(navigateAction);
          } else {
            if (data.message.includes("username already exists")) {
              alert("Username already exists");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }


  render() {
    return (
      <View style={style.container}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Image
            style={style.imageLogo}
            source={require('../../assets/todo.png')}
          />
        </View>
        <View style={style.row}>
          <TextInput
            underlineColorAndroid='transparent'
            style={[style.buttonStyle, { marginBottom: 10, textAlign: 'center' }]}
            placeholder="Username"
            onChangeText={(text) => this.setState({ username: text })}
          />
        </View>
        <View style={style.row}>
          <TextInput
            underlineColorAndroid='transparent'
            style={[style.buttonStyle, { marginBottom: 10, textAlign: 'center' }]}
            placeholder="Password"
            onChangeText={(text) => this.setState({ password: text })}
          />
        </View>
        <View style={[style.buttonStyle, { justifyContent: 'center', marginBottom: 10 }]}>
          <Picker
            style={{ marginLeft: 25 }}
            selectedValue={this.state.gender}
            onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}>
            <Picker.Item label="Gender" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>
        <View style={[style.buttonStyle, { marginBottom: 10 }]}>
          <DatePicker
            style={{ width: 205 }}
            date={this.state.birthdate}
            mode="date"
            format="MM-DD-YYYY"
            placeholder="Select Date"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={(text) => { this.setState({ birthdate: text }) }}
          />
        </View>

        <TouchableOpacity
          style={[style.buttonStyle,
          {
            backgroundColor: '#5d84c1', alignItems: 'center',
            justifyContent: 'center'
          }]}
          onPress={() => this.registerAccount()}>
          <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Sign Up</Text>
        </TouchableOpacity>
      </View >
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10
  },
  row: {
    flexDirection: 'row',
  },
  buttonStyle: {
    borderWidth: 3,
    borderColor: '#748baf',
    borderRadius: 14,
    width: 210,
    height: 45,
  },
  imageLogo: {
    width: 120,
    height: 120,
  }
});

// _newAccount() {
//     const data = this.state.data;
//     data.push({
//         username: this.state.username,
//         password: this.state.password
//     });
//     this.setState({
//         data: data
//     })
//     this.props.navigation.navigate('Login', data);       
// }