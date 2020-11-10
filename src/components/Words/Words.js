import React from 'react';
import './Words.css';

function Words(props) {
    console.log(props);
    return (
        <li>
            <h4 className="list-item-word">{props.word.original}</h4>
            <div>
                <span className='correct'>Correct: {props.word.correct_count} | </span>
                <span className='incorrect'>Incorrect: {props.word.incorrect_count}</span>
            </div>
        </li>
    )
}

export default Words;