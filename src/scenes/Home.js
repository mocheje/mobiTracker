
import React, { Component } from 'react';
import {
    Platform,
    Text,
    Button,
    TextInput,
    AsyncStorage,
    View,
    Alert,
} from 'react-native';
import styles from '../stylesheets/styles';

export default class Home extends Component {

    static navigationOptions = {
        title: 'Home',
    };
    constructor(props){
        super(props);
        this.state = {
            adminPass: '',
        };
    }

    async _configure() {
        const { navigate } = this.props.navigation;
        if(this.state.adminPass === 'P@55W0RD'){
            // try{
            //     const response = await AsyncStorage.getItem('@Mobi:Config');
            //     console.log(JSON.parse(response))
            //     this.setState({configure: true});
            //     console.log(this.state);
            // } catch (e){
            //     console.log(e)
            // }
            navigate('Configure', { name: 'Jane' })
        } else {
            Alert.alert(
                'Wrong Passphrase',
                'Invalid Passphrase supplied',
                [
                    {text: 'Try Again', onPress: () => console.log('Ask me later pressed')},
                    {text: 'Cancel', onPress: () => this.setState({adminPass: ''})}
                ],
                { cancelable: false }
            )
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to Mobi Sales Tracker!
                </Text>

                <TextInput
                    style={styles.formInput}
                    placeholder="Enter Master Phrase!"
                    secureTextEntry={true}
                    value={this.state.adminPass}
                    onChangeText={(value) => this.setState({adminPass: value})}
                />

                <Button
                    style={styles.formButton}
                    onPress={this._configure.bind(this)}
                    title="Configure"
                    color="#2196f3"
                    accessibilityLabel="Configure"
                />
            </View>
        );
    }
}
