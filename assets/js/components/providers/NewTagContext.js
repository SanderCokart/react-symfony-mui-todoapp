import React, {createContext} from 'react';
import {withAlertContext} from './AlertContext';
import CloneArray from '../../functions/CloneArray';
import axios from 'axios';

export const NewTagContext = createContext();

class NewTagContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:       [],
            processing: false,
            // read:         this.read.bind(this),
            create:     this.create.bind(this),
            // delete:       this.delete.bind(this),
            // update:       this.update.bind(this),
            // handleChange: this.handleChange.bind(this),
            loadIcon:   {
                create: false,
                update: false,
                read:   false,
                delete: false,
            },
        };
        this.create({name: 'bla'});
    }

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
        return CloneArray(this.state.tags);
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
        // PREPARE START
        const INITIAL_TAGS = this.prepare();
        const RESET = () => this.setState({tags: INITIAL_TAGS, processing: false});
        // PREPARE END

        if (INITIAL_TAGS)
            try {
                // CLIENT OPTIMIZATION START
                const NEW_TAG_FROM_CLIENT_WITH_ID = {...createdTag, id: this.findHighestId()};
                this.setState({tags: [this.state.tags.concat(NEW_TAG_FROM_CLIENT_WITH_ID)], processing: false});
                // CLIENT OPTIMIZATION END

                // REQUEST START
                const r = await axios.post('/api/tag/create', NEW_TAG_FROM_CLIENT_WITH_ID);
                const {ALERT, tag: NEW_TAG_FROM_SERVER} = r.data;
                // REQUEST END

                // PROCESS ALERT
                this.props.alertContext.setAlert(ALERT);

                // SERVER SIDE ERROR CATCHER START
                if (ALERT.level !== 'sucesss') {
                    RESET();
                    return;
                }
                // SERVER SIDE ERROR CATCHER END

                // CHECK IF SERVER DATA MATCHES CLIENT DATA START
                if (NEW_TAG_FROM_SERVER.id !== NEW_TAG_FROM_CLIENT_WITH_ID.id) {
                    const TAGS = CloneArray(this.state.tags);
                    let tag = TAGS.find(tag => tag.id === NEW_TAG_FROM_CLIENT_WITH_ID.id);
                    tag.id = NEW_TAG_FROM_SERVER.id;
                    this.setState({tags: TAGS, isLoading: false});
                } else {
                    this.setState({isLoading: false});
                }
                // CHECK IF SERVER DATA MATCHES CLIENT DATA END

            } catch (e) {

            }
    }
}

export default withAlertContext(NewTagContextProvider);