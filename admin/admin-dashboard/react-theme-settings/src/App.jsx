import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Optionen from "./pages/optionen/Optionen.jsx";
const {Component, Fragment} = wp.element;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {

        }
        this.urlSearchParam = this.urlSearchParam.bind(this);
    }

    urlSearchParam(search) {
        const authResult = new URLSearchParams(window.location.search);
        return authResult.get(search)
    }


    render() {
        return (
            <Fragment>
                {this.urlSearchParam('page') === 'hummelt-theme-v3-dashboard' && <Dashboard/>}
                {this.urlSearchParam('page') === 'hummelt-theme-v3-optionen' && <Optionen/>}

                <div id="snackbar-success"></div>
                <div id="snackbar-warning"></div>
            </Fragment>
        )
    }
}