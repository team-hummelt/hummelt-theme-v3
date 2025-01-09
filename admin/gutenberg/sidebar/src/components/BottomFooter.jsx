const {__} = wp.i18n;
const {Component, Fragment, useState} = wp.element;
const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {PanelBody, PanelRow, ToggleControl, TextControl, SelectControl} = wp.components;
export default class BottomFooter extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
    }

    render() {

        const SelectWidgetFooterActive = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Widget Footer aktiv', 'bootscore')}
                        value={props.widgetSelectActive}
                        options={[
                            {
                                label: 'Voreinstellung',
                                value: 1
                            },
                            {
                                label: 'aktiv',
                                value: 2
                            },
                            {
                                label: 'nicht aktiv',
                                value: 3
                            }
                        ]}
                        onChange={props.onChangeWidgetSelectActive}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            )
        }
        const SelectWidgetFooterActiveMeta = compose([
            withSelect(select => {
                return {widgetSelectActive: select('core/editor').getEditedPostAttribute('meta')['_widgets_footer_active']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeWidgetSelectActive: function (value) {
                        dispatch('core/editor').editPost({meta: {_widgets_footer_active: value}});
                    }
                }
            })
        ])(SelectWidgetFooterActive);

        const SelectWidgetFooterContainer = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Widget Footer Container', 'bootscore')}
                        value={props.widgetSelectContainer}
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
                            }
                        ]}
                        onChange={props.onChangeWidgetSelectContainer}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            )
        }
        const SelectWidgetFooterContainerMeta = compose([
            withSelect(select => {
                return {widgetSelectContainer: select('core/editor').getEditedPostAttribute('meta')['_widget_footer_container']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeWidgetSelectContainer: function (value) {
                        dispatch('core/editor').editPost({meta: {_widget_footer_container: value}});
                    }
                }
            })
        ])(SelectWidgetFooterContainer);

        const SelectBottomFooterActive = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Bottom Footer anzeigen', 'bootscore')}
                        value={props.bottomActiveSelectValue}
                        options={[
                            {
                                label: 'Voreinstellung',
                                value: 1
                            },
                            {
                                label: 'aktiv',
                                value: 2
                            },
                            {
                                label: 'nicht aktiv',
                                value: 3
                            }
                        ]}
                        onChange={props.onChangeBottomActiveSelect}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            )
        }
        const SelectBottomFooterActiveMeta = compose([
            withSelect(select => {
                return {bottomActiveSelectValue: select('core/editor').getEditedPostAttribute('meta')['_bottom_footer_active']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeBottomActiveSelect: function (value) {
                        dispatch('core/editor').editPost({meta: {_bottom_footer_active: value}});
                    }
                }
            })
        ])(SelectBottomFooterActive);

        const SelectBottomStickyFooterActive = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Bottom Footer Sticky', 'bootscore')}
                        value={props.bottomStickySelectValue}
                        options={[
                            {
                                label: 'Voreinstellung',
                                value: 1
                            },
                            {
                                label: 'aktiv',
                                value: 2
                            },
                            {
                                label: 'nicht aktiv',
                                value: 3
                            }
                        ]}
                        onChange={props.onChangeBottomStickySelect}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            )
        }
        const SelectBottomStickyFooterActiveMeta = compose([
            withSelect(select => {
                return {bottomStickySelectValue: select('core/editor').getEditedPostAttribute('meta')['_bottom_sticky_footer']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeBottomStickySelect: function (value) {
                        dispatch('core/editor').editPost({meta: {_bottom_sticky_footer: value}});
                    }
                }
            })
        ])(SelectBottomStickyFooterActive);

        const SelectBottomStickyFooterContainer = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Bottom Footer Container', 'bootscore')}
                        value={props.bottomSelectContainer}
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
                            }
                        ]}
                        onChange={props.onChangeBottomSelectContainer}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            )
        }
        const SelectBottomStickyFooterContainerMeta = compose([
            withSelect(select => {
                return {bottomSelectContainer: select('core/editor').getEditedPostAttribute('meta')['_select_bottom_footer_container']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeBottomSelectContainer: function (value) {
                        dispatch('core/editor').editPost({meta: {_select_bottom_footer_container: value}});
                    }
                }
            })
        ])(SelectBottomStickyFooterContainer);

        return (
            <Fragment>
                <br/><span className="row-column-title font-weight">Widget Footer:</span>
                <SelectWidgetFooterActiveMeta/>
                <SelectWidgetFooterContainerMeta/>
                <span className="row-column-title font-weight">Bottom Footer:</span>
                <SelectBottomFooterActiveMeta/>
                <SelectBottomStickyFooterActiveMeta/>
                <SelectBottomStickyFooterContainerMeta/>
            </Fragment>
        )
    }
}