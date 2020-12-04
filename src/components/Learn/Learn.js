import React, { Component } from 'react';
import config from '../../config';
import TokenService from '../../services/token-service';
import UserContext from '../../contexts/UserContext';
import { Input, Label } from '../Form/Form';
import Button from '../Button/Button';
import './Learn.css';

export default class Learn extends Component {
    state = {
        error: null,
        loading: true,
        previousWord: '',
        nextWord: '',
        wordCorrectCount: 0,
        wordIncorrectCount: 0,
        totalScore: 0,
        answer: '',
        isCorrect: null,
        guess: '',
    };

    static contextType = UserContext;

    componentDidMount() {
        return fetch(`${config.API_ENDPOINT}/language/head`, {
            headers: {
                authorization: `bearer ${TokenService.getAuthToken()}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                this.setNextWord(res.nextWord);
                this.setAnswerCount(res.wordCorrectCount, res.wordIncorrectCount);
                this.setCurrentScore(res.totalScore);
            })
            .catch((e) => this.setState({ error: null }));
    }

    setNextWord = (nextWord) => {
        this.setState({
            nextWord,
        });
    };

    setAnswerCount = (wordCorrectCount, wordIncorrectCount) => {
        this.setState({
            wordCorrectCount,
            wordIncorrectCount
        });
    };

    setCurrentScore = (totalScore) => {
        this.setState({
            totalScore,
        });
    };

    handleChange = (event) => {
        this.setState({
            guess: event.target.value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${config.API_ENDPOINT}/language/guess`, {
            method: 'POST',
            headers: {
                authorization: `bearer ${TokenService.getAuthToken()}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                guess: this.state.guess,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                this.setState({
                    previousWord: this.state.nextWord,
                    nextWord: res.nextWord,
                    wordCorrectCount: res.wordCorrectCount,
                    wordIncorrectCount: res.wordIncorrectCount,
                    totalScore: res.totalScore,
                    answer: res.answer,
                    isCorrect: res.isCorrect,
                });
            })
            .catch((res) => {
                this.setState({ error: res.error });
            });
    };

    renderFeedback = () => {
        if (this.state.isCorrect) {
            return (
                <>
                    <h2 className="result-title">That's Fantastic! Great Job!</h2>
                    <p className="results">
                        The correct answer for <b>"{this.state.previousWord}"</b> is{' '}
                        <b>"{this.state.answer}"</b>.
                        <br />
                        You chose <b>"{this.state.guess}"</b>!
                    </p>
                </>
            );
        } else {
            return (
                <>
                    <h2 className="result-title">Oooooh... So Close! But yet, so far...</h2>
                    <p className="results">
                        The correct answer for <b>"{this.state.previousWord}"</b> is{' '}
                        <b>"{this.state.answer}"</b>.
                        <br />
                        You unfortunately chose <b>"{this.state.guess}"</b>.
                    </p>
                </>
            );
        }
    };

    handleNextWord = (event) => {
        event.preventDefault();

        fetch(`${config.API_ENDPOINT}/language/head`, {
            method: 'GET',
            headers: {
                authorization: `bearer ${TokenService.getAuthToken()}`,
                'content-type': 'application/json',
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                this.setState({
                    answer: '',
                    guess: '',
                    isCorrect: null,
                });
            })
            .catch((res) => {
                this.setState({ error: res.error });
            });
    };

    render() {
        const {
            error,
            nextWord,
            wordCorrectCount,
            wordIncorrectCount,
            totalScore,
        } = this.state;
        return (
            <>
                <section className="translate">
                    {!this.state.answer ? (
                        <>
                            <h2>Translate The Following</h2>
                            <span className="next-word">"{nextWord}"</span>
                        </>
                    ) : (
                            <>
                                <div className="feedback">{this.renderFeedback()}</div>
                            </>
                        )}
                    <form onSubmit={this.handleSubmit}>
                        {!this.state.answer ? (
                            <>
                                <div role="alert">{error && <p>{error}</p>}</div>
                                <div className="guess-container">
                                    <Label htmlFor="guess-input" className="input-label">
                                        What is the english Translation?
                                    </Label>
                                    <Input
                                        id="guess-input"
                                        type="text"
                                        name="guess"
                                        value={this.state.guess}
                                        onChange={(event) => this.handleChange(event)}
                                        required
                                    />
                                </div>
                                <Button type="submit">Submit</Button>
                                <section className="user-progress">
                                    <h5 className="user-score">
                                        Your total score is: {totalScore}
                                    </h5>
                                    <div className="score-feedback">
                                        <p>
                                            You have answered this word correctly {wordCorrectCount}{' '}times.
                                        </p>
                                        <p>
                                            You have answered this word incorrectly {wordIncorrectCount}{' '}times.
                                        </p>
                                    </div>
                                </section>
                            </>
                        ) : (
                                <>
                                    <Button
                                        type="button"
                                        id="next-button"
                                        onClick={(event) => this.handleNextWord(event)}
                                    >
                                        Next Word!
                                </Button>
                                    <section className="user-progress">
                                        <h5 className="user-score">
                                            Your total score is: {totalScore}
                                        </h5>
                                    </section>
                                </>
                            )}
                    </form>
                </section>
            </>
        );
    }
}