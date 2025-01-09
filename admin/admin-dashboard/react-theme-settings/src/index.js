const {render} = wp.element;
import App from './App.jsx';
import './styles/styles.scss';
if (document.getElementById('hummelt-theme-v3')) {
    render(<App/>, document.getElementById('hummelt-theme-v3'));
}