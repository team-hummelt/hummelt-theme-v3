const {Component, createRef} = wp.element;

import {v4 as uuidv4} from "uuid";
import _, { map } from 'underscore';
export default class RateType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.rateTarget = createRef();
        this.state = {}

        this.onSetStar = this.onSetStar.bind(this);
        this.onClickSetStar = this.onClickSetStar.bind(this);
        this.onResetActiveStar = this.onResetActiveStar.bind(this);
    }

    onSetStar(e, count, isShow, notWrapper = true) {
        const rates = this.rateTarget.current.querySelectorAll('i');
        const rateNodes = Array.prototype.slice.call(rates, 0);
        const activeIcon = this.props.form.config.icon_active.split(" ");
        const icon = this.props.form.config.icon.split(" ");
        let x = 0;
        let _this = this;
        rateNodes.forEach(function (rate) {
            if (!rate.classList.contains('active')) {
                if (notWrapper) {
                    if (isShow) {
                        if (x <= count) {
                            rate.style.color = _this.props.form.config.color_fill;
                            rate.classList.remove(...rate.classList)
                            rate.classList.add(...activeIcon)
                        } else {
                            rate.style.color = _this.props.form.config.color;
                            rate.classList.remove(...rate.classList);
                            rate.classList.add(...icon)
                        }
                    }
                } else {
                    rate.style.color = _this.props.form.config.color;
                    rate.classList.remove(...rate.classList);
                    rate.classList.add(...icon)
                }
                x++;
            }
        })
    }

    onClickSetStar(count) {

        const rates = this.rateTarget.current.querySelectorAll('i');
        const rateNodes = Array.prototype.slice.call(rates, 0);
        let x = 0;
        let _this = this;
        const activeIcon = this.props.form.config.icon_active.split(" ");
        const icon = this.props.form.config.icon.split(" ");
        rateNodes.forEach(function (rate) {
            if (x < count) {
                rate.style.color = _this.props.form.config.color_fill;
                rate.classList.remove(...rate.classList)
                rate.classList.add(...activeIcon)
            } else {
                rate.style.color = _this.props.form.config.color;
                rate.classList.remove(...rate.classList);
                rate.classList.add(...icon)
            }

            rate.classList.add('active')
            x++;
        })

        this.props.onSetFormTextTypes(count, this.props.form.id)
    }

    onResetActiveStar() {
        const rates = this.rateTarget.current.querySelectorAll('i');
        const rateNodes = Array.prototype.slice.call(rates, 0);
        const icon = this.props.form.config.icon.split(" ");
        rateNodes.forEach(function (rate) {
            rate.classList.remove(...rate.classList)
            rate.classList.add(...icon)
        })

        this.props.onSetFormTextTypes(0, this.props.form.id)
    }

    render() {
        return (
            <div className={`bs-form-rating ${this.props.form.config.custom_class}`}>
                {this.props.form.hide_label ? ('') : (
                    <div
                        id={uuidv4()}
                        className="bs-form-label d-block mb-1">
                        {this.props.form.label}
                    </div>)}
                <div className={`d-flex align-items-center ${this.props.onFindConditionDisabledForms(this.props.form.condition.type || false ) ? 'disabled' : ''}`}>
                    <div onMouseLeave={(e) => this.onSetStar(e.currentTarget, '', false, false)}
                         ref={this.rateTarget} className="d-inline-flex align-items-center">
                        {_.times(parseInt(this.props.form.config.count) || 5, (i) => (
                            <i key={i}
                               title={`Rating ${String(i + 1)}`}
                               onClick={() => this.onClickSetStar(i + 1)}
                               onMouseOver={(e) => this.onSetStar(e.currentTarget, i, true)}
                               onMouseLeave={(e) => this.onSetStar(e.currentTarget, i, false)}
                               style={{
                                   color: i + 1 > parseInt(this.props.form.config.default) ? this.props.form.config.color : this.props.form.config.color_fill,
                                   fontSize: this.props.form.config.font_size,
                                   marginRight: this.props.form.config.count > i+1 ? this.props.form.config.distance : 0
                               }}
                               className={`${i + 1 > parseInt(this.props.form.config.default) ? this.props.form.config.icon : this.props.form.config.icon_active} ${this.props.form.config.default > 0 ? 'active' : ''}`}
                            >
                            </i>
                        ))}
                    </div>
                    {this.props.form.config.reset && parseInt(this.props.form.config.default) > 0 ? (
                        <i title="Reset" onClick={this.onResetActiveStar}
                           className="bi bi-x-circle text-muted ms-2"></i>
                    ) : ''}
                </div>
                {this.props.form && this.props.form.config.caption ? (
                    <div className="form-text">
                        {this.props.form.config.caption}
                    </div>
                ) : (<></>)}
            </div>
        )
    }
}