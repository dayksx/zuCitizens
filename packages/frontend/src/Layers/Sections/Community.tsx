import { ethers } from "ethers";
import React, { useEffect, useState, useContext } from "react";
import { Breadcrumb, Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
import { Card, Container, Row, Col } from 'react-bootstrap';


const Community = () => {


  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Community Values</Card.Title>
              <Card.Text>
                Our community values include respect, integrity, and collaboration. We strive to create a supportive and inclusive environment for all members.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Conditions to Join</Card.Title>
              <Card.Text>
                To join our community, you must agree to our code of conduct, participate in community activities, and contribute positively to the group.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Number of Persons</Card.Title>
              <Card.Text>
                Our community currently has 150 active members who regularly participate in events and discussions.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Community Events</Card.Title>
              <Card.Text>
                <ul>
                  <li>Monthly Meetup - Every first Saturday of the month</li>
                  <li>Workshops - Various topics throughout the year</li>
                  <li>Annual Conference - A gathering of all community members</li>
                </ul>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Community;