import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import PropTypes from 'prop-types';

class TransactionsTable extends React.Component {

    render() {
        return (
            <div className="transactionTable">
                <ReactTable
                    data={this.props.data}
                    columns={[
                        {
                            Header: "Transactions",
                            columns: [
                                {
                                    Header: "Transaction id",
                                    accessor: "transactionId"
                                },
                                {
                                    Header: "amount",
                                    id: "amount",
                                    accessor: "amount"
                                },
                                {
                                    Header: "type",
                                    id: "type",
                                    accessor: "type",
                                    Cell: row => (
                                            <div
                                                style={{
                                                    borderRadius: '5px',
                                                    padding: '5px',
                                                    display: 'inline-block',
                                                    height: '100%',
                                                    color: '#fff',
                                                    backgroundColor: row.value === 'DEPOSIT' ? '#00cc65'
                                                        : row.value  === 'PAYMENT' ? '#ff6c59'
                                                            : '#ffc946',
                                                    transition: 'all .2s ease-out'
                                                }}
                                            >{row.value}</div>
                                    )
                                },
                                {
                                    Header: "reason",
                                    id: "reason",
                                    accessor: "reason"
                                },
                                {
                                    Header: "date",
                                    id: "epocMillis",
                                    accessor: d => new Date(d.epochMillis).toUTCString()
                                }
                            ]
                        }
                    ]}
                    manual
                    pages={this.props.pages}
                    loading={this.props.loading}
                    onFetchData={this.props.onTransactions}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
                <br />
            </div>
        );
    }
}

TransactionsTable.propTypes = {
    pages: PropTypes.number,
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onTransactions: PropTypes.func.isRequired
};


export default TransactionsTable;