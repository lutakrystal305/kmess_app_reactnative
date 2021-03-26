import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import myReducer from './reducer/';
import SocketMiddleWare from './reducer/Socket.middleware';

const store = createStore(
    myReducer,
    composeWithDevTools(applyMiddleware(SocketMiddleWare))
    );

export default store;