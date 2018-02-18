import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  Platform,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import Swipeable from 'react-native-swipeable';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false,
      modalVisibleEdit: false,
      status: false,
      task: null,
      isLoading: false
    }
  }

  check() {
    this.setState({
      check: !this.state.check
    })
  }

  openModalEdit() {
    this.setState({ modalVisibleEdit: true });
  }

  closeModalEdit() {
    this.setState({ modalVisibleEdit: false });
  }

  updateTask(id) {
    this.setState({ isLoading: true });

    const {
      status,
      task
    } = this.state;

    const body = {
      "status": status,
      "task": task
    }

    const url = 'https://ngc-todo.herokuapp.com/api/tasks/' + id;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success == true) {
          this.setState({ isLoading: false });
          alert("Edit successfull");
          this.props.onGet();
        } else {
          this.setState({ isLoading: false });
          alert("Can't edit task");
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  render() {
    const { item } = this.props;
    const id = item._id;

    // const onOpen = (event, gestureState, swipeable) => {
    //   if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
    //     currentlyOpenSwipeable.recenter();
    //   }

    //   this.setState({ currentlyOpenSwipeable: swipeable });
    // };
    // const onClose = () => this.setState({ currentlyOpenSwipeable: null })

    return (
      <View style={style.container}>
        <View style={style.item}>
          {/* <Swipeable
          onRightButtonsOpenRelease={onOpen}
          onRightButtonsCloseRelease={onClose}
          rightContent={(
            <TouchableOpacity onPress={() => this.props.onDelete(item)}>
              <Image source={require('../../assets/delete.png')}
                style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
          )}>
          <Text>{item.task}</Text>
        </Swipeable> */}
          <TouchableOpacity onPress={() => this.openModalEdit()}>
            <Image source={require('../../assets/pencil.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <Text style={{
            flex: 1,
            fontSize: 20,
            marginTop: 2,
            marginLeft: 20
          }}>{item.task}</Text>
          <TouchableOpacity onPress={() => this.props.onDelete(item)}>
            <Image source={require('../../assets/delete.png')}
              style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={this.state.modalVisibleEdit}
          animationType={'slide'}
          onRequestClose={() => this.closeModalEdit()}>
          <View style={style.modalContainer}>
            <ScrollView style={style.scrollModal}>
              <View style={style.innerContainer}>
                <TouchableOpacity onPress={() => this.closeModalEdit()}
                  style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                  <Image source={require('../../assets/close.png')} />
                </TouchableOpacity>
                <Text style={{
                  marginTop: 20,
                  marginBottom: 30,
                  fontWeight: 'bold',
                  color: '#000000',
                  fontSize: 20
                }}>EDIT TASK</Text>
                <View style={[style.buttonStyle, { justifyContent: 'center', marginBottom: 10 }]}>
                  <Picker
                    style={{ marginLeft: 25 }}
                    selectedValue={this.state.status}
                    onValueChange={(itemValue, itemIndex) => this.setState({ status: itemValue })}>
                    <Picker.Item label="Choose Status" />
                    <Picker.Item label="False" value="false" />
                    <Picker.Item label="True" value="true" />
                  </Picker>
                </View>
                <TextInput
                  style={[style.buttonStyle, { textAlign: 'center', marginBottom: 10 }]}
                  value={this.state.task == null ? item.task : this.state.task}
                  underlineColorAndroid='transparent'
                  onChangeText={(text) => this.setState({ task: text })}
                />

                {this.state.isLoading == true ? (
                  <ActivityIndicator size='large' />
                ) : (
                    <TouchableOpacity
                      style={[style.buttonStyle,
                      {
                        backgroundColor: '#5d84c1', alignItems: 'center',
                        justifyContent: 'center'
                      }]}
                      onPress={() => this.updateTask(id)}>
                      <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Submit</Text>
                    </TouchableOpacity>
                  )}
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#eff2f7',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    borderRadius: 14,
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
  buttonStyle: {
    borderWidth: 3,
    borderColor: '#748baf',
    borderRadius: 14,
    width: 210,
    height: 45,
  },
})