import './editor.scss';
import './style.scss';
import domReady from '@wordpress/dom-ready';
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const {registerPlugin} = wp.plugins;
import Sidebar from "./Sidebar.jsx";

const {select} = wp.data;
const HummeltThemeV3SidebarPlugin = () => {
    const postType = select("core/editor").getCurrentPostType();
    let incArr = ["post", "page"];
    if(!incArr.includes(postType)) {
        return null;
    }
    return (
        <Fragment>
            <Sidebar/>
        </Fragment>
    );
}

domReady(() => {
    registerPlugin('hummelt-theme-v3-sidebar', {
        icon: 'hupaIcon',
        className: 'hummelt-theme-v3-sidebar',
        render: HummeltThemeV3SidebarPlugin,
    });
});