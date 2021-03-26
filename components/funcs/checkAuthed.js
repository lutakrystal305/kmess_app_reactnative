import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const dispatch = useDispatch();
export const checkAuth = (token) => {
    axios
        .post('https://chat-group-sv.herokuapp.com/user/check', { token })
        .then((res) => {
            console.log('hallo');
            console.log(res.data);
            dispatch({type: 'AUTHED', dataUser: res.data});
            //navigation.navigate('App');
        })
};