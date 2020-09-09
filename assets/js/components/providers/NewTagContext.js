import React, {createContext} from 'react';
import {withAlertContext} from './AlertContext';
import axios from 'axios';

export const NewTagContext = createContext();

class NewTagContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:       null,
            processing: false,
            read:       this.read.bind(this),
            create:     this.create.bind(this),
            // delete:       this.delete.bind(this),
            // update:       this.update.bind(this),
            // handleChange: this.handleChange.bind(this),
        };
    };


    render() {
        return (
            <NewTagContext.Provider value={{
                ...this.state,
            }}>
                {this.props.children}
            </NewTagContext.Provider>
        );
    }

    /**
     * if processing return false otherwise return cloned array of tags and set the processing state to true
     * @returns {boolean|*[]}
     */
    prepare() {
        if (this.state.processing) return false;
        this.setState({processing: true});
        return this.state.tags.slice();
    }

    /**
     * Takes an array of tags and finds the highest number of the id's, adds +1 to it and returns that
     * @param {[]} [array=this.state.tags] - array of tags
     * @returns {number} - generated id
     */
    findHighestId(array = this.state.tags) {
        let max = 0;
        for (let i = 0, len = array.length; i < len; i++) {
            if (array[i].id > max) max = array[i].id;
        }
        return max + 1;
    }

    /**
     * @param {object} createdTag - a new tag created by the user
     * @param {string} createdTag.name - name of the created tag
     */
    async create(createdTag) {
        // PREPARATION START
        const INITIAL_TAGS = this.prepare();
        const RESET = () => this.setState(
            {tags: INITIAL_TAGS, processing: false},
        );
        const {alertContext} = this.props;
        // PREPARATION END

        if (INITIAL_TAGS)
            try {
                // CLIENT OPTIMIZATION START
                const NEW_TAG_FROM_CLIENT_WITH_ID = {...createdTag, id: this.findHighestId()};
                this.setState({tags: this.state.tags.concat(NEW_TAG_FROM_CLIENT_WITH_ID)});
                // CLIENT OPTIMIZATION END

                // REQUEST START
                const r = await axios.post('/api/tag/create', NEW_TAG_FROM_CLIENT_WITH_ID);
                const {alert: ALERT, tag: NEW_TAG_FROM_SERVER} = r.data;
                // REQUEST END

                // PROCESS ALERT
                alertContext.setAlert(ALERT);

                // SERVER SIDE ERROR CATCHER START
                if (ALERT.level !== 'success') {
                    RESET();
                    return false;
                }
                // SERVER SIDE ERROR CATCHER END

                // IF SERVER SIDE IS SUCCESSFUL

                // CHECK IF SERVER DATA MATCHES CLIENT DATA START
                if (NEW_TAG_FROM_SERVER.id !== NEW_TAG_FROM_CLIENT_WITH_ID.id) {
                    // CORRECT THE DATA
                    this.setState((state) => {
                        const TAGS = state.tags.slice();
                        const TAG = TAGS.find(tag => tag.id === NEW_TAG_FROM_CLIENT_WITH_ID.id);
                        TAG.id = NEW_TAG_FROM_SERVER.id;
                        return {tags: TAGS, processing: false};
                    });
                }
                // CHECK IF SERVER DATA MATCHES CLIENT DATA END

                else {
                    this.setState({processing: false});
                }

            } catch (e) {
                alertContext.setAlert({
                    text:  [
                        e,
                        'Something went wrong while trying to create a tag.',
                        'Check your internet connection to make sure you didn\'t lose it, alternatively our servers may be down for maintenance.',
                    ],
                    level: 'error',
                });
                RESET();
            }
    }

    /**
     * Gets all tags from the database
     * @returns {Promise<void>}
     */
    async read() {
        // PREPARATION START
        this.prepare();
        // PREPARATION END

        try {
            //REQUEST
            const r = await axios.get('/api/tag/read');
            //HANDLE REQUEST
            this.setState({tags: r.data});
        } catch (e) {
            //CLIENT SIDE ERROR START
            this.context.setAlert({
                text:  [
                    e,
                    'Something went wrong while trying to create a tag.',
                    'Check your internet connection to make sure you didn\'t lose it, alternatively our servers may be down for maintenance.',
                ],
                level: 'error',
            });
            this.setState({tags: []});
            //CLIENT SIDE ERROR END
        }
    }


}

export default withAlertContext(NewTagContextProvider);