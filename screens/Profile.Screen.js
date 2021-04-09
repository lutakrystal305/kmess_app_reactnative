import React, { useState, useEffect } from 'react';
import { Image, Text, View, Linking, StyleSheet, TouchableOpacity, Pressable, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Permissions } from 'expo';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const authed = useSelector(state => state.checkLogged);
    const [urlFile, setUrlFile] = useState(null);
    const [imgAvt, setImgAvt] = useState('');
    const [stt, setStt] = useState('');
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [checkCam, setCheckCam] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleSignOut = () => {
        dispatch({type: 'LOGOUT'});
        dispatch({type: 'UNAUTHED'});
        navigation.navigate('Auth');
      };
    
    const permissionCamera = async () => {
        setModalVisible(false);
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
            setImgAvt(data.uri);
            setUrlFile({uri: data.uri, type: data.type, name: filename});
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
            setImgAvt(result.uri);
            setUrlFile({uri: result.uri, type: result.type, name: filename});
            setModalVisible(false);
        }
      };
    //const { data } = await Camera.takePictureAsync();
    const handleCancel = () => {
        setUrlFile('');
        setImgAvt(authed.user.urlAvt);
    }
    const handleUpImage = (data) => {
        axios
            .post('https://chat-group-sv.herokuapp.com/user/avt', {data, _id: authed.user._id})
            .then((res) => {
                console.log(res);
                dispatch({type: 'AUTHED', dataUser: res.data})
            });
    }
    const handleSubmit = () => {
        console.log(urlFile, '****');
        const data = new FormData()
            data.append('file', urlFile)
            data.append('upload_preset', 'chat_default');
            data.append("cloud_name", "den6tpnab");
            fetch("https://api.cloudinary.com/v1_1/den6tpnab/image/upload", {
            method: "post",
            body: data
            }).then(res => res.json()).
            then(data => {
                console.log(data);
                handleUpImage(data.url);
                setUrlFile('');
            }).catch(err => {
                Alert.alert("An Error Occured While Uploading")
      })
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
                        <Text style={styles.text}> Flip </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }} onPress={takePicture}>
                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                    
                    </View>
                </Camera>
            </View>
        )
    }

    useEffect(() => {
        authed.user.urlAvt && setImgAvt(authed.user.urlAvt);
    },[authed.user]);
    return(
        authed.user && 
        !checkCam ?
        <View style={styles.container}>
            <View style={styles.viewTop}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    setModalVisible(false);
                    }}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.ModalItem} onPress={() => setModalVisible(false)}><Text>Watch</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.ModalItem} onPress={permissionCamera} ><Text>Take Photo</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.ModalItem} onPress={permissionGallery}><Text>Choose a picture</Text></TouchableOpacity>
                    </View>
                    </View>
                </Modal>
                <Pressable style={{width: 200, height: 200, overflow: 'hidden', borderWidth: 1, borderColor: '#AAA', borderRadius: 2000}} onPress={() => setModalVisible(true)}>
                    {imgAvt ? <Image source={{uri: imgAvt}} style={{width: '100%', height: '100%'}} /> : <Text></Text>}

                </Pressable>
                {urlFile ?  <View>
                    <TouchableOpacity onPress={handleCancel}><Text>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit}><Text>Save</Text></TouchableOpacity>
                </View> : <Text></Text>}
            </View>
            <View style={styles.formInfor}>
                <View style={styles.itemInfor}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#88a09e'}}>Name: </Text>
                    <Text style={{fontSize: 16, color: '#9956d5'}}>{authed.user.name}</Text>
                </View>
                <View style={styles.itemInfor}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#27d978'}}>Email: </Text>
                    <Text style={{fontSize: 16, color: '#9f4671'}}>{authed.user.email}</Text>
                </View>
                <View style={styles.itemInfor}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#d7c622'}}>Gender: </Text>
                    <Text style={{fontSize: 16, color: '#254d99'}}>{authed.user.sex}</Text>
                </View>
                {authed.user.date && <View style={styles.itemInfor}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#26d756'}}>Date of Birth: </Text>
                    <Text style={{fontSize: 16, color: '#242242'}}>{authed.user.date}</Text>
                </View>}
                <View style={styles.itemInfor1}>
                    <Text style={{fontSize: 16, marginBottom: 10, fontWeight: 'bold', color: '#5656d7'}}>Date of initialization: </Text>
                    <Text style={{fontSize: 16, color: '#da6b77'}}>{authed.user.update}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={handleSignOut} style={{marginVertical: 10}}>
                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#2476d9'}}>Log Out</Text>
            </TouchableOpacity>
        </View>
        : <Photo />
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    viewTop: {
        flex: 0.55,
        alignItems: 'center',
    },  
    Up: {
        backgroundColor: '#AAA',
        opacity: 0.5,
    },
    formInfor: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
        borderWidth: 1,
        borderColor: '#AAA',
        backgroundColor: '#EEE',
        borderRadius: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemInfor: {
        paddingVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#f00',
        borderTopColor: '#0f0',
        marginVertical: 15,
        overflow: 'hidden'
    },
    itemInfor1: {
        paddingVertical: 10,
        flex: 0.3,
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#08a7c1',
        borderTopColor: '#b6c764',
        marginVertical: 15,
        overflow: 'hidden'
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
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      ModalItem: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: 40,
          borderTopColor: '#AAA',
            borderTopWidth: 1,
      }
})