const {render} = wp.element;
import './styles/styles.scss';


import App from './App.jsx';



if (document.getElementById('hummelt-theme-v3-forms')) {
    render(<App/>, document.getElementById('hummelt-theme-v3-forms'));
}