import Pickr from '@simonwep/pickr';

const {Component, Fragment} = wp.element;


let pickr;
export default class SimonColorPicker extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.pickerRef = React.createRef();
        this.state = {
            initColor: this.props.color || '#42445a',
            color: ''
        }
    }

    componentDidMount() {
        // Initialisiere den Color Picker nach dem Mount
        pickr = Pickr.create({
            el: this.pickerRef.current,
            theme: 'classic', // Beispiel: Du kannst das Theme ändern
            default: this.state.initColor,
            useAsButton: false,
            defaultRepresentation: 'HEX',
            position: 'left',
            swatches: [
                '#1d6096',
                '#50575e',
                '#E11D2A',
                '#198754',
                '#F44336',
                '#adff2f',
                '#E91E63',
                '#9C27B0',
                '#673AB7',
                '#3F51B5',
                '#2196F3',
                '#03A9F4',
                '#00BCD4',
                '#009688',
                '#4CAF50',
                '#8BC34A',
                '#CDDC39',
                '#FFEB3B',
                '#FFC107',
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)',
                'rgba(0, 188, 212, 0.7)',
                'rgba(0, 150, 136, 0.75)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(139, 195, 74, 0.85)',
                'rgba(205, 220, 57, 0.9)',
                'rgba(255, 235, 59, 0.95)'
            ],
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: true,
                    hsva: true,
                    cmyk: false,
                    input: true,
                    clear: false,
                    save: true,
                    cancel: true,
                },
            },
            i18n: {
                // Strings visible in the UI
                'ui:dialog': 'color picker dialog',
                'btn:toggle': 'toggle color picker dialog',
                'btn:swatch': 'color swatch',
                'btn:last-color': 'use previous color',
                'btn:save': 'Speichern',
                'btn:cancel': 'Abbrechen',
                'btn:clear': 'Löschen',
                // Strings used for aria-labels
                'aria:btn:save': 'save and close',
                'aria:btn:cancel': 'cancel and close',
                'aria:btn:clear': 'clear and close',
                'aria:input': 'color input field',
                'aria:palette': 'color selection area',
                'aria:hue': 'hue selection slider',
                'aria:opacity': 'selection slider'
            }
        });

        pickr.on('init', pickr => {
            ///pickr.setColor(this.props.color)
            //pickr.setColorRepresentation(this.props.color);
        })
        pickr.on('save', (color, instance) => {
            if (this.props.callback) {
                this.props.callback(color.toHEXA().toString(), this.props.handle, this.props.id)
            }
            instance.hide();
        })

        pickr.on('cancel', (instance) => {
            const last = instance._lastColor.toHEXA().toString(0)
            //colorInput.value = instance._lastColor.toHEXA().toString(0);
            instance.hide();
        })

        // Event-Listener für Farbänderungen
        pickr.on('change', (color) => {
            const newColor = color.toHEXA().toString();
            this.setState({color: newColor});
        });
    }


    componentWillUnmount() {
        if (pickr) {
            pickr.destroy();
        }
    }

    render() {
        return (
            <div ref={this.pickerRef}></div>
        );
    }
}