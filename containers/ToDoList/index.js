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
  Image,
  ActivityIndicator,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import DatePicker from 'react-native-datepicker';
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
      isShow: false,
      isLoading: false,
      isLoadingAdd: false,
    };
  }

  openModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  addNew() {
    const id = this.state.dataLogin._id;
    const status = false;
    const {
      task,
      dueDate,
      category
    } = this.state;

    if (!task || !dueDate || !category) {
      alert("Form input is empty");
    } else {
      this.setState({ isLoadingAdd: true });
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
            this.setState({ isLoadingAdd: false });
            alert(data.message);
            this.getTaskById();
          } else {
            this.setState({ isLoadingAdd: false });
            alert('Add Task Failed');
          }
        })
        .catch((error) => {
          this.setState({ isLoadingAdd: false });
          console.log(error);
        });
    }
  }

  getTaskById() {
    this.setState({ isLoading: true });
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
          this.setState({ dataTask: data.data, isLoading: false })
        } else {
          this.setState({ isLoading: false });
          alert('Can\'t get task');
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  deleteTask(data) {
    this.setState({ isLoading: true });
    const url = 'https://ngc-todo.herokuapp.com/api/tasks/' + data._id;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.success == true) {
          this.setState({ isLoading: false });
          alert("Delete successfull");
          this.getTaskById();
        } else {
          this.setState({ isLoading: false });
          alert("Can't delete task");
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  async getDataLogin() {
    try {
      const dataLogin = await AsyncStorage.getItem('Login');
      if (dataLogin !== null) {
        this.setState({
          dataLogin: JSON.parse(dataLogin),
        });
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
            <ScrollView style={style.scrollModal}>
              <View style={style.innerContainer}>
                <TouchableOpacity onPress={() => this.closeModal()}
                  style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                  <Image source={require('../../assets/close.png')} />
                </TouchableOpacity>
                <Text style={{
                  marginTop: 20,
                  marginBottom: 30,
                  fontWeight: 'bold',
                  color: '#000000',
                  fontSize: 20
                }}>ADD NEW TASK</Text>
                <TextInput
                  style={[style.buttonStyle, { textAlign: 'center', marginBottom: 10 }]}
                  placeholder="Title"
                  underlineColorAndroid='transparent'
                  onChangeText={(text) => this.setState({ task: text })}
                />
                <View style={[style.buttonStyle, { justifyContent: 'center', marginBottom: 10 }]}>
                  <DatePicker
                    style={{ width: 205 }}
                    date={this.state.dueDate}
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
                    onDateChange={(text) => { this.setState({ dueDate: text }) }}
                  />
                </View>
                <View style={[style.buttonStyle, { justifyContent: 'center', marginBottom: 10 }]}>
                  <Picker
                    style={{ marginLeft: 25 }}
                    selectedValue={this.state.category}
                    onValueChange={(itemValue, itemIndex) =>
                      itemValue == "new category" ? this.setState({ isShow: true }) : this.setState({ category: itemValue })}>
                    <Picker.Item label="Choose Category" />
                    <Picker.Item
                      label="New Category"
                      value="new category"
                    />
                  </Picker>
                </View>
                {this.state.isShow == true ? (
                  <View>
                    <TextInput
                      style={[style.buttonStyle, { textAlign: 'center', marginBottom: 10 }]}
                      placeholder="Category"
                      underlineColorAndroid='transparent'
                      onChangeText={(text) => this.setState({ category: text })}
                    />
                  </View>
                ) : (<View></View>)}
                {this.state.isLoadingAdd == true ? (
                  <ActivityIndicator size='large' />
                ) : (
                    <TouchableOpacity
                      style={[style.buttonStyle,
                      {
                        backgroundColor: '#5d84c1', alignItems: 'center',
                        justifyContent: 'center'
                      }]}
                      onPress={() => this.addNew()}>
                      <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Submit</Text>
                    </TouchableOpacity>
                  )}
              </View>
            </ScrollView>
          </View>
        </Modal>

        {this.state.isLoading == true ? (
          <ActivityIndicator size='large' style={{ marginTop: 20 }} />
        ) : (
            <FlatList
              data={this.state.dataTask}
              keyExtractor={(x, i) => i}
              renderItem={({ item }) =>
                <Item
                  item={item}
                  onDelete={(item) => { this.deleteTask(item) }}
                  onGet={() => this.getTaskById()}
                />
              }
              extraData={this.state}
            />
          )}

        <ActionButton
          buttonColor="#748baf"
          onPress={() => { this.openModal() }}
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
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)'
    // marginTop: '40%',
    // marginBottom: 100,
    // paddingTop: '10%',
    // paddingBottom: '10%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  innerContainer: {
    width: '100%',
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    borderRadius: 15
  },
  scrollModal: {
    flex: 1,
    marginTop: '20%',
    margin: 15,
  },
  textInput: {
    width: 200
  },
  buttonStyle: {
    borderWidth: 3,
    borderColor: '#748baf',
    borderRadius: 14,
    width: 210,
    height: 45,
  },
});