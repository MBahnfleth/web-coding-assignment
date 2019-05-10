import React from 'react';
import axios from 'axios';
import "../index.css";
import { Container, Row, Col } from 'reactstrap';
import CharacterList from './CharacterList';
import API_KEY from './../config/apiKey';

export default class ComicSingle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: [],
            padding: [false, false, false, false, false],
            comic: '',
            check: false
        };
        
        this.returnData = this.returnData.bind(this);
    }

    
    // Callback function
    returnData (resData, sorted) {
        if(sorted) {
           this.setState({characters: resData});
        } else {
            this.props.changeDisplayData(resData);
        }
    }
    
    componentDidMount() {
        const comicsURI = this.props.displayData[5].item.characters.collectionURI;
        const requestURL = comicsURI + '?' + API_KEY;       
        
        axios.get(requestURL).then(res => {
            const temp = this.state.padding.concat(res.data.data.results);
            
            this.setState({characters: temp, comic: this.props.displayData[5].item.title});
        });
    }
    
    // I wanted to try a better way to consolidate these two almost identical functions, but time constraints
    // Both take a character and get its comic data from Marvel
    componentDidUpdate(prevProps, prevState) {
        const comicsURI = this.props.displayData[5].item.characters.collectionURI;
        const requestURL = comicsURI + '?' + API_KEY;
        
        axios.get(requestURL).then(res => {
            const temp = this.state.padding.concat(res.data.data.results);
            // Prevents infinite loop
            if (!this.state.check) {
                this.setState({characters: temp, check: true});
            }
        });
    }
    
    render() {
        const imageSrc = this.props.displayData[5].item.thumbnail.path + "." + this.props.displayData[5].item.thumbnail.extension;

        const renderPortrait = (
            <div>
                <h5>Comic: {this.state.comic}</h5>
                <img src={imageSrc} alt="Comic Portrait" width="400" height="600" onClick={this.getComics}></img>
            </div>
        );

        return (
            <Container>
                <Row>
                    <Col className="portrait">
                        {renderPortrait}
                    </Col>
                    <Col xs="8">
                        <CharacterList displayData={this.state.characters} changeDisplayData={this.returnData} doRender={true}/>
                    </Col>
                </Row>
            </Container>
        );
    }
}