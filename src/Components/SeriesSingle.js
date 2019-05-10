import React from 'react';
import axios from 'axios';
import "../index.css";
import { Container, Row, Col } from 'reactstrap';
import ComicList from './ComicList';
import API_KEY from './../config/apiKey';

export default class SingleSeries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comics: [],
            padding: [false, false, false, false, false],
            series: ''
        };
        
        this.returnData = this.returnData.bind(this);
    }
    
    // Callback function
    returnData (resData, sorted) {
        if(sorted) {
           this.setState({comics: resData});
        } else {
            this.props.changeDisplayData(resData);
        }
    }
    
    componentDidMount() {
        const comicsURI = this.props.displayData[5].item.comics.collectionURI;
        const requestURL = comicsURI + '?' + API_KEY;       
        
        axios.get(requestURL).then(res => {
            const temp = this.state.padding.concat(res.data.data.results);
            
            this.setState({comics: temp, series: this.props.displayData[5].item.title});
        });
    }
    
    // I wanted to try a better way to consolidate these two almost identical functions, but time constraints.
    // Both take a character and get its comic data from Marvel
    componentDidUpdate(prevProps) {        
        const comicsURI = this.props.displayData[5].item.comics.collectionURI;
        const requestURL = comicsURI + '?' + API_KEY;
        
        // Prevents infinite loop
        if(prevProps.displayData[5].item.name !== this.props.displayData[5].item.name) {
            axios.get(requestURL).then(res => {
                const temp = this.state.padding.concat(res.data.data.results);
                
                this.setState({comics: temp, series: this.props.displayData[5].item.name});
            });
        }
    }
    
    render() {
        const imageSrc = this.props.displayData[5].item.thumbnail.path + "." + this.props.displayData[5].item.thumbnail.extension;

        const renderPortrait = (
            <div>
                <h5>Series: {this.state.series}</h5>
                <img src={imageSrc} alt="Series Portrait" width="400" height="600"></img>
            </div>
        );

        return (
            <Container>
                <Row>
                    <Col className="portrait">
                        {renderPortrait}
                    </Col>
                    <Col xs="8">
                        <ComicList displayData={this.state.comics} changeDisplayData={this.returnData} doRender={true}/>
                    </Col>
                </Row>
            </Container>
        );
    }
}