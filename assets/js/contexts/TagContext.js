import React, {createContext} from 'react';
import axios from 'axios';
import {AlertContext} from './AlertContext';

export const TagContext = createContext();

class TagContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:      null,
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

    /**
     * CREATE
     * creates a new tag object with a temporary id, puts it in the state, submits the data, check to see if the id
     * matches, if it doesn't match replace it
     * @param {object} data
     * @param {string} data.name - name of the tag
     */
    async create(data) {
        //store initial tags in case of undo
        const initialTags = [...this.state.tags];

        //create tag object with client generated id for mapping
        const newTagWithId = {
            ...data,
            id: this.findHighestId(),
        };
        //add the tag to the tags array in the state and set loading to true
        this.setState({tags: [...initialTags, newTagWithId], isLoading: true});

        //await response and submit the data param
        const r = await axios.post('/api/tag/create', data);
        //destructure message as alert and tag as newTagFromServer
        const {message: alert, tag: newTagFromServer} = r.data;

        //if the alert level does NOT compare to 'success'
        if (alert.level !== 'success') {
            //set the alert in the AlertContext
            //set loading to false and resubmit the initialTags
            this.setState({
                isLoading: false,
                tags:      initialTags,
            });

            this.context.setAlert(alert);
        } else {
            //check if id matches otherwise replace
            if (newTagFromServer.id !== newTagWithId.id) {

                //find and replace id
                const tags = [...this.state.tags];
                let tag = tags.find(tag => tag.id === newTagWithId.id);
                tag.id = newTagFromServer.id;
                //resubmit the tags with the corrected id to the state and set loading to false
                this.setState({
                    tags:      tags,
                    isLoading: false,
                });
            }
            //if the id does match just set the loading to false
            else {
                //set loading to false
                this.setState({isLoading: false});
            }
            //set the alert in the AlertContext
            this.context.setAlert(alert);
        }
    }


    /**
     *
     * @param {[]} [array=this.state.tags] - array of tags
     * @returns {number} - new id
     */
    findHighestId(array = this.state.tags) {
        let max = 0;
        for (let i = 0, len = array.length; i < len; i++) {
            if (array[i].id > max) max = array[i].id;
        }
        return max + 1;
    }


    /**
     * read
     * gets all tags from the database
     * @returns {Promise<void>}
     */
    async read() {
        //abort if already loading
        if (this.state.isLoading) return;
        //set loading to true and try:
        this.setState({isLoading: true});
        try {
            //await response and set the state
            const r = await axios.get('/api/tag/read', {timeout: 10000});
            this.setState({
                tags:      r.data,
                isLoading: false,
            });
        } catch (e) {
            //on timeout
            this.context.setAlert({
                text:  ['Something went wrong while trying to reach the database.', e],
                level: 'error',
            });

            //set state of tags to empty array to avoid more reads and set loading to false
            this.setState({
                tags:      [],
                isLoading: false,
            });
        }
    };

    /**
     * UPDATE
     * updates a tag by replacing the name key of the tag object
     * @param {object} data
     * @param {number} data.id
     * @param {string} data.name
     * @returns {Promise<void>}
     */
    async update(data) {
        //abort if already loading
        if (this.state.isLoading) return;
        this.setState({isLoading: true});
        try {
            const tags = [...this.state.tags];
            let tag = tags.find(tag => tag.id === data.id);

            if (tag.name !== data.name) {
                if (this.state.isLoading) return;
                this.setState({isLoading: true});
                const r = await axios.put('/api/tag/update/' + tag.id, tag);
                this.setState({isLoading: false});
            }

        } catch (e) {
            this.setState({
                error:     e,
                isLoading: false,
            });
        }
    }

    /**
     * DELETE
     * removes a tag from the state, in case it could not be removed from the database: undo
     * @param data {object}
     * @param data.id {number}
     * @param data.name {string}
     */
    async delete(data) {
        try {
            //abort if loading
            if (this.state.isLoading) return;
            //set loading to true, copy the state and filter out the tag that needs to be removed, then replace the
            // state
            this.setState({isLoading: true});
            const tags = [...this.state.tags];
            const newTags = tags.filter(tag => tag.id !== data.id);
            this.setState({
                tags:      newTags,
                isLoading: false,
            });

            //await response and see if there is an alert attached to the response data or if the level of the alert
            // was anything but success
            const r = await axios.delete('/api/tag/delete/' + data.id, {timeout: 10000});

            if (r.data.message === undefined || r.data.alert.level !== 'success') {
                this.setState({
                    tags:      tags,
                    alert:     r.data.alert,
                    isLoading: false,
                });
            }


        } catch (e) {
            this.setState({
                alert:     e,
                isLoading: false,
            });
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
        const tags = [...this.state.tags];
        //find tag in copy
        let tag = tags.find(tag => tag.id === oldTag.id);
        //replace new name to the old name
        tag.name = oldTag.name;
        //overwrite the state
        this.setState({
            tags: tags,
        });
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