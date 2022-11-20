/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import Home from './pages/home';

render(() => <Home />, document.getElementById('root') as HTMLElement);
