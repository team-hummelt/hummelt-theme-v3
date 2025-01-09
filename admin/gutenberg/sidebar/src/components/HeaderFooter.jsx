const {__} = wp.i18n;
const {Component, Fragment, useState} = wp.element;
const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {PanelBody, PanelRow, ToggleControl, TextControl, SelectControl} = wp.components;
export default class HeaderFooter extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {

        }
    }

    render() {
        const selectHeaderOption = this.props.headerSelects.map((select, index) => {
            return {
                label: select.label,
                value: select.id,
                key: index
            }
        });
        const SelectHeader = (props) => {
            return (
                <div style={{marginTop: '.75rem'}}>
                    <SelectControl
                        label={__('Header auswählen', 'bootscore')}
                        value={props.headerSelectValue}
                        options={selectHeaderOption}
                        onChange={props.onChangeHeaderSelect}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            );
        };
        const SelectHeaderMeta = compose([
            withSelect(select => {
                return {headerSelectValue: select('core/editor').getEditedPostAttribute('meta')['_theme_header']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeHeaderSelect: function (value) {
                        dispatch('core/editor').editPost({meta: {_theme_header: value}});
                    }
                }
            })
        ])(SelectHeader);

        const selectFooterOption = this.props.footerSelects.map((select, index) => {
            return {
                label: select.label,
                value: select.id,
                key: index
            }
        });
        const SelectFooter = (props) => {
            return (
                <div className="pt-2">
                    <SelectControl
                        label={__('Footer auswählen', 'bootscore')}
                        value={props.footerSelectValue}
                        options={selectFooterOption}
                        onChange={props.onChangeFooterSelect}
                        __nextHasNoMarginBottom={true}
                    />
                </div>
            );
        };
        const SelectFooterMeta = compose([
            withSelect(select => {
                return {footerSelectValue: select('core/editor').getEditedPostAttribute('meta')['_theme_footer']}
            }),
            withDispatch(dispatch => {
                return {
                    onChangeFooterSelect: function (value) {
                        dispatch('core/editor').editPost({meta: {_theme_footer: value}});
                    }
                }
            })
        ])(SelectFooter);

        return (
            <Fragment>
                <SelectHeaderMeta/>
                <SelectFooterMeta/>
            </Fragment>
        )
    }
}