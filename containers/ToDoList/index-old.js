// import React, { Component } from 'react';
// import {
//     Text,
//     Button,
//     View
// } from 'react-native';
// import { StackNavigator } from 'react-navigation';

// export default class Todo extends Component {
//     render() {
//         return (
//             <View>
//                 <Text>todo coi</Text>
//             </View>
//         )
//     }
// }

import React, { Component } from 'react';
import {
  AsyncStorage,
  Alert,
  Button,
  DatePickerAndroid,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Item from './item';

const screenWidth = Dimensions.get('window').width;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      itemName: null
    }
  }

  _addItem() {
    const data = this.state.data;
    data.push(this.state.itemName);
    this.setState({
      data: data,
      itemName: null,
      datePicker: null
    });
    this._saveData(data);
  }

  async _saveData(data) {
    try {
      await AsyncStorage.setItem('Todo', JSON.stringify(data));
    } catch (error) {
      alert(error);
    }
  }

  _deleteTask(item) {
    const data = this.state.data;
    const index = data.indexOf(item);
    data.splice(index, 1);
    this.setState({
      data: data
    })
  }

  async componentWillMount() {
    try {
      const data = await AsyncStorage.getItem('Todo');
      if (data !== null) {
        this.setState({
          data: JSON.parse(data)
        })
      }
    } catch (error) {
    }
  }

  render() {
    const {param} = this.props.navigation.state.params;
    console.log(param.username);
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>To Do List</Text>
        </View>

        <View style={{ margin: 10, flexDirection: 'row' }}>
          <Text></Text>

          <TextInput
            style={{ fontSize: 10, width: screenWidth / 1.4 }}
            placeholder="Enter New Item"
            onChangeText={(itemName) => this.setState({ itemName })}
            // onSubmitEditing={() => this._datePicker()}
            value={this.state.itemName}
          />
          <Button
            style={{ marginRight: 15 }}
            title="+"
            onPress={() =>
              this._addItem()
            }
          />
        </View>

        <FlatList
          data={this.state.data}
          renderItem={({ item }) =>
            <Item
              item={item}
              onDelete={(item) => this._deleteTask(item)}
            />
          }
          extraData={this.state}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  header: {
    backgroundColor: 'skyblue',
  }
});
