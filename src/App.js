import React, { useState} from 'react';
import './App.css';
import SearchForm from './Components/SearchForm';
import ComicList from './Components/ComicList';
import SeriesList from './Components/SeriesList';
import CharacterBuffer from './Components/CharacterBuffer';
import ComicBuffer from './Components/ComicBuffer';
import SeriesBuffer from './Components/SeriesBuffer';

function App() {
    
    // The first five elements in 'data' are 'render options' which are
    // passed to children so that they can render conditionally.  The rest
    // is data to be displayed
    var [data, setData] = useState([]);
    
    const returnData = (resData) => {
        setData(resData);
    };
    
    return (
        <div className="app">
            Search Marvels API!
            <br/>
            <br/>
            <SearchForm changeDisplayData={returnData}/>
            <hr/>
            <ComicList displayData={data} changeDisplayData={returnData} doRender={data[1]}/>
            <CharacterBuffer displayData={data} changeDisplayData={returnData} doRender={data[0]}/>
            <SeriesList displayData={data} changeDisplayData={returnData} doRender={data[2]}/>
            <ComicBuffer displayData={data} changeDisplayData={returnData} doRender={data[3]}/>
            <SeriesBuffer displayData={data} changeDisplayData={returnData} doRender={data[4]}/>
        </div>
    );
}

export default App;