import * as types from '../constants/actionType';
import io from 'socket.io-client';

var socket = null;

const SocketMiddleWare = store => next => action => {
    if (action.type === types.AUTHED) {
       
        if (!socket) {
            socket = io('https://chat-group-sv.herokuapp.com',{transports: ['polling']});
            let user = store.getState().checkLogged.user;
            console.log(action.dataUser.name);
            socket.emit('user-connect',{user: action.dataUser});
        }
        socket.on('server-send-users-online', (data) => {
            console.log(data);
            store.dispatch({type: 'USERSONLINE', users: data});
        })
        socket.off('server-send-message').on('server-send-message', data => {
            console.log('take');
            store.dispatch({type: 'BEMESS', from: data.from, message: data.message, to: data.to, img: data.img, date: data.date});        })
    }
    if (socket) {
        if (action.type === 'YOURROOMS') {
            if (action.yourRooms) {
                socket.emit('client-join-rooms', action.yourRooms);
            }
        }
        if (action.type === 'client-send-message') {
            console.log(action.message);
            socket.emit('client-send-message', action.message)
        };
        if (action.type === 'ROOMNOW') {
            //console.log(action.roomNow);
            if (action.roomNow) {
                socket.emit('client-send-room-now', action.roomNow);
            }
        }
        if (action.type === 'LEAVEROOM') {
            if (action.roomNow) {
                socket.emit('client-leave-room', action.roomNow);
            }
        }
    }
    return next(action);
}
export default SocketMiddleWare;