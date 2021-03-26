import React, { useState, useEffect } from 'react';
import { Image, Text, View, Linking, StyleSheet, TouchableOpacity, Pressable, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { Permissions } from 'expo';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default ProfileScreen = () => {
    const authed = useSelector(state => state.checkLogged);
    const [urlFile, setUrlFile] = useState(null);
    const [imgAvt, setImgAvt] = useState('');
    const [stt, setStt] = useState('');
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [checkCam, setCheckCam] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

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
    const base64File = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            console.log(reader.result);
            setUrlFile(reader.result);
        }
    }
    const handleCancel = () => {
        setUrlFile('');
        setImgAvt('');
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
            data.append('upload_preset', 'chat_default')
            data.append("cloud_name", "den6tpnab")
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
    /*useEffect(() => {
        base64File(data);
    }, [data]);*/
    useEffect(() => {
        setImgAvt(authed.user.urlAvt);
    },[authed.user]);
    return(
        authed.user && 
        !checkCam ?
        <View style={styles.container}>
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
                    <TouchableOpacity style={styles.ModalItem}><Text>Watch</Text></TouchableOpacity>
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
            <View style={styles.formInfor}>
                <View style={styles.itemInfor}>
                    <Text>{authed.user.name}</Text>
                </View>
                <View style={styles.itemInfor}>
                    <Text>{authed.user.email}</Text>
                </View>
                <View style={styles.itemInfor}>
                    <Text>{authed.user.date}</Text>
                </View>
            </View>
        </View>
        : <Photo />
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    Up: {
        backgroundColor: '#AAA',
        opacity: 0.5,
    },
    formInfor: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
        backgroundColor: '#EEE',
        borderRadius: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemInfor: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#777',
        borderTopColor: '#AAA',
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