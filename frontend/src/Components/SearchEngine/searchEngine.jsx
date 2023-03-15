import React, { useState } from 'react';
import './searchEngine.css'
import db from '../../Database/db'
import Results from '../Results/results';

const SearchEngine = () => {
  const [query, setQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [previousSearches, setPreviousSearches] = useState([])
  const [results, setResults] = useState([]);
  const [dbData, setdbData] = useState(db);
  const [commonSearches, setCommonSearches] = useState({});

  const handleInputChange = (e) => {
    const value = e.target.value;
    let filteredResults = [];

    setQuery(value);
    if (value.length > 0) {
      // filter the database based on the query

      if (previousSearches.length !== 0) {
        filteredResults = previousSearches.filter((item) =>
          item.title.toLowerCase().startsWith(value.toLowerCase())
        )
      }

      const dbFilteredResults = dbData.filter((item) =>
        item.title.toLowerCase().startsWith(value.toLowerCase())
      );

      filteredResults = [...filteredResults, ...dbFilteredResults]

      // show the filtered results and enable autocompletion
      setShowOptions(true);
      setResults(filteredResults);
    } else {
      // hide the results if the query is empty
      setShowOptions(false);
      setResults([]);
    }
  };

  const getCommonData = (result) => {
    let startTime = Date.now();

    const newArr = db.filter(item => {
      const chunk = item.title.split(' '); // array with separate words from title property
      return chunk.some(word => result.title.includes(word));
    });

    const elapsedTime = Date.now() - startTime;
    return { newArr, elapsedTime };
  }

  const handleResultClick = (result) => {
    //When a search is clicked i get all common titles from the db and show them
    setCommonSearches(getCommonData(result));

    //Checks if the clicked item is already in array previousSearches
    let isAlreadyInPrevSearch = previousSearches.some(obj => obj.title === result.title);
    if (!isAlreadyInPrevSearch) {
      //If it is not we delete the certain item from the dbData and adding it to previousSearch
      setPreviousSearches((prev) => ([...prev, { ...result, selected: true }]));
      const idToRemove = result.id;
      const newDB = dbData.filter(obj => obj.id !== idToRemove);
      setdbData(newDB)
    }

    setShowOptions(false);
    setShowResults(true);
    setQuery(result.title);
  };

  const handleBlur = () => {
    // hide the results on blur
    setTimeout(() => {
      setShowOptions(false);
    }, 100)

  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const newArrayPreviousSearches = previousSearches.filter((obj) => {
      return obj.id !== id
    })
    const removedObject = previousSearches.find(obj => obj.id === id)
    removedObject.selected = false;

    setPreviousSearches(newArrayPreviousSearches);
    setdbData(prev => [...prev, removedObject])
  }

  const handleFocus = () => {
    // show the results on focus if there are any in memory
    if (results.length === 0) {
      setResults(previousSearches);
    }

    setShowOptions(true);
  };

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center '>
        <div className='col-12 col-lg-4'>
          <div style={{ position: 'relative' }}>
          <i className="bi bi-search icon"></i>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus
            />
            <i class="bi bi-mic icon-mic"></i>
            {showOptions && (
              <ul>
                {results.slice(0, 10).map((result) => (

                  <li
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                  >
                    <i className="bi bi-search"></i>
                    <span style={result.selected ? { marginLeft: '10px', color: 'red' } : { marginLeft: '10px' }}>{result.title}</span>
                    {result.selected && <span className='removeButton' onClick={(e) => { handleDelete(e, result.id) }}><i className="bi bi-x"></i></span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {showResults ? <Results data={commonSearches.newArr} timeElapsed={commonSearches.timeElapsed} /> : ''}

    </div>
  );
};

export default SearchEngine;