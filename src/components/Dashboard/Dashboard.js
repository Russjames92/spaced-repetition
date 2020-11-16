import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import TokenService from '../../services/token-service';
import config from '../../config';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import Words from '../Words/Words';
import './Dashboard.css'

class Dashboard extends Component {
    state = {
        error: null,
        loading: true,
    }
    static contextType = UserContext;

    componentDidMount() {
        return fetch(`${config.API_ENDPOINT}/language`, {
            headers: {
                authorization: `bearer ${TokenService.getAuthToken()}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                this.context.setLanguage(res.language);
                this.context.setWords(res.words);
                this.setState({ loading: false });
            })
            .catch((e) => this.setState({ error: null }));
    }

    renderWordList = (words) => {
        let wordList = [];
        if (words) {
            words.map((word) => {
                return wordList.push(<Words key={word.id} word={word} />);
            });
        }
        return wordList;
    };

    render() {
        const dashboard = (
            <>
                <section>
                    <h2>{this.context.language ? this.context.language.name : null}</h2>
                    <Link to="/learn">
                        <Button>Start Learning Now!</Button>
                    </Link>
                    <hr className="separator" />
                    <h3 className="sub-title">Words To Practice</h3>
                    <ul>{this.renderWordList(this.context.words)}</ul>
                </section>
                <section>
                    <h4 className="total">{this.context.language ? `Total Correct: ${this.context.language.total_score}` : null}</h4>
                </section>
            </>
        );
        return this.state.loading ? <p>Loading...</p> : dashboard;
    }
}

export default Dashboard;