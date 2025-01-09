const {render} = wp.element;
import App from './App.jsx';
let appFormBuilder = document.querySelectorAll('.app-formular-builder');
if(appFormBuilder) {
    let appFormularEvent = Array.prototype.slice.call(appFormBuilder, 0);
    appFormularEvent.forEach(function (form) {
        let builderId =  form.getAttribute('data-id');
        render(<App id={builderId}/>, form);
    })
}