import React from 'react';
import "../index.css";
import CharacterSingle from './CharacterSingle';

// This component exists because of issues I was having getting this.props data inside CharacterSingle.
// I believe I know a way to get rid of it now, but time constraints.
export default class CharacterBuffer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comics: []
        };
        
        this.returnData = this.returnData.bind(this);
    }
    
    // Callback function to App, also passed to the comic list
    returnData = (resData) => {
        this.props.changeDisplayData(resData);
    };

    render () {
        if(this.props.doRender){
            return (<CharacterSingle displayData={this.props.displayData} changeDisplayData={this.returnData}/>)
        } else {
            return(<div/>)
        }
    }
}