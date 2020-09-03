//REACT
import React, {createContext} from 'react';
//AXIOS
import axios from 'axios';
//CONTEXTS
import {AlertContext} from './AlertContext';

export const TagContext = createContext();

class TagContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:      [],
            isLoading: false,
            message:   {
                text:  null,
                level: null,
            },

            read:         this.read.bind(this),
            create:       this.create.bind(this),
            delete:       this.delete.bind(this),
            update:       this.update.bind(this),
            handleChange: this.handleChange.bind(this),
            resetTag:     this.resetTag.bind(this),
        };
    }

    //TODO check the resets for when delete and update go wrong. Check the errors as well.

    /**
     * Creates a new tag object with a temporary id, puts it in the state, submits the data, check to see if the id
     * matches, if it doesn't match replace it
     * @param {object} tag - tag
     * @param {string} tag.name - name of the tag
     */
    async create(tag) {
        //PREPARATION START
        if (this.state.isLoading) return;
        this.setState({isLoading: true});
        const INITIAL_TAGS = [...this.state.tags];
        //PREPARATION END

        const RESET = () => this.setState({tags: INITIAL_TAGS, isLoading: false});

        try {
            //TEMPORARY ID START
            const NEW_TAG_FROM_CLIENT_WITH_ID = {...tag, id: this.findHighestId()};
            this.setState({tags: [...this.state.tags.concat(NEW_TAG_FROM_CLIENT_WITH_ID)], isLoading: true});
            //TEMPORARY ID END

            //REQUEST START
            const r = await axios.post('/api/tag/create', tag);
            const {ALERT, tag: NEW_TAG_FROM_SERVER} = r.data;
            this.context.setAlert(ALERT);
            //REQUEST END

            //SERVER SIDE ERROR START
            if (ALERT.level !== 'success') {
                RESET();
                return;
            }
            //SERVER SIDE ERROR END

            //CHECK IF SERVER DATA MATCHES CLIENT DATA START
            if (NEW_TAG_FROM_SERVER.id !== NEW_TAG_FROM_CLIENT_WITH_ID.id) {
                const TAGS = [...this.state.tags];
                let tag = TAGS.find(tag => tag.id === NEW_TAG_FROM_CLIENT_WITH_ID.id);
                tag.id = NEW_TAG_FROM_SERVER.id;
                this.setState({tags: TAGS, isLoading: false});
            } else {
                this.setState({isLoading: false});
            }
            //CHECK IF SERVER DATA MATCHES CLIENT DATA END
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
            RESET();
            //CLIENT SIDE ERROR END
        }
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
     * Gets all tags from the database
     * @returns {Promise<void>}
     */
    async read() {
        //PREPARATION START
        if (this.state.isLoading) return;
        this.setState({isLoading: true});
        //PREPARATION END

        try {

            //REQUEST START
            const r = await axios.get('/api/tag/read');
            //REQUEST END

            //HANDLE REQUEST START
            this.setState({tags: r.data, isLoading: false});
            //HANDLE REQUEST END

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
            this.setState({isLoading: false, tags: []});
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
        //PREPARATION START
        if (this.state.isLoading) return;
        this.setState({isLoading: true});
        const INITIAL_TAGS = [...this.state.tags];
        //PREPARATION END

        try {
            //UPDATE CLIENT START
            let newTag = [...INITIAL_TAGS].find(tag => tag.id === originalTag.id);

            if (newTag.name === originalTag.name) {
                this.context.setAlert({text: 'There was no change to the tag', level: 'info'});
                this.setState({isLoading: false});
                return;
            }
            //UPDATE CLIENT END

            //REQUEST START
            const r = await axios.put('/api/tag/update/' + originalTag.id, newTag);
            const {alert} = r.data;
            this.context.setAlert(alert);
            //REQUEST END

            //SERVER SIDE ERROR START
            if (alert.level !== 'success') {
                this.setState({tags: INITIAL_TAGS, isLoading: false});
            } else this.setState({isLoading: false});
            //SERVER SIDE ERROR END


        } catch (e) {
            //CLIENT SIDE ERROR START
            this.context.setAlert({
                text:  ['Something went wrong while trying to update the tag.', e],
                level: 'error',
            });
            this.setState({isLoading: false});
            //CLIENT SIDE ERROR END
        }
    }

    /**
     * Removes a tag from the state, in case it could not be removed from the database: undo
     * @param {object} tag
     * @param {number} tag.id
     * @param {string} tag.name
     */
    async delete(tag) {
        //PREPARATION START
        if (this.state.isLoading) return;
        await this.setState({isLoading: true});
        const initialTags = [...this.state.tags];
        //PREPARATION END

        try {
            //UPDATE CLIENT START
            const filteredTags = [...initialTags].filter(initialTag => initialTag.id !== tag.id);
            this.setState({tags: filteredTags});
            //UPDATE CLIENT END

            //REQUEST START
            const r = await axios.delete('/api/tag/delete/' + tag.id);
            const {alert} = r.data;
            this.context.setAlert(alert);
            //REQUEST END

            //SERVER SIDE ERROR START
            if (alert.level !== 'success') {
                this.setState({tags: initialTags, isLoading: false});
            } else this.setState({isLoading: false});
            //SERVER SIDE ERROR END

        } catch (e) {
            //CLIENT SIDE ERROR START
            this.context.setAlert({
                text:  ['Something went wrong while trying to delete the tag.', e],
                level: 'error',
            });
            this.setState({isLoading: false, tags: initialTags});
            //CLIENT SIDE ERROR END
        }
    }

    /**
     *EDIT TAG HANDLER
     * @param {object} oldTag - original tag
     * @param {object} e - event
     */
    handleChange(oldTag, e) {
        //copy state
        const tags = [...this.state.tags];
        //find tag
        let tag = tags.find(tag => tag.id === oldTag.id);
        //replace name with event target value
        tag.name = e.target.value;
        //overwrite the state
        this.setState({
            tags: tags,
        });
    }

    /**
     * UNDO FUNCTION
     * copy tags from state
     * find the tag in the copy that matches the oldTag id that came from the state of the table once the user pressed
     * on the edit button
     * overwrite the name of the tag
     * resubmit the tags
     * @param {object} oldTag
     * @param {number} oldTag.id
     * @param {string} oldTag.name
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

    render() {
        return (
            <TagContext.Provider value={{
                ...this.state,
            }}>
                {this.props.children}
            </TagContext.Provider>
        );
    }
}


TagContextProvider.contextType = AlertContext;
export default TagContextProvider;