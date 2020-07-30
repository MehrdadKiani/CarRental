import React, { Component, Fragment } from 'react';
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import History from './History'
import API from '../api/API'
import { AuthContext } from '../auth/AuthContext'
import { Redirect } from 'react-router-dom';

class HistoryList extends Component {
    constructor(props) {
        super(props);
        this.state = { histories: [], authUser: '' };
    }

    componentDidMount() {

        //check if the user is authenticated
        API.isAuthenticated().then(
            (user) => {
                this.setState((state) => ({ authUser: user }));
                this.getHistories();
            }
        ).catch((err) => {
            this.setState({ authErr: err.errorObj });
            this.props.linkHistory.push("/login");
        });
    }


    getHistories = () => {
        API.getHistories()
            .then((histories) => this.setState(
                { histories: histories.filter(item => item.userId === this.state.authUser.id) }))
            .catch((errorObj) => {
                console.log(errorObj);
                //this.handleErrors(errorObj);
            });
    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <Fragment>
                        {context.authErr && <Redirect to="/login"></Redirect>}




                        <Fragment>
                            <div className="col-lg-8 mx-auto">
                                <Card>
                                    <Card.Header>Rents history</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <div className="table-responsive">
                                                <table className="table table-striped table-sm table-hover">
                                                    <thead className=""><tr><th>ID</th><th>Category</th><th>Payment(€)</th><th>Start date</th><th>End date</th><th>Status</th><th>Action</th></tr></thead>
                                                    <tbody>
                                                        {
                                                            this.state.histories.map((item) =>
                                                                <History
                                                                    getHistories={this.getHistories}
                                                                    linkHistory={this.props.linkHistory}
                                                                    key={item.id}
                                                                    id={item.id}
                                                                    startDateTime={item.startDateTime}
                                                                    endDateTime={item.endDateTime}
                                                                    total={item.total}
                                                                    status={item.status}
                                                                    userId={item.userId}
                                                                    carId={item.carId}
                                                                    carCategory={item.carCategory} />
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </ListGroup.Item>

                                    </ListGroup>
                                </Card>
                            </div>
                        </Fragment>




                    </Fragment>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default HistoryList;