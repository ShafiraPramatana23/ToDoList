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
                        fontSize: 16,
                        marginTop: 3,
                        marginLeft: 10,
                        textDecorationLine: item.checked ? 'line-through' : 'none'
                    }}>{item.task}</Text>
                    <TouchableOpacity onPress={() => this.props.onDelete(item)}>
                        <Image source={require('../../assets/delete.png')} />
                    </TouchableOpacity>
                </View>
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
        padding: 10,
        backgroundColor: '#e0e1e2',
        margin: 5
    }
})