import React, {createContext} from 'react';
import {withAlertContext} from './AlertContext';
import axios from 'axios';

export const NewTagContext = createContext();

class NewTagContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:         null,
            processing:   false,
            read:         this.read.bind(this),
            create:       this.create.bind(this),
            delete:       this.delete.bind(this),
            update:       this.update.bind(this),
            resetTag:     this.resetTag.bind(this),
            handleChange: this.handleChange.bind(this),
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
     * EDIT TAG HANDLER
     * @param {object} oldTag - original tag
     * @param {object} e - event
     */
    handleChange(oldTag, e) {
        // find and replace
        const TAGS_COPY = this.state.tags.slice();
        const TAG_COPY = TAGS_COPY.find(tag => tag.id === oldTag.id);
        TAG_COPY.name = e.target.value;
        this.setState({tags: TAGS_COPY});
    }

    /**
     * TODO work out a better solution
     * @param oldTag
     */
    resetTag(oldTag) {
        //copy state
        // const tags = [...this.state.tags];
        //find tag in copy
        let tag = this.state.tags.find(tag => tag.id === oldTag.id);
        //replace new name to the old name
        tag.name = oldTag.name;
        //overwrite the state
        // this.setState({
        //     tags: tags,
        // });
    }

    /**
     * @param {object} createdTag - a new tag created by the user
     * @param {string} createdTag.name - name of the created tag
     */
    async create(createdTag) {
        // INITIATE
        if (this.state.processing) return;
        else this.setState({processing: true});

        // PREPARATION START
        const INITIAL_TAGS = this.state.tags.slice();
        const RESET = () => this.setState({tags: INITIAL_TAGS, processing: false});
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
                    return;
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
                        'Check your internet connection to make sure you didn\'t lose it or perhaps our servers may be down for maintenance.',
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
        // INITIATE
        if (this.state.processing) return;
        else this.setState({processing: true});

        // PREPARATION START
        const {alertContext} = this.props;
        // PREPARATION END

        try {
            //REQUEST
            const r = await axios.get('/api/tag/read');
            //HANDLE REQUEST
            this.setState({tags: r.data, processing: false});
        } catch (e) {
            //CLIENT SIDE ERROR START
            alertContext.setAlert({
                text:  [
                    e,
                    'Something went wrong while trying to get the tags from the database.',
                    'Check your internet connection to make sure you didn\'t lose it or perhaps our servers may be down for maintenance.',
                ],
                level: 'error',
            });
            this.setState({tags: [], processing: false});
            //CLIENT SIDE ERROR END
        }
    }

    /**
     * Updates a tag by replacing the name key of the tag object
     * @param {object} originalTag
     * @param {number} originalTag.id
     * @param {string} originalTag.name
     * @returns {Promise<void>}
     */
    async update(originalTag) {
        // PREPARATION START
        const INITIAL_TAGS = this.state.tags.slice();
        const RESET = () => {this.setState({tags: INITIAL_TAGS, processing: false});};
        const {alertContext} = this.props;
        // PREPARATION END

        try {
            // UPDATE CLIENT START
            const TAG_COPY = INITIAL_TAGS.slice().find(tag => tag.id === originalTag.id);
            if (TAG_COPY.name === originalTag.name) {
                alertContext.setAlert({text: 'There was no change to the tag.', level: 'info'});
                this.setState({processing: false});
                return;
            }
            // UPDATE CLIENT END

            // REQUEST START
            const r = await axios.put('/api/tag/update/' + originalTag.id, TAG_COPY);
            const {alert: ALERT} = r.data;
            alertContext.setAlert(ALERT);
            // REQUEST END

            // SERVER SIDE ERROR START
            if (ALERT.level !== 'success')
                RESET();
            else
                this.setState({processing: false});
            // SERVER SIDE ERROR END
        } catch (e) {
            // CLIENT SIDE ERROR START
            alertContext.setAlert({
                text:  [
                    e,
                    'Something went wrong while trying to update the tag.',
                    'Check your internet connection to make sure you didn\'t lose it or perhaps our servers may be down for maintenance.',
                ],
                level: 'error',
            });
            RESET();
            // CLIENT SIDE ERROR END
        }
    }

    /**
     * Removes a tag from the state, in case it could not be removed from the database: undo
     * @param {object} tag
     * @param {number} tag.id
     * @param {string} tag.name
     */
    async delete(tag) {
        // INITIATE
        if (this.state.processing) return;
        else this.setState({processing: true});

        //PREPARATION START
        const INITIAL_TAGS = this.state.tags.slice();
        const RESET = () => {this.setState({tags: INITIAL_TAGS, processing: false});};
        const {alertContext} = this.props;
        //PREPARATION END

        try {
            // DELETE ON CLIENT SIDE START
            const FILTERED_TAGS = INITIAL_TAGS.slice().filter(initialTag => initialTag.id !== tag.id);
            this.setState({tags: FILTERED_TAGS});
            // DELETE ON CLIENT SIDE END

            // REQUEST START
            const r = await axios.delete('/api/tag/delete/' + tag.id);
            const {alert: ALERT} = r.data;
            // REQUEST END

            // PROCESS ALERT
            alertContext.setAlert(ALERT);

            // SERVER SIDE ERROR START
            if (ALERT.level !== 'success')
                RESET();
            else
                this.setState({processing: false});
            // SERVER SIDE ERROR END
        } catch (e) {
            alertContext.setAlert({
                text:  [
                    e,
                    'Something went wrong while trying to delete the tag.',
                    'Check your internet connection to make sure you didn\'t lose it or perhaps our servers may be down for maintenance.',
                ],
                level: 'error',
            });
            RESET();
        }
    }
}

export default withAlertContext(NewTagContextProvider);