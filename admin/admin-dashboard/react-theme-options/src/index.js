const {render} = wp.element;
import App from './App.jsx';
import './styles/styles.scss';
if (document.getElementById('hummelt-theme-v3-options')) {
    render(<App/>, document.getElementById('hummelt-theme-v3-options'));
}