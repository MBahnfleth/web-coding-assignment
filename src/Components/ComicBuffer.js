import React from 'react';
import "../index.css";
import ComicSingle from './ComicSingle';

// This component exists because of issues I was having getting this.props data inside DisplayCharacter.
// which was copied to make this... time constraints
export default class ComicBuffer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comics: [],
            check: false
        };
        
        this.returnData = this.returnData.bind(this);
    }
    
    // Callback function to App
    returnData = (resData) => {
        this.props.changeDisplayData(resData);
    };

    render () {
        if(this.props.doRender){
            return (<ComicSingle displayData={this.props.displayData} changeDisplayData={this.returnData} doRender={true}/>)
        } else {
            return(<div/>)
        }
    }
}