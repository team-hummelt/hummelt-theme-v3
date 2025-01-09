const {__} = wp.i18n;
const {Component, Fragment, useState} = wp.element;
const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {PanelBody, PanelRow, ToggleControl, TextControl, SelectControl} = wp.components;
export default class Title extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            titleActive: false
        }
    }

    render() {
        const TitleActive = (props) => {
            return (
                <div className="my-3">
                    <ToggleControl
                        label={__("Titel aktiv", 'bootscore')}
                        checked={props.isTitleActive}
                        onChange={props.changeTitleActive}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            )
        }
        const TitleActiveMeta = compose([
            withSelect(select => {
                return {isTitleActive: select('core/editor').getEditedPostAttribute('meta')['_show_title']}
            }),
            withDispatch(dispatch => {
                return {
                    changeTitleActive: function (value) {
                        dispatch('core/editor').editPost({meta: {_show_title: value}});
                    }
                }
            })
        ])(TitleActive);

        const CustomTitle = (props) => {
            return (
                <div className="text-area">
                    <TextControl
                        label={__('Titel ändern', 'bootscore')}
                        value={props.customTitleValue}
                        onChange={props.changeCustomTitleValue}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            )
        }
        const CustomTitleMeta = compose([
            withSelect(select => {
                return {customTitleValue: select('core/editor').getEditedPostAttribute('meta')['_custom_title']}
            }),
            withDispatch(dispatch => {
                return {
                    changeCustomTitleValue: function (value) {
                        dispatch('core/editor').editPost({meta: {_custom_title: value}});
                    }
                }
            })
        ])(CustomTitle);

        const CustomTitleCss = (props) => {
            return (
                <div className="text-area">
                    <TextControl
                        label={__('Extra CSS Klasse', 'bootscore')}
                        value={props.customTitleCssValue}
                        onChange={props.changeCustomTitleCssValue}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            )
        }
        const CustomTitleCssMeta = compose([
            withSelect(select => {
                return {customTitleCssValue: select('core/editor').getEditedPostAttribute('meta')['_title_css']}
            }),
            withDispatch(dispatch => {
                return {
                    changeCustomTitleCssValue: function (value) {
                        dispatch('core/editor').editPost({meta: {_title_css: value}});
                    }
                }
            })
        ])(CustomTitleCss);
        return (
            <Fragment>
                <TitleActiveMeta/>
                <CustomTitleMeta/>
                <CustomTitleCssMeta/>
            </Fragment>
        )
    }

}