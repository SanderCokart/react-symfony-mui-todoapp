import React, {createContext} from 'react';
import axios                  from 'axios';

export const UserContext = createContext();

class UserContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user:    null,
            message: {text: undefined, severity: undefined},
        };
    }

    componentDidMount() {
        this.checkLogin();
    }

    checkLogin() {
        try {
            const todoAppUser = document.cookie.split('; ')
                .find(row => row.startsWith('TodoAppUser'))
                .split('=')[1];
            if (todoAppUser) {
                this.setState({user: todoAppUser}, () => {
                    console.log(this.state.user);
                });
            } else {
                document.cookie = 'TodoAppUser=null';
            }
        } catch (e) {
            document.cookie = 'TodoAppUser=null';
        }

    }

    /**
     * @param {Object} data
     * @param {string} data.email
     * @param {string} data.password
     */
    async login(data) {
        try {
            const r = await axios.post('/api/login', data, {timeout: 3000});
            this.setState({
                user:    r.data.user,
                message: {
                    text:     'You have successfully logged as ' + r.data.user.username + '! You will be redirected to the homepage shortly...',
                    severity: 'success',
                },
            });
            document.cookie = 'TodoAppUser=' + r.data.user;
        } catch (e) {
            if (e.message.includes('timeout')) {
                this.setState({message: {text: 'The request to the server has timed out.', severity: 'error'}});
            } else {
                this.setState({
                    message: {
                        text:     e.message + ' Please check if you filled out the form correctly.',
                        severity: 'error',
                    },
                });
            }
        }
    }

    render() {
        return (
            <UserContext.Provider value={{
                ...this.state,
                login: this.login.bind(this),
            }}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserContextProvider;