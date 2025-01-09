const {Component, Fragment} = wp.element;
import {ReactSortable} from "react-sortablejs";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4} from "uuid";

export default class CheckLoop extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {
        return (
            <>
                <div className="mt-3">
                    <ReactSortable
                        className="row g-1"
                        list={this.props.formEdit.options}
                        handle=".move-option"
                        setList={(newState) => this.props.onUpdateSelectOptionsSortable(newState)}
                        {...this.props.sortableOptions}
                        onUpdate={(e) => this.props.onUpdateSelectOptions(e)}
                    >
                        {this.props.formEdit.options.map((o, index) => {
                            return (
                                <div className="options-item-wrapper" data-id={o.id} key={o.id}>
                                    <div
                                        className="option-item-inner position-relative border rounded p-3">
                                        <div
                                            className="position-absolute d-flex flex-wrap py-2 pe-2 top-0 end-0">
                                            <i onClick={(e) => this.props.onChangeOptionsSingleCollapse(e.currentTarget, "#select-option-" + (o.id))}
                                               className="collapse-option-btn option-collapse option-sm me-1"></i>
                                            <i className="move-option option-sm bi bi-arrows-move"></i>
                                        </div>

                                        {index > 0 ? (
                                            <i onClick={() => this.props.onDeleteSectionOption(o.id)}
                                               title='Option löschen'
                                               className="cursor-pointer scale-icon bi bi-x-circle text-danger"></i>
                                        ) : (<></>)}
                                        {this.props.optionCollapse ? (
                                            <small className={index > 0 ? 'ms-3' : ''}>{o.label}</small>
                                        ) : (
                                            <small className={index > 0 ? 'ms-3' : ''}>ID: {o.id}</small>
                                        )}


                                        <div id={"select-option-" + (o.id)}
                                             className={"option-multi-collapse collapse show"}>
                                            <div className="d-flex flex-wrap mt-2">
                                                <Form.Check
                                                    className="no-blur me-3"
                                                    type="checkbox"
                                                    checked={o.checked}
                                                    onChange={(e) => this.props.onUpdateEditCheckboxTextField(e.currentTarget.checked, o.id, 'checked')}
                                                    id={uuidv4()}
                                                    label="ausgewählt"
                                                />
                                            </div>
                                            <div className="d-flex flex-wrap mb-3">
                                                <Form.Check
                                                    className="no-blur me-3"
                                                    type="checkbox"
                                                    checked={o.required}
                                                    onChange={(e) => this.props.onUpdateEditCheckboxTextField(e.currentTarget.checked, o.id, 'required')}
                                                    id={uuidv4()}
                                                    label="Pflichtfeld"
                                                />
                                            </div>

                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="Label"
                                                className={"mb-2"}
                                            >
                                                <Form.Control
                                                    type="text"
                                                    value={o.label}
                                                    onChange={(e) => this.props.onUpdateEditCheckboxTextField(e.currentTarget.value, o.id, 'label')}
                                                    className="no-blur"
                                                />
                                            </FloatingLabel>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="Value"
                                            >
                                                <Form.Control
                                                    type="text"
                                                    value={o.value}
                                                    onChange={(e) => this.props.onUpdateEditCheckboxTextField(e.currentTarget.value, o.id, 'value')}
                                                    className="no-blur"
                                                />
                                            </FloatingLabel>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </ReactSortable>

                </div>
            </>
        )
    }
}