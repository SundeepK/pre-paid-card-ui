import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl, Form, Col, Label} from 'react-bootstrap';
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
            bal: 0,
            size: 10
        };
        this.submit = this.submit.bind(this);
        this.loadTransactions = this.loadTransactions.bind(this);
        this.loadBal = this.loadBal.bind(this);
    }

    loadTransactions(page, pageSize, sortParams) {
        let url = `${PRE_PAID_CARD_HOST}/cards/${this.cardId.value}/transactions?page=${page}&size=${pageSize}&${sortParams}`;
        console.log(`Fetching transactions: ${url}`);
        fetch(url)
            .then((response) => {
                if (response.status === 200) {
                    return response.json().then((json) => {
                        console.log(JSON.stringify(json));
                        this.setState({
                            transactions: json,
                            loading: false,
                            pages: Number(response.headers.get("total-pages"))
                        })
                    });
                } else {
                    this.setState({
                        loading: false,
                        transactions: []
                    })
                }
            });
    }

    loadBal(){
        let urlBalance = `${PRE_PAID_CARD_HOST}/cards/${this.cardId.value}/balance`;
        fetch(urlBalance)
            .then((response) => {
                if (response.status === 200) {
                    return response.json().then((json) => {
                        console.log(JSON.stringify(json));
                        this.setState({
                            bal: json.amount,
                        })
                    });
                } else {
                    this.setState({
                        loading: false,
                        bal: 0
                    })
                }
            })
    }

    submit(state, instance) {
        let page = state.page ? state.page : 0;
        let pageSize = state.pageSize ? state.pageSize : 10;
        let sortParams = 'sort=epocMillis,desc';
        if (state.sorted) {
            sortParams = state.sorted
                .map(sorted => `sort=${sorted.id},${sorted.desc ? 'desc' : 'asc'}`)
                .join('&');
        }
        if (this.cardId && this.cardId.value.length > 0 && parseInt(this.cardId.value, 10) > 0) {
            this.setState({loading: true});
            this.loadTransactions(page, pageSize, sortParams);
            this.loadBal();
        } else {
            this.setState({
                loading: false,
                transactions: [],
                bal: 0
            });
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
                <h3 className='balance'>
                    Total Balance <Label bsStyle={this.state.bal > 0 ? "success" : 'default'}>£{this.state.bal}</Label>
                </h3>
                <TransactionTable loading={this.state.loading} pages={this.state.pages} onTransactions={this.submit}
                                  data={this.state.transactions}/>
            </div>
        )
    }
}

export default SearchTransactionsForm;