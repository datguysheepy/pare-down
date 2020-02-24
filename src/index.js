import React from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home';

import PareDown from './pages/dashboard/PareDown.js';

import * as serviceWorker from './serviceWorker';


ReactDOM.render(<PareDown />, document.getElementById('root'));
document.getElementsByTagName('body')[0].style.backgroundColor = '#FAFAFF';
document.getElementsByTagName('body')[0].style.margin = '0';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();