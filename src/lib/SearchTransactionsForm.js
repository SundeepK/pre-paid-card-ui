import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl, Form, Col} from 'react-bootstrap';
import TransactionTable from './TransactionsTable'

const PRE_PAID_CARD_HOST = process.env.REACT_APP_PRE_PAID_CARD_URL ? process.env.REACT_APP_PRE_PAID_CARD_URL : 'https://pre-paird-card-dev.eu-west-1.elasticbeanstalk.com';

class SearchTransactionsForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            transactions: [],
            loading: false,
            pages: 0,
            size: 10
        };
        this.submit = this.submit.bind(this);
    }

    submit(state, instance) {
        let page = state.page? state.page : 0;
        let pageSize = state.pageSize ? state.pageSize : 10;
        let sortParams = 'sort=epocMillis,desc';
        if (state.sorted) {
            sortParams = state.sorted
                .map(sorted => `sort=${sorted.id},${sorted.desc? 'desc' : 'asc'}`)
                .join('&');
        }
        if (this.cardId && this.cardId.value.length > 0 && parseInt(this.cardId.value, 10) > 0) {
            this.setState({loading: true});
            let url = `${PRE_PAID_CARD_HOST}/cards/${this.cardId.value}/transactions?page=${page}&size=${pageSize}&${sortParams}`;
            console.log(`Fetching transactions: ${url}`);
            return fetch(url)
                .then((response) => {
                    return response.json().then((json) => {
                        console.log(JSON.stringify(json));
                        this.setState({
                            transactions: json,
                            loading: false,
                            pages: Number(response.headers.get("total-pages"))
                        })
                    });
                })
        } else {
            return () => [];
        }
    }

    render() {
        return (
            <div>
                <Form horizontal className="searchForm">
                    <FormGroup controlId="formTransaction">
                        <Col componentClass={ControlLabel} sm={2}>
                            Id
                        </Col>
                        <Col sm={10}>
                            <FormControl inputRef={node => this.cardId = node} type="text" placeholder="card id"/>
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button onClick={this.submit}>Search</Button>
                        </Col>
                    </FormGroup>
                </Form>
                <TransactionTable loading={this.state.loading} pages={this.state.pages} onTransactions={this.submit}
                                  data={this.state.transactions}/>
            </div>
        )
    }
}

export default SearchTransactionsForm;