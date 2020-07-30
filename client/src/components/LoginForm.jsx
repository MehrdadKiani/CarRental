import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext'

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { username: '', password: '', submitted: false };
    }

    onChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    };

    onChangePassword = (event) => {
        this.setState({ password: event.target.value });
    };

    handleSubmit = (event, onLogin) => {
        event.preventDefault();
        onLogin(this.state.username, this.state.password);
        this.setState({ submitted: true });
    }

    render() {
        if (this.state.submitted)
            return <Redirect to='/' />;
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <Fragment>
                        <div className="col-sm-4 mx-auto">
                            <div className="card">
                                <article className="card-group-item">
                                    <header className="card-header">
                                        <h6 className="title"><em>Trust. </em></h6>
                                    </header>
                                    <div className="filter-content">
                                        <div className="card-body">
                                            <div className="table-responsive">









                                                <Form method="POST" onSubmit={(event) => this.handleSubmit(event, context.loginUser)}>
                                                    <Form.Group controlId="username">
                                                        <Form.Label>E-mail</Form.Label>
                                                        <Form.Control type="email" name="email" placeholder="E-mail" value={this.state.username} onChange={(ev) => this.onChangeUsername(ev)} required autoFocus />
                                                    </Form.Group>

                                                    <Form.Group controlId="password">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control type="password" name="password" placeholder="Password" value={this.state.password} onChange={(ev) => this.onChangePassword(ev)} required />
                                                    </Form.Group>

                                                    <Button variant="primary" type="submit">Login</Button>
                                                </Form>

                                                {context.authErr &&
                                                    <Alert variant="danger">
                                                        {context.authErr.msg}
                                                    </Alert>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </Fragment>
                )}
            </AuthContext.Consumer>

        );
    }


}

export default LoginForm;