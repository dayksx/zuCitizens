import { ethers } from "ethers";
import React, { useEffect, useState, useContext } from "react";
import { Alert, Breadcrumb, Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface Citizen {
    id: number;
    name: string;
    registrationDate: string;
    // Add other fields as needed
}

const Census = () => {

// Replace with your contract address
const contractAddress = '0xE6EAcd03E0aFF16010ff35a32d563Ca6331c1FF8';

// Replace with your contract ABI
const abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "citizen",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "expiration",
                "type": "uint256"
            }
        ],
        "name": "CitizenRegistered",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_citizen",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_expiration",
                "type": "uint256"
            }
        ],
        "name": "registerCitizen",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const { id } = useParams<{ id: string }>();
const navigate = useNavigate();
const [citizen, setCitizen] = useState<Citizen | null>(null);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (!id) {
    setError('Invalid citizen ID');
    return;
  }

  const citizenId = parseInt(id, 10);
  if (isNaN(citizenId)) {
    setError('Invalid citizen ID');
    return;
  }

  // Fetch the citizen information from your backend or smart contract
  // This is a placeholder for the actual data fetching logic
  const fetchCitizen = async () => {
    try {
      // Replace with actual data fetching logic
      const fetchedCitizen: Citizen = {
        id: citizenId,
        name: 'Alice',
        registrationDate: '2023-01-01',
        // Add other fields as needed
      };
      setCitizen(fetchedCitizen);
    } catch (err) {
      setError('Failed to fetch citizen information');
    }
  };

  fetchCitizen();
}, [id]);

if (error) {
  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={() => navigate('/census')}>
            Back to Census
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

if (!citizen) {
  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Alert variant="info">Loading...</Alert>
        </Col>
      </Row>
    </Container>
  );
}

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Body>
              <Card.Title>Citizen Information</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {citizen.name}
              </Card.Text>
              <Card.Text>
                <strong>Registration Date:</strong> {citizen.registrationDate}
              </Card.Text>
              {/* Add other fields as needed */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Census;