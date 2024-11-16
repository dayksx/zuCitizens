import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import './header.css';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = () => {

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">ZuCitizensApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/registration">Citizen Registration</Nav.Link>
            <Nav.Link as={Link} to="/info">My Citizenship Info</Nav.Link>
            <Nav.Link as={Link} to="/census">Citizens Census</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;