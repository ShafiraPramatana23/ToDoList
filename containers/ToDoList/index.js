import React, { Component } from 'react';
import {
  AsyncStorage,
  Button,
  FlatList,
  Modal,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Item from './item';

export default class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      task: null,
      dueDate: null,
      category: null,
      id: null,
      status: null,
      dataLogin: [],
      dataTask: [],
      isShow: false
    };
  }

  openModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  addNew() {
    console.log(this.state.dataLogin);
    const id = this.state.dataLogin._id;
    const status = false;
    const {
      task,
      dueDate,
      category
    } = this.state;

    const body = {
      "userId": id,
      "status": status,
      "task": task,
      "dueDate": dueDate,
      "category": category
    }

    fetch('https://ngc-todo.herokuapp.com/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success == true) {
          alert(data.message);
        } else {
          alert('Add Task Failed');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getTaskById() {
    const id = this.state.dataLogin._id;
    const url = 'https://ngc-todo.herokuapp.com/api/tasks/' + id;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.success == true) {
          this.setState({ dataTask: data.data })
          // console.log(this.state.dataTask);
        } else {
          alert('Can\'t get task');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteTask(data){
    console.log('datanya: '+JSON.stringify(data));
    console.log('id yg mau dihapus: '+data._id)
    const url = 'https://ngc-todo.herokuapp.com/api/tasks/' + data._id;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('respon delete: '+JSON.stringify(data));
        // if (data.success == true) {
        // } else {
        //   alert('Can\'t get task');
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  showCategory() {
    console.log("masuk show categ")
    this.setState({
      isShow: true
    });
    console.log("isShow: " + this.state.isShow);
  }

  async getDataLogin() {
    try {
      const dataLogin = await AsyncStorage.getItem('Login');
      if (dataLogin !== null) {
        this.setState({
          dataLogin: JSON.parse(dataLogin),
        });
        console.log('datalogin: '+dataLogin)
        this.getTaskById();
      }
    } catch (error) {
      alert(error);
    }
  }

  componentWillMount() {
    this.getDataLogin();
  }

  render() {
    const { task, dueDate } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={() => this.closeModal()}>
          <View style={style.modalContainer}>
            <ScrollView keyboardShouldPersistTaps='always'>
              <TextInput
                style={style.textInput}
                placeholder="Title"
                autoFocus={true}
                onChangeText={(text) => this.setState({ task: text })}
              />
              <TextInput
                style={style.textInput}
                placeholder="Due Date"
                onChangeText={(text) => this.setState({ dueDate: text })}
              />
              <TextInput
                style={style.textInput}
                placeholder="Category"
                onChangeText={(text) => this.setState({ category: text })}
              />
              <Picker
                style={{ marginLeft: 25 }}
                selectedValue={this.state.category}
                onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue })}>
                <Picker.Item label="Choose Category" />
                <Picker.Item
                  label="New Category"
                // {this.showCategory}
                />
              </Picker>
              {this.state.isShow == true ? (<Picker
                style={{ marginLeft: 25 }}
                selectedValue={this.state.category}
                onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue })}>
                <Picker.Item label="Choose Category" />
                <Picker.Item
                  label="New Category"
                  value={this.showCategory}
                />
              </Picker>) : (<View></View>)}
              <Button
                onPress={() => this.addNew()}
                title="Submit" />
            </ScrollView>
          </View>
        </Modal>

        <TouchableOpacity style={[style.container, { borderRadius: 10 }]}>
          <Button
            style={{ width: 100 }}
            onPress={() => this.openModal()}
            title="Add New Task"
          />
        </TouchableOpacity>

        <FlatList
          data={this.state.dataTask}
          keyExtractor={(x, i) => i}
          renderItem={({ item }) =>
            <Item
              item={item}
              onDelete={(item) => {this.deleteTask(item)}}
            />
          }
          extraData={this.state}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalContainer: {
    marginTop: '40%',
    marginBottom: 100,
    paddingTop: '10%',
    paddingBottom: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  innerContainer: {
    alignItems: 'center',
  },
  textInput: {
    width: 200
  }
});