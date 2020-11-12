import React, { Component } from 'react';
import config from '../../config';
import TokenService from '../../services/token-service';
import UserContext from '../../contexts/UserContext';
import { Input, Label } from '../Form/Form';
import Button from '../Button/Button';

export default class Learn extends Component {
    state = {
        error: null,
        loading: true,
        nextWord: '',
        wordCorrectCount: 0,
        wordIncorrectCount: 0,
        totalScore: 0,
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
                <section>
                    <h2>Translate The Following</h2>
                    <span className="next-word">{nextWord}</span>
                    <form onSubmit={this.handleSubmit}>
                        <div role="alert">{error && <p>{error}</p>}</div>
                        <div>
                            <Label htmlFor="guess-input" className="input-label">
                                What is the english Translation?
                            </Label>
                            <Input
                                ref={this.firstInput}
                                id="guess-input"
                                name="guess"
                                required
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </section>
                <section>
                    <h4>Your Total Score: {totalScore}</h4>
                    <p>Correct Guesses: {wordCorrectCount}</p>
                    <p>Incorrect Guesses: {wordIncorrectCount}</p>
                </section>
            </>
        );
    }
}