/**
 * Login Test React Native App
 *
 * created by Alexey_Maximov 2022
 */

import * as React from 'react';
import axios from 'axios';
import { StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = React.useState(null);
    
    const source = axios.CancelToken.source();
    const baseUrl = "https://ic56xdo6p-test-api-rn.herokuapp.com";
    
    const getFromDashboard = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseUrl}/dashboard`, { withCredentials: true });
            //alert(`GET response data: ${response.data}`);
            if(response.data === "SUCCESS!") {
                setIsLoading(false);
                
                navigation.navigate("Success");
                return;
            }
            else {
                throw new Error("Failed to connect");
            }
          }
        catch(error) {
            if(axios.isCancel(error)) {
                alert(`En error has occured in GET request: ${error}`);
            }
            else
            {
                setIsLoading(false);
            }
        }
    }
    
    const onSubmitFormHandler = async (event) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/login`,{
                email,
                password,
            },
              {
                withCredentials: true,
            });
            if(response.status === 200) {
                //alert(`${JSON.stringify(response.data)}`);
                //alert(`${JSON.stringify(response.headers)}`);
                
                setData(response.headers);
                getFromDashboard();
                
                setIsLoading(false);
                setEmail("");
                setPassword("");
            }
            else {
                throw new Error("An error has accurred!");
            }
        }
        catch(error) {
            alert(`An error has accurred in POST request: ${error}`);
            setIsLoading(false);
        }
    }
    
    useFocusEffect(
        React.useCallback(() => {
            getFromDashboard();
        }, []));
    
    return (
        <View name="loginView" style={styles.containerView}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#003f5c"
                value={email}
                editable={!isLoading}
                onChangeText={(email) => setEmail(email)}
              />
            </View>
             
            <View style={styles.inputView}>
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                value={password}
                editable={!isLoading}
                onChangeText={(password) => setPassword(password)}
              />
            </View>
            
            <TouchableOpacity
                style={styles.loginBtn}
                disabled={isLoading}
                onPress={onSubmitFormHandler}
            >
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
    );
};

const SuccessScreen = ({navigation}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    
    const baseUrl = "https://ic56xdo6p-test-api-rn.herokuapp.com";
    
    const onLogoutHandler = async (event) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseUrl}/logout`, { withCredentials: true });
            if(response.status === 200 && response.data === "logout ok") {
                setIsLoading(false);
                
                navigation.navigate("Login");
                return;
            }
            else {
                throw new Error("Failed to connect");
            }
          }
        catch(error) {
            if(axios.isCancel(error)) {
                alert(`En error has occured in GET request: ${error}`);
            }
            else
            {
                setIsLoading(false);
            }
        }
    }
    
    return (
        <View  name="successView" style={styles.containerView}>
            <View style={styles.messageView}>
                <Text style={styles.loginText}>
                    Logged-in successfully!
                </Text>
            </View>
            
            <TouchableOpacity
                style={styles.logoutBtn}
                disabled={isLoading}
                onPress={onLogoutHandler}
            >
                <Text style={styles.loginText}>LOGOUT</Text>
            </TouchableOpacity>
        </View>
    );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{title: "LoginScreen", headerTransparent: true, header: () => null}}
            />
            <Stack.Screen
                name="Success"
                component={SuccessScreen}
                options={{title: "SuccessScreen", headerTransparent: true, header: () => null}}
            />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: "#DFFFEF",
        alignItems: "center",
        justifyContent: "center",
    },
    
    inputView: {
        backgroundColor: "#AFDFCF",
        borderRadius: 15,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },
    
    messageView: {
        width: "70%",
        height: 45,
        marginBottom: 500,
        alignItems: "center",
    },
    
    textInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 0,
        color:"#0F304F",
        fontSize:18,
    },
    
    loginBtn: {
        width:"70%",
        borderRadius:15,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        backgroundColor:"#AFD0EF",
    },
    
    loginText: {
        color:"#2F506F",
        fontWeight:"bold",
        fontSize:20,
    },
    
    logoutBtn: {
        width:"70%",
        borderRadius:15,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:0,
        backgroundColor:"#AFD0EF",
    },
});

export default App;
