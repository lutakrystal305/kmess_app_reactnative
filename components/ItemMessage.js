import React, { useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, SafeAreaView, FlatList, Text, View, Button, TextInput, StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import InfiniteScroll from 'react-native-infinite-scrolling'
import MessComponent from './chat/MessComponent';


export default ItemMessage = ({ route }) => {
    const dispatch = useDispatch();
    const messageSocket = useSelector(state => state.messageSocket);
    const authed = useSelector(state => state.checkLogged);

    let user = authed.user;

    const [stt, setStt] = useState('');
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [checkCam, setCheckCam] = useState(false);
    const [imgX, setImgX] = useState(null);
    const [mess, setMess] = useState('');
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(10);

    const permissionCamera = async () => {
        //setModalVisible(false);
        const { status } = await Camera.requestPermissionsAsync();
        setStt(status);
        if (status !== 'granted') {
            Linking.openURL('app-settings:');
            return;
            
        }
        setCheckCam(true);
    }
    const takePicture = async () => {
        try {
            const options = { quality: 0.5, base64: true };
            const data = await camera.takePictureAsync(options);
            let filename = data.uri.split('/').pop();
            //setImgAvt(data.uri);
            setImgX({uri: data.uri, type: data.type, name: filename});
            console.log(data.uri, '<<<<<<<<<<<<<<<<<<<<<');
            setCheckCam(false);
        } catch (error) {
            console.log(error, "ERROR <<<<<<<<<<<<<")
        }
    }
    const permissionGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
        pickImage();
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
            let filename = result.uri.split('/').pop();
            //setImgAvt(result.uri);
            setImgX({uri: result.uri, type: result.type, name: filename});
        }
      };
    const getItems = () => {
        if (messageSocket.messages.length > 0) {
            setItems(messageSocket.messages.slice(0,10));
        }
    }

    const handlePress = () => {
        dispatch({type: 'client-send-message', message:{message: mess, to: messageSocket.roomNow, from: user, date: Date.now()}});
        setMess('');
    }
    let list=[];
    const fetchMoreData = () => {
        if (count && messageSocket.messages.length >0) {
            if (count < messageSocket.messages.length) {
                list = messageSocket.messages.slice(count, count +10);
                setTimeout(() => {
                    setItems([...items, ...list]);
                }, 1000);
                setCount(count+10);
            } else {

                return;
            }
        }
    }
    const getMessage = () => {
        if (messageSocket.roomNow) {
            axios
                .post('https://chat-group-sv.herokuapp.com/chat/message', { group : messageSocket.roomNow})
                .then((res) => {
                    dispatch({type: 'APIMESS', messages: res.data})
                })
        }
    }
    let camera;
    const Photo = () => {
        return(
            <View style={styles.container}>
                <Camera style={styles.camera} type={type} ref={ref => (camera = ref)}>
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={{flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }} onPress={() =>setCheckCam(false)}>
                        <Text style={{ fontSize: 14 }}> Quit </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                        }}>
                        <Text style={styles.text} > Flip </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }} onPress={takePicture}>
                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                    
                    </View>
                </Camera>
            </View>
        )
    }
    let chat;
    chat = {from: authed.user, to: messageSocket.roomNow, date: Date.now()};
    let _id = authed.user._id;
    const hanldeImageUp = () => {
        console.log(_id)
            const data = new FormData()
            data.append('file', imgX)
            data.append('upload_preset', 'chat_default');
            data.append("cloud_name", "den6tpnab");
            fetch("https://api.cloudinary.com/v1_1/den6tpnab/image/upload", {
            method: "post",
            body: data
            }).then(res => res.json()).
            then(result => {
                console.log(result);
                chat = {...chat, message: result.url, img: true};
                console.log(chat);
                dispatch({type: 'client-send-message', message: chat});
                setImgX(null);
            }).catch(err => {
                Alert.alert("An Error Occured While Uploading")
      })
    }
    useEffect(() => {
        messageSocket.roomNow && getMessage();
    },[messageSocket.roomNow]);
    useEffect(() => {
        getItems();
    },[messageSocket.messages]);
    useEffect(() => {
        imgX && setItems([...items, {...chat, _id, message: imgX.uri, load: true}]);
    }, [imgX]);
    useEffect(() => {
        if (imgX) {
            hanldeImageUp();
        }
    }, [imgX]);
    return(
        !checkCam ? 
        <View >
            <KeyboardAvoidingView
                behavior='position'
                keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 0}
            >
              <SafeAreaView style={styles.message}>
                <FlatList 
                    renderItem={({ item }) => <MessComponent x={item} />}
                    data={items}
                    keyExtractor={item => `${item._id}`}
                    onEndReached={fetchMoreData}
                    inverted={true}
              	/>
            	</SafeAreaView>
                
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View>
                        <View style={styles.formMess}>
                            <Ionicons name='camera' color='#008489' size={35} style={{marginHorizontal: 5}} onPress={permissionCamera} />
                            <Ionicons name='image' color='#489620' size={35} onPress={permissionGallery} />
                            <TextInput onChangeText={text => setMess(text)} value={mess} style={styles.formInputStyle} />
                            <Button title="Send" onPress={handlePress} />
                    </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
        : <Photo />
    )
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        bottom: 0,
        width: '100%',
        height: '100%'
    },
    message: {
        width: '100%',
        height: '93%'
    },  
    formMess: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    formInputStyle: {
        marginLeft: 10,
        width: '60%',
        borderWidth: 1,
        borderColor: '#AAA',
        height: 40,
    },
    camera: {
        flex: 1,
      },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
})