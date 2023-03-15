import React from 'react';
import './results.css'

const Results = ({data, timeElapsed}) => {
    return(
        <div className='container'>
                <hr />
                <span>около {data.length} резултата за {timeElapsed? timeElapsed: '0'} сек</span>
                {data.map(el => {
                    return(
                        <div key={el.id} className='row justify-content-center wrapper'>
                            <div className='col-12 col-lg-4'>
                                <span style={{fontSize:'13px'}}>{el.link}</span>
                                <h3 ><a href={el.link}>{el.title}</a></h3>
                                <span>{el.description}</span>
                            </div>
                        </div>
                    )
                })} 
        </div>
    )
}

export default Results;