const {Component, Fragment} = wp.element;
import $ from "jquery";
import 'datatables.net-bs5'; // Für Bootstrap 5
import 'datatables.net-buttons-bs5'; // Für Buttons
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import "datatables.net-bs5";
// Datatables - Buttons
import DTGerman from "../utils/DTGerman";
import Table from "react-bootstrap/Table";
import 'datatables-buttons-excel-styles';

const JSZip = require('jszip');


window.JSZip = JSZip;


const v5NameSpace = '071330f0-521d-4564-9fbd-6d96dd412b1f';

const columnDefs = [{
    orderable: false,
    targets: [3, 4, 5, 6],
}, {
    targets: [0, 1, 2],
    className: 'align-middle'
}, {
    targets: [3, 4, 5, 6],
    className: 'align-middle text-center'
}, {
    targets: [],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];
export default class FormsTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tableForms = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.formTable()
    }

    formTable() {
        let _this = this;
        let table = $(this.tableForms.current).DataTable(
            {
                "language": DTGerman(),
                data: [],
                "order": [[0, 'asc']],
                "lengthMenu": [[5, 10, 15, 20, 30, 50, 100, -1], [5, 10, 15, 20, 30, 50, 100, 'alle']],
                "searching": true,
                "pageLength": 10,
                "paging": true,
                "autoWidth": false,
                "processing": true,
                "serverSide": true,
                "columns": [
                    {
                        title: 'Bezeichnung',
                        width: "50%",
                    }, {
                        title: 'Formular',
                        width: "15%",
                    }, {
                        title: 'Erstellt',
                        width: "15%",
                    }, {
                        title: `<i title="Duplizieren " class="bi bi-copy"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="Duplizieren " class="btn-duplicate btn btn-primary text-nowrap  btn-sm"><i  class="bi bi-copy"></i></button>`,
                        targets: -1
                    }, {
                        title: `<i title="Download" class="bi bi-cloud-download"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="Download" class="btn-download btn btn-warning text-white text-nowrap btn-sm"><i  class="bi bi-cloud-download"></i></button>`,
                        targets: -1
                    }, {
                        title: `<i title="Bearbeiten" class="bi bi-tools"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="Form-Builder" class="btn-builder btn btn-success text-nowrap btn-sm"><i class="bi bi-grid me-2"></i>Form-Builder</button>`,
                        targets: -1
                    }, {
                        title: `<i title="Löschen" class="bi bi-trash"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="Löschen" class="btn-trash btn btn-danger text-nowrap dark btn-sm"><i title="Löschen" class="bi bi-trash"></i></button>`,
                        targets: -1
                    }
                ],
                columnDefs,
                "ajax": {
                    url: `${hummeltRestObj.ajax_url}`,
                    type: 'POST',
                    data: {
                        'method': 'form_table',
                        '_ajax_nonce': hummeltRestObj.nonce,
                        'action': hummeltRestObj.handle
                    },
                    "dataSrc": function (json) {
                        _this.props.onSetExampleSelects(json.examples)
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-duplicate', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'duplicate_forms',
                'id': data[3]
            }
             _this.props.sendFetchApi(formData)
        })

        table.on('click', 'button.btn-download', function (e) {
            let data = table.row(e.target.closest('tr')).data();
           // window.location.href = `${hummeltRestObj.form_download}?${data[4]}`;
            window.open(`${hummeltRestObj.form_download}?id=${data[4]}`, '_blank');
        })

        table.on('click', 'button.btn-builder', function (e) {
            let data = table.row(e.target.closest('tr')).data();
             _this.props.onGetBuilder(data[5])
        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `Formular löschen?`,
                'msg': 'Alle Daten werden gelöscht. Das Löschen kann nicht rückgängig gemacht werden.',
                'btn': 'Formular löschen'
            }

            let formData = {
                'method': 'delete_form_builder',
                'id': data[6]
            }
             _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawTable) {
            $(this.tableForms.current).DataTable().draw('page');
            this.props.setDrawTable(false)
        }
    }

    componentWillUnmount() {
        $(this.tableForms.current).DataTable().destroy()
    }

    render() {
        return (
            <Table
                responsive
                ref={this.tableForms}
                className="w-100 h-100" striped bordered>
            </Table>
        )
    }
}

