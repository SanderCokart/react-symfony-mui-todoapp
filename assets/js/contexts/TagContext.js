import React, {createContext} from 'react';
import axios from 'axios';

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

    //create
    /**
     * @param data {object}
     * @param data.name {string}
     */
    async create(data) {
        const newTagWithId = {
            ...data,
            id: this.findHighestId(),
        };
        this.setState({tags: [...this.state.tags, newTagWithId]});

        this.setState({isLoading: true});

        const r = await axios.post('/api/tag/create', data);
        const {tag: newTagFromServer, message} = r.data;

        console.log(message);

        if (message === undefined || message.level === 'error') {
            //remove temporary tag
            const tags = [...this.state.tags].filter(tag => tag.id !== newTagWithId.id);

            this.setState({
                isLoading: false,
                tags:      tags,
                message:   message,
            });
        } else {
            //check if id matches otherwise replace
            if (newTagFromServer.id !== newTagWithId.id) {
                //find and replace id
                const tags = [...this.state.tags];
                let tag = tags.find(tag => tag.id === newTagWithId.id);

                tag.id = newTagFromServer.id;

                this.setState({
                    tags:      tags,
                    isLoading: false,
                });
            } else {
                this.setState({isLoading: false});
            }
        }
    }


    findHighestId(array = this.state.tags) {
        let max = 0;
        for (let i = 0, len = array.length; i < len; i++) {
            if (array[i].id > max) max = array[i].id;
        }
        return max + 1;
    }


    //read
    async read() {
        if (this.state.isLoading) return;

        this.setState({isLoading: true});

        try {
            const r = await axios.get('/api/tag/read');
            this.setState({
                tags:      r.data,
                isLoading: false,
            });
        } catch (e) {
            this.setState({
                errors:    e,
                isLoading: false,
            });
        }
    };

    /**
     *
     * @param data
     * @returns {Promise<void>}
     */
    async update(data) {
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
     * delete
     * @param data {object}
     * @param data.id {number}
     * @param data.name {string}
     */
    async delete(data) {
        try {
            if (this.state.isLoading) return;
            this.setState({isLoading: true});

            const tags = [...this.state.tags];

            const newTags = tags.filter(tag => tag.id !== data.id);

            this.setState({
                tags:      newTags,
                isLoading: false,
            });

            const r = await axios.delete('/api/tag/delete/' + data.id);

            if (r.data.message === undefined || r.data.message.level === 'error') {
                this.setState({
                    tags:      tags,
                    message:   r.data.message,
                    isLoading: false,
                });
            }


        } catch (e) {
            this.setState({
                error:     e,
                isLoading: false,
            });
        }
    }

    /**
     *
     * @param oldTag {object} original tag
     * @param e {object} event
     */
    handleChange(oldTag, e) {
        const tags = [...this.state.tags];

        let tag = tags.find(tag => tag.id === oldTag.id);

        tag.name = e.target.value;

        this.setState({
            tags: tags,
        });
    }

    resetTag(oldTag) {
        const tags = [...this.state.tags];

        let tag = tags.find(tag => tag.id === oldTag.id);

        tag.name = oldTag.name;

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

export default TagContextProvider;