import React from 'react';
import "../index.css";
import SeriesSingle from './SeriesSingle';

// This component exists because of issues I was having getting this.props data inside CharacterSingle, and this was copied from there.
// I believe I know a way to get rid of it now, but time constraints.
export default class SeriesBuffer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            series: []
        };
        
        this.returnData = this.returnData.bind(this);
    }
    
    // Callback function to App, also passed to the series list
    returnData = (resData) => {
        this.props.changeDisplayData(resData);
    };

    render () {
        if(this.props.doRender){
            return (<SeriesSingle displayData={this.props.displayData} changeDisplayData={this.returnData}/>)
        } else {
            return(<div/>)
        }
    }
}