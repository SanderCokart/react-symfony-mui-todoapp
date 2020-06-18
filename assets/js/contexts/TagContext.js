import React, {createContext} from 'react';
import axios from 'axios';

export const TagContext = createContext();

class TagContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            isLoading: true,
        };
    }

    async getAll() {
        try {
            const response = await axios.get('api/tag/index');
            this.setState({
                tags: response.data,
                isLoading: false,
            });

        } catch (e) {
            console.error(e);
        }
    }

    componentDidMount() {
        this.getAll();
    }


    render() {
        return (
            <TagContext.Provider value={{...this.state}}>
                {this.props.children}
            </TagContext.Provider>
        );
    }
}

export default TagContextProvider;