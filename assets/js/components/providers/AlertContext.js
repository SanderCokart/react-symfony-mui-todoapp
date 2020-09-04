import React, {Component, createContext} from 'react';

export const AlertContext = createContext();

export default class AlertContextProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert:    {text: null, level: null},
            open:     false,
            setAlert: this.setAlert.bind(this),
            close:    this.close.bind(this),
        };
    }

    /**
     * if both alert keys are defined: set the alert and open the alert
     * if both are undefined or if alert itself is undefined: reset alert back to null on text and level
     * @param alert {object} - alert object
     * @param alert.text=null {(string|string[])} - string or array of messages, default=null
     * @param alert.level=null {string} - use: error | success | warning | info, default=null
     */
    setAlert(alert = {text: null, level: null}) {
        this.setState({alert: alert, open: true});
    }

    close() {
        this.setState({open: false});
    }

    checkAlert(alert) {
        switch (alert.level) {
            case 'success':
                break;
            case 'info':
                break;
            case 'warning':
                break;
            case 'error':
                break;
        }
    }

    render() {
        return (
            <AlertContext.Provider value={{...this.state}}>
                {this.props.children}
            </AlertContext.Provider>
        );
    }
}


export const withAlertContext = Component => (
    props => (
        <AlertContext.Consumer>
            {context => <Component alertContext={context} {...props} />}
        </AlertContext.Consumer>
    ));