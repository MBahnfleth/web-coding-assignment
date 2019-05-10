import React from 'react';
import axios from 'axios';
import "../index.css";
import API_KEY from './../config/apiKey';

export default class SearchForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            everything: [],
            renderArray: [{
                char: false,
                list: false,
                series: false,
                comicItem: false,
                seriesItem: false
            }],
            name: '', 
            comic: '', 
            series: ''
        }
        
        this.convertSpaces = this.convertSpaces.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateResults = this.updateResults.bind(this);
        this.validationTest = this.validationTest.bind(this);
    }
    
    convertSpaces(withSpaces) {
        const noSpaces = withSpaces.replace(/ /g, "%20");
        return noSpaces;
    }
    
    // Only one input option can have data at a time, I simplified the requirements for time's sake :(
    // Sets state to reflect the input field with data, clears the other two
    handleChange(event) {
        switch(event.target.name) {
            case 'name':
                this.setState({comic: '', series: ''});
                break;
            case 'comic':
                this.setState({name: '', series: ''});
                break;
            case 'series':
                this.setState({name: '', comic: ''});
                break;
            default:
        }
        this.setState({[event.target.name]: event.target.value});
    }
    
    // When 'Search' button is clicked, find out which input field has data and retrieve that data from Marvel
    handleSubmit(event) {        
        event.preventDefault();
        
        let requestURL = 'https://gateway.marvel.com:443/v1/public/';
        let fixedSearch = '';
        
        // Makes the SingleCharacter component visible
        if (this.state.name !== '') {
            this.state.renderArray[0] = true;
            this.state.renderArray[1] = false;
            this.state.renderArray[2] = false;
            this.state.renderArray[3] = false;
            this.state.renderArray[4] = false;
            fixedSearch = this.convertSpaces(this.state.name);
            requestURL += 'characters?name=' + fixedSearch + '&' + API_KEY;
        }
        
        // Makes the ComicList component visible
        if (this.state.comic !== '') {
            this.state.renderArray[0] = false;
            this.state.renderArray[1] = true;
            this.state.renderArray[2] = false;
            this.state.renderArray[3] = false;
            this.state.renderArray[4] = false;
            fixedSearch = this.convertSpaces(this.state.comic);
            requestURL += 'comics?titleStartsWith=' + fixedSearch + '&' + API_KEY;
        }
        
        // Makes the SeriesList component visible
        if (this.state.series !== '') {
            this.state.renderArray[0] = false;
            this.state.renderArray[1] = false;
            this.state.renderArray[2] = true;
            this.state.renderArray[3] = false;
            this.state.renderArray[4] = false;
            //requestURL = exampleSeriesSearch;
            fixedSearch = this.convertSpaces(this.state.series);
            requestURL += 'series?title=' + fixedSearch + '&' + API_KEY;
        }
   
        // Get the data, set it to state, call upDateResults
        axios.get(requestURL).then(res => {
            this.setState({everything: res.data.data.results});
        }).then(() => {return this.updateResults()});
    }
    
    // Return an array of render options and Marvel data to App, the parent component
    updateResults() {
        const temp = this.state.renderArray.concat(this.state.everything);
        this.props.changeDisplayData(temp);
    }
    
    // Presents helpful text to user, 'Search' button becomes disabled when message = ''
    validationTest() {
        let message = '';
        
        if(this.state.name === '' && this.state.comic === '' && this.state.series === ''){
            message = "Choose one search field";
        }
        
        return message;
    }
    
    render() {
        const message = this.validationTest();
        const isDisabled = message === '' ? false : true;
        
        return (
            <div>
                <form>
                    <input
                        type="text"
                        placeholder={"Character e.g. Thor"}
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange} 
                    />
                    <br/>
                    <input
                        type="text"
                        placeholder="Comic Starts With"
                        name="comic"
                        value={this.state.comic}
                        onChange={this.handleChange} 
                    />
                    <br/>
                    <input
                        type="text"
                        placeholder="Series Starts With"
                        name="series"
                        value={this.state.series}
                        onChange={this.handleChange} 
                    />
                    <br/><br/>
                    <button disabled={isDisabled} className={isDisabled ? "error" : ""} value="Search" onClick={this.handleSubmit}>Search</button>
                    <div className={isDisabled ? "error" : ""}>
                        { message }
                    </div>
                </form>
            </div>
        );
    }
}