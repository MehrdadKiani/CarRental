import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

class Footer extends Component {
    state = {}
    render() {
        return (
            <Navbar expand="lg" variant="light" bg="dark" sticky="bottom">
                <Container>
                    <Navbar.Brand href="#">Navbar</Navbar.Brand>
                </Container>
            </Navbar>
        );
    }
}

export default Footer;