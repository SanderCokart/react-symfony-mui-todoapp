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
                text:  '',
                level: null,
            },

            read:   this.read.bind(this),
            create: this.create.bind(this),
            delete: this.delete.bind(this),
        };
    }

    //create
    /**
     * @param data {object}
     * @param data.name {string}
     */
    async create(data) {
        this.setState({isLoading: true});
        try {
            const r = await axios.post('/api/tag/create', data);
            const {createdTag, message} = r.data;

            if (message.level === 'error') {
                this.setState({
                    message:   message.text,
                    isLoading: false,
                });
            } else {
                this.setState({
                    tags:      [...this.state.tags, createdTag],
                    isLoading: false,
                });
            }

        } catch (e) {
            this.setState({
                errors:    e,
                isLoading: false,
            });
        }

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

    //update

    /**
     * delete
     * @param data {object}
     * @param data.id {number}
     * @param data.name {string}
     */
    async delete(data) {
        try {
            const r = await axios.delete('/api/tag/delete/' + data.id);
            const newTags = [...this.state.tags].filter(tag => tag.id !== data.id);

            this.setState({
                tags: newTags,
            });

        } catch (e) {
            this.setState({
                error: e,
            });
        }
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