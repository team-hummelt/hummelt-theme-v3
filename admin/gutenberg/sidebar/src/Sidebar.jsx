const {__} = wp.i18n;
const {Fragment, Component} = wp.element;
const {PluginSidebarMoreMenuItem, PluginSidebar} = wp.editor || wp.editPost;
const {PanelBody} = wp.components;
import Title from "./components/Title.jsx";
import HeaderFooter from "./components/HeaderFooter.jsx";
import BottomFooter from "./components/BottomFooter.jsx";
import Ansicht from "./components/Ansicht.jsx";
export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            headerSelects: [],
            footerSelects: [],
            sidebar: []
        }
    }

    componentDidMount() {
        let formData = {
            'method': 'get_sidebar_items'
        }
        this.sendFetchApi(formData)
    }

    sendFetchApi(formData, path = hummeltRestEditorObj.gutenberg_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_sidebar_items':
                    if (data.status) {
                        this.setState({
                            footerSelects: data.footer,
                            headerSelects: data.header,
                            sidebar: data.sidebar
                        })
                    }
                    break;
            }
        }).catch(
            (error) => {
                if (error.code === 'rest_permission_error' || error.code === 'rest_failed') {
                    console.log(error.message);
                }
            }
        );
    }

    render() {
        return (
            <Fragment>
                <PluginSidebarMoreMenuItem
                    target='hummelt-v3-sidebar'
                    icon='erIcon'
                >
                    {__('Hummelt-Theme', 'bootscore')}
                </PluginSidebarMoreMenuItem>
                <PluginSidebar
                    name="hummelt-v3-sidebar"
                    title={__('Theme Optionen', 'bootscore')}
                    className="hummelt-v3-sidebar"
                >
                    <PanelBody
                        title={__('Seiten Titel', 'bootscore')}
                        initialOpen={false}
                        className="hupa-sidebar-content"
                    >
                        <Title/>
                    </PanelBody>
                    <PanelBody
                        title={__('Ansicht', 'bootscore')}
                        initialOpen={false}
                        className="hupa-sidebar-content"
                    >
                        <Ansicht
                            sidebar={this.state.sidebar}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__('Footer', 'bootscore')}
                        initialOpen={false}
                        className="hupa-sidebar-content"
                    >
                        <BottomFooter/>
                    </PanelBody>
                    <PanelBody
                        title={__('Custom Header | Footer', 'bootscore')}
                        initialOpen={false}
                        className="hupa-sidebar-content"
                    >
                        <HeaderFooter
                            headerSelects={this.state.headerSelects}
                            footerSelects={this.state.footerSelects}
                        />
                    </PanelBody>
                </PluginSidebar>
            </Fragment>
        )
    }
}