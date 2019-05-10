import React from 'react';
import "../index.css";
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import API_KEY from './../config/apiKey';

export default class CharacterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: ['Portrait', 'Name v'],
            currentPage: 1, 
            itemsPerPage: 7,
            displayData: []
        };
        
        this.changePage = this.changePage.bind(this);
        this.getCharacter = this.getCharacter.bind(this);
        this.sort = this.sort.bind(this);
        this.sortAscending = this.sortAscending.bind(this);
        this.sortDescending = this.sortDescending.bind(this);
    }
    
    // Changes view to different page
    changePage(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }
    
    // Lets the user know Marvel didn't have the data, not that I failed to retrieve it
    checkISBN(isbn) {
        return isbn === '' ? 'ISBN Unavailable' : isbn;
    }
    
    // Format the date properly
    fixDate(date) {
        return date[5] + date[6] + "/" + date[8] + date[9] + "/" + date[0] + date[1] + date[2] + date[3];
    }
    
    // 'label' is the text displayed. Adds either a '^' or a 'v' to one of the labels and returns the data sorted accordingly
    sort(label) {
        // Clean slate
        var labelsTemp = ['Portrait', 'Name'];
        
        // Holds sorted comicdata
        var dataTemp = [];
        
        // Need to re-insert 'render options' because getDerivedStateFromProps removed the first three elements of the area
        // Don't care what data is here
        const renderOptions = [false, true, false, false, false];

        if (label.includes('^')) {
            labelsTemp[1] = 'Name v';
            dataTemp = this.sortAscending();
        } else {
            labelsTemp[1] = 'Name ^';
            dataTemp = this.sortDescending();
        }
        
        // Combine render options and comic list data
        const everything = renderOptions.concat(dataTemp);
        // Update state with new comic data and return user to first page of list
        this.setState({displayData: dataTemp, currentPage: 1, labels: labelsTemp});
        // Return data to parent, just in case they care
        this.props.changeDisplayData(everything, true);
    }
    
    // Generic sort function, opposite sorting style from sortDescending
    // The 'if' statement figures out which button was pressed to get here
    sortAscending(index) {
        const temp = [...this.state.displayData];
        
        temp.sort((a, b) => {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        });
        
        return temp;
    }
    
    // Generic sort function, opposite sorting style from sortAscending
    // The 'switch' statement figures out which button was pressed to get here
    sortDescending(index, stringType) {
        const temp = [...this.state.displayData];

        temp.sort((a, b) => {
            if(a.name < b.name) { return 1; }
            if(a.name > b.name) { return -1; }
            return 0;
        });
        
        return temp;
    }
    
    // 'Render options' are needed from the App component, but this function seperates them from the actual comic data to be displayed
    static getDerivedStateFromProps(nextProps, prevState){
        var tempArray = [...nextProps.displayData];
        const tempArray2 = tempArray.splice(0,5);
        
        // Comic data is now in state, render options remain in props
        return {displayData: tempArray};
    }
    
    //this.getCharacters = this.getCharacters.bind(this);
    //onClick={this.getCharacters}
    getCharacter(item) {
        const stripItem = item.item;
        const renderOptions = [true, false, false, false, false];
        const requestURL = 'https://gateway.marvel.com:443/v1/public/characters?name=' + stripItem.name + '&' + API_KEY;
        
        let characters = [];
        
        axios.get(requestURL).then(res => {
            characters = renderOptions.concat(res.data.data.results);
        }).then(() => {return this.props.changeDisplayData(characters)});
    }
    
    render() {
        if (this.props.doRender) {
            // Set up pagination variables
            // itemsPerPage should be changed in the state for different list sizes
            const { currentPage, itemsPerPage } = this.state;
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentItems = this.state.displayData.slice(indexOfFirstItem, indexOfLastItem);

            // Renders a list of comic data one item at a time
            const renderItems = currentItems.map((item, index) => {            
                const imageSrc = item.thumbnail.path + "." + item.thumbnail.extension;

                return (
                    <div><Row>
                        <Col xs="1" className="image"><img src={imageSrc} alt={item.description}  width="60" height="80" onClick={() => {this.getCharacter({item})}}></img></Col>    
                        <Col xs="4">{item.name}</Col>
                    </Row>
                    <br/></div>
                );
            });

            // Creates array used to fill buttons
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(this.state.displayData.length / itemsPerPage); i++) {
                pageNumbers.push(i);
            }

            // Renders those buttons, allowing user to jump between page data
            const renderPageNumbers = pageNumbers.map(number => {
                return (
                    <button
                        key={number}
                        id={number}
                        onClick={this.changePage}
                        className={number === currentPage ? "current-page" : ""}
                    >
                    {number}
                    </button>
                );
            });

            // Renders the legends at the top of each column of comic data
            // Three are buttons that allow the user to filter by their type.  '^' means highest value or most recent data at the top
            const renderLabels = (
                <Row>
                    <Col xs="1">{this.state.labels[0]}</Col>   
                    <Col xs="4"><button type="button" className="link-button" onClick={() => {this.sort(this.state.labels[1])}}>{this.state.labels[1]}</button></Col> 
                </Row>
            )


            return (
                <div>
                    <Container>
                        {renderLabels}
                    </Container>
                    <Container className="list">
                        {renderItems}
                    </Container>
                    <Container id="page-numbers">
                        {renderPageNumbers}
                    </Container>
                </div>
            );
        } else {
            return (<div/>);
        }
    }
}