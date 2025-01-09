const {Component, Fragment} = wp.element;
import $ from "jquery";
import Table from "react-bootstrap/Table";
import 'datatables.net-bs5'; // Für Bootstrap 5
import 'datatables.net-buttons-bs5'; // Für Buttons
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import "datatables.net-bs5";
// Datatables - Buttons
import DTGerman from "../utils/DTGerman";

import 'datatables-buttons-excel-styles';

const JSZip = require('jszip');


window.JSZip = JSZip;


const v5NameSpace = '071330f0-521d-4564-9fbd-6d96dd412b1f';

const columnDefs = [{
    orderable: false,
    targets: [3, 4, 5, 6],
}, {
    targets: [0, 1, 2, 3, 4],
    className: 'align-middle'
}, {
    targets: [5, 6],
    className: 'align-middle text-center'
}, {
    targets: [],
    className: 'text-nowrap'
}, {
    targets: ['_all'],
    className: 'fw-normal'
}
];
export default class EmailTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.emailTable = React.createRef();
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.formTable()
    }

    formTable() {
        let _this = this;
        let table = $(this.emailTable.current).DataTable(
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
                        title: 'Gesendet',
                        width: "15%",
                    }, {
                        title: 'Formular',
                        width: "15%",
                    },{
                        title: 'Betreff',
                        width: "15%",
                    }, {
                        title: 'Cc',
                        width: "15%",
                    }, {
                        title: 'Bcc',
                        width: "15%",
                    },  {
                        title: `<i title="E-Mail" class="bi bi-envelope"></i>`,
                        width: "3%",
                        data: null,
                        defaultContent: `<button title="E-Mail" class="btn-email btn btn-success text-nowrap btn-sm"><i class="bi bi-envelope me-2"></i>E-Mail</button>`,
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
                        'method': 'email_table',
                        '_ajax_nonce': hummeltRestObj.nonce,
                        'action': hummeltRestObj.handle
                    },
                    "dataSrc": function (json) {
                        return json.data;
                    }
                },
                destroy: true,
            })

        table.on('click', 'button.btn-email', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let formData = {
                'method': 'get_form_email',
                'id': data[5]
            }
            _this.props.sendFetchApi(formData)

        })

        table.on('click', 'button.btn-trash', function (e) {
            let data = table.row(e.target.closest('tr')).data();
            let swal = {
                'title': `E-Mail löschen?`,
                'msg': 'Alle Daten werden gelöscht. Das Löschen kann nicht rückgängig gemacht werden.',
                'btn': 'E-Mail löschen'
            }

            let formData = {
                'method': 'delete_form_email',
                'id': data[6]
            }
            _this.props.onDeleteSwalHandle(formData, swal)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawEmailTable) {
            $(this.emailTable.current).DataTable().draw('page');
            this.props.setDrawEmailTable(false)
        }
    }

    componentWillUnmount() {
        $(this.emailTable.current).DataTable().destroy()
    }

    render() {
        return (
            <Table
                responsive
                ref={this.emailTable}
                className="w-100 h-100" striped bordered>
            </Table>
        )
    }
}

