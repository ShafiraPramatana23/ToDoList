import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Alert,
    Image,
    TouchableOpacity
} from 'react-native';
// import { Container, Header, Content, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false
    }
  }

  check() {
    this.setState({
      check: !this.state.check
    })
  }
  render() {
    const { item } = this.props;
    return (
      <View style={style.container}>
        <View style={style.item}>
          <TouchableOpacity onPress={() => this.check()}>
            <Image source={this.state.check ? require('../../assets/check.png') : require('../../assets/uncheck.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <Text style={{
            flex: 1,
            fontSize: 20,
            marginTop: 3,
            marginLeft: 20,
            textDecorationLine: item.checked ? 'line-through' : 'none'
          }}>{item.task}</Text>
          <TouchableOpacity onPress={() => this.props.onDelete(item)}>
            <Image source={require('../../assets/delete.png')}
              style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>
      </View>
      // <Container>
      //     <Content>
      //         <ListItem>
      //             <Text> {item.task} </Text>
      //         </ListItem>
      //     </Content>
      // </Container>
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
  }
})