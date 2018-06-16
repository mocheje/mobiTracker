import React, { Component } from 'react';
import {
    Platform,
    Text,
    Button,
    TextInput,
    AsyncStorage,
    View,
    Alert,
    KeyboardAvoidingView,
    ActivityIndicator,
} from 'react-native';

import * as DeviceInfo from 'react-native-device-info'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
//import styles
import styles from '../stylesheets/styles';

//const endpoint = 'http://www.mobisalestracker.nascosales.com.ng/api/v1/';
const endpoint = 'http://192.168.8.104:3000/api/v1/';
//const apiKey = 'edf6736102ef358244fd2fde54c2a438';
const apiKey = 'fa42eef939239cf5fd5072b7b874bd9e';
const device = DeviceInfo.getUniqueID();

export default class Configure extends Component {
    static navigationOptions = {
        title: 'Configure',
    };
    constructor(props){
        super(props);
        this.state = {
            submitButtonDisabled: true,
            editEmail: true,
            device: device,
            trackerOn: false,
            designation: '',
            email: '',
            driverName: '',
            isLoading: false,
        };
    }
    componentDidMount() {
        //retrieve all storage vars

        AsyncStorage.getItem('@Mobi:Config')
            .then((config) => {
                const state = JSON.parse(config) || {};
                console.log(state);
                this.setState(state);
            })
            .catch('An error occured while retrieving config');

        BackgroundGeolocation.configure({
            desiredAccuracy: 10,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: 'Mobi Tracker',
            notificationText: 'Enabled',
            debug: false,
            startOnBoot: true,
            stopOnTerminate: false,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            stopOnStillActivity: false,
            url: `${endpoint}locations`,
            syncUrl: `${endpoint}locations`,
            // httpHeaders: {
            //     'x-api-key': apiKey
            // },
            // customize post properties
            postTemplate: {
                lat: '@latitude',
                lon: '@longitude',
                foo: 'bar' // you can also add your own properties
            },
            // customize post properties
            // postTemplate: {
            //     latitude: '@latitude',
            //     longitude: '@longitude',
            //     provider: '@provider',
            //     locationProvider: '@locationProvider',
            //     time: '@time',
            //     accuracy: '@accuracy',
            //     speed: '@speed',
            //     altitude: '@altitude',
            //     bearing: '@bearing',
            //     device: device,
            //     foo: 'bar'
            // },
        });

        BackgroundGeolocation.on('location', (location) => {
            location.device = this.state.device;
            console.log(location);
        });

        BackgroundGeolocation.on('stationary', (stationaryLocation) => {
            // handle stationary locations here
            //Actions.sendLocation(stationaryLocation);
        });

        BackgroundGeolocation.on('error', (error) => {
            console.log('[ERROR] BackgroundGeolocation error:', error);
        });

        BackgroundGeolocation.on('stop', (event) => {
            console.log('[INFO] BackgroundGeolocation stopped:', event);
        });

    }

    componentWillUnmount() {
        // unregister all event listeners
        //BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
    }
    _startTracker() {
        //activate device and start tracker
        this.setState({isLoading: true});
        fetch(`${endpoint}register_device`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({
                device: device,
                email: this.state.email,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if(!responseJson.error){
                    BackgroundGeolocation.start(() => {
                        console.log('started background location services');
                    });
                    this.setState({trackerOn: true, isLoading: false});
                    AsyncStorage.setItem('@Mobi:Config', JSON.stringify(this.state))
                        .then(() => {
                            console.log('state saved');
                        })
                        .catch('An error occured while retrieving config');
                } else{
                    this.setState({isLoading: false})
                }
            });
    }
    _stopTracker() {
        BackgroundGeolocation.stop(() => {
            //this.setState({...this.state, trakkerOn: true});
            console.log('stopped background location services');
        });
        this.setState({trackerOn: false});
    }
    _getDriverName() {
        console.log('get driver name called');
        if(this.state.email) {
            this.setState({isLoading: true});
            fetch(`${endpoint}drivers?email=${this.state.email}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(typeof responseJson !== 'string' && responseJson[0].StaffName){
                        this.setState({driverName: responseJson[0].StaffName, designation: responseJson[0].Designation, submitButtonDisabled: false, editemail: false, isLoading: false})
                    } else{
                        this.setState({isLoading: false})
                    }
                });
        }
    }
    render(){

        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }

        return(
            this.state.trackerOn ?
            <KeyboardAvoidingView style={styles.container}>
                <Text style={styles.welcome}>
                    Mobi Sales Tracker Enabled
                </Text>

                <Button
                    style={styles.formButton}
                    onPress={this._stopTracker.bind(this)}
                    title="Deactivate Tracker"
                    color="#2196f3"
                    accessibilityLabel="Deactivate Tracker"
                />

            </KeyboardAvoidingView>
                :
            <KeyboardAvoidingView
                style={styles.container}
                keyboardVerticalOffset={ 60 }
            >
                <Text style={styles.welcome}>
                    Admin Configuration
                </Text>
                <Text>
                    Device ID :
                </Text>
                <TextInput
                    style={styles.formInput}
                    placeholder="Device ID"
                    value={this.state.device}
                    editable={false}
                />
                <Text>
                    Email:
                </Text>
                <TextInput
                    style={styles.formInput}
                    value={this.state.email}
                    onChangeText={(value) => this.setState({email: value.toLowerCase()})}
                    keyboardType="email-address"
                    onBlur={this._getDriverName.bind(this)}
                    editable={this.state.editemail}
                />

                <Text>
                    Driver Name :
                </Text>
                <TextInput
                    style={styles.formInput}
                    value={this.state.driverName}
                    editable={false}
                />

                <Text>
                    Designation :
                </Text>
                <TextInput
                    style={styles.formInput}
                    value={this.state.designation}
                    onChangeText={(value) => this.setState({designation: value})}
                />

                <Button
                    style={styles.formButton}
                    onPress={this._startTracker.bind(this)}
                    title="Activate Tracker"
                    color="#2196f3"
                    accessibilityLabel="Activate Tracker"
                    disabled={this.state.submitButtonDisabled}
                />
            </KeyboardAvoidingView>
        )
    }

}