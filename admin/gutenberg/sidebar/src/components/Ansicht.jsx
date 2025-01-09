const {__} = wp.i18n;
const {Component, Fragment, useState} = wp.element;
const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {PanelBody, PanelRow, ToggleControl, TextControl, SelectControl} = wp.components;
export default class Ansicht extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
    }

    render() {
        const selectSidebarOption = this.props.sidebar.map((select, index) => {
            return {
                label: select.name,
                value: select.id,
                key: index
            }
        });

        const MenuActive = (props) => {
            return (
                <div className="my-3">
                    <ToggleControl
                        label={__("Menu anzeigen", 'bootscore')}
                        checked={props.isMenuActive}
                        onChange={props.changeMenuActive}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            )
        }
        const MenuActiveMeta = compose([
            withSelect(select => {
                return {isMenuActive: select('core/editor').getEditedPostAttribute('meta')['_show_menu']}
            }),
            withDispatch(dispatch => {
                return {
                    changeMenuActive: function (value) {
                        dispatch('core/editor').editPost({meta: {_show_menu: value}});
                    }
                }
            })
        ])(MenuActive);

        const PageSpacer = (props) => {
            return (
                <div className="text-area">
                    <TextControl
                        label={__('Page Spacer', 'bootscore')}
                        value={props.spacerValue}
                        onChange={props.changeSpacerValue}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            )
        }
        const PageSpacerMeta = compose([
            withSelect(select => {
                return {spacerValue: select('core/editor').getEditedPostAttribute('meta')['_page_spacer']}
            }),
            withDispatch(dispatch => {
                return {
                    changeSpacerValue: function (value) {
                        dispatch('core/editor').editPost({meta: {_page_spacer: value}});
                    }
                }
            })
        ])(PageSpacer);

        const SelectSidebar = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Sidebar auswählen', 'bootscore')}
                        value={props.sidebarSelectValue}
                        options={selectSidebarOption}
                        onChange={props.onChangeSidebarSelect}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            );
        };
        const SelectSidebarMeta = compose([
            withSelect(select => {
                return {sidebarSelectValue: select('core/editor').getEditedPostAttribute('meta')['_select_sidebar']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeSidebarSelect: function (value) {
                        dispatch('core/editor').editPost({meta: {_select_sidebar: value}});
                    }
                }
            })
        ])(SelectSidebar);

        const SelectShowTopArea = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Top Area anzeigen', 'bootscore')}
                        value={props.menuShowTopAreaSelectValue}
                        options={[
                            {
                                label: 'Voreinstellung',
                                value: 1
                            },
                            {
                                label: 'anzeigen',
                                value: 2
                            },
                            {
                                label: 'ausblenden',
                                value: 3
                            },
                        ]}
                        onChange={props.onChangeShowTopAreaSelect}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            );
        };
        const SelectShowTopAreaMeta = compose([
            withSelect(select => {
                return {menuShowTopAreaSelectValue: select('core/editor').getEditedPostAttribute('meta')['_select_show_top_area']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeShowTopAreaSelect: function (value) {
                        dispatch('core/editor').editPost({meta: {_select_show_top_area: value}});
                    }
                }
            })
        ])(SelectShowTopArea);

        const SelectTopAreaContainer = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Top Menu Area Container', 'bootscore')}
                        value={props.menuTopAreaContainerSelectValue}
                        options={[
                            {
                                label: 'Voreinstellung',
                                value: 1
                            },
                            {
                                label: 'container',
                                value: 2
                            },
                            {
                                label: 'container-fluid',
                                value: 3
                            },
                        ]}
                        onChange={props.onChangeMenuTopAreaContainerSelect}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            );
        };
        const SelectTopAreaContainerMeta = compose([
            withSelect(select => {
                return {menuTopAreaContainerSelectValue: select('core/editor').getEditedPostAttribute('meta')['_select_top_area_container']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeMenuTopAreaContainerSelect: function (value) {
                        dispatch('core/editor').editPost({meta: {_select_top_area_container: value}});
                    }
                }
            })
        ])(SelectTopAreaContainer);

        const SelectMenuContainer = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Menü Container', 'bootscore')}
                        value={props.menuContainerSelectValue}
                        options={[
                            {
                                label: 'Voreinstellung',
                                value: 1
                            },
                            {
                                label: 'container',
                                value: 2
                            },
                            {
                                label: 'container-fluid',
                                value: 3
                            },
                        ]}
                        onChange={props.onChangeMenuContainerSelect}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            );
        };
        const SelectMenuContainerMeta = compose([
            withSelect(select => {
                return {menuContainerSelectValue: select('core/editor').getEditedPostAttribute('meta')['_select_menu_container']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeMenuContainerSelect: function (value) {
                        dispatch('core/editor').editPost({meta: {_select_menu_container: value}});
                    }
                }
            })
        ])(SelectMenuContainer);

        const SelectMainContainer = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Main Container', 'bootscore')}
                        value={props.mainContainerSelectValue}
                        options={[
                            {
                                label: 'Voreinstellung',
                                value: 1
                            },
                            {
                                label: 'container',
                                value: 2
                            },
                            {
                                label: 'container-fluid',
                                value: 3
                            },
                        ]}
                        onChange={props.onChangeMainContainerSelect}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            );
        };
        const SelectMainContainerMeta = compose([
            withSelect(select => {
                return {mainContainerSelectValue: select('core/editor').getEditedPostAttribute('meta')['_select_main_container']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeMainContainerSelect: function (value) {
                        dispatch('core/editor').editPost({meta: {_select_main_container: value}});
                    }
                }
            })
        ])(SelectMainContainer);


        return (
            <Fragment>
                <MenuActiveMeta/>
                <PageSpacerMeta/>
                <SelectSidebarMeta/>
                <SelectShowTopAreaMeta/>
                <span className="row-column-title font-weight">Seitenbreite | Container:</span>
                <SelectTopAreaContainerMeta/>
                <SelectMenuContainerMeta/>
                <SelectMainContainerMeta/>
            </Fragment>
        )
    }
}