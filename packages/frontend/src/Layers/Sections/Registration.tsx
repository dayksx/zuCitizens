import { ethers } from "ethers";
import React, { useEffect, useState, useContext } from "react";
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Card, Tabs, Tab } from 'react-bootstrap';
import { preverifyEmail, createVlayerClient } from '@vlayer/sdk';
import fs from 'fs';

const Registration = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [price, setPrice] = useState<string>('0.01');
  const [zkProof, setZkProof] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [key, setKey] = useState<string>('ethGlobal');
  const [emlFile, setEmlFile] = useState<File | null>(null);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        setError('Failed to connect to MetaMask');
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setEmlFile(event.target.files[0]);
    }
  };

  const generateZkProof = async () => {
    if (!emlFile) {
      throw new Error('No .eml file uploaded');
    }

    const reader = new FileReader();
    reader.readAsText(emlFile);
    const emailContent = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
    });

    const unverifiedEmail = await preverifyEmail(emailContent);

    const vlayer = createVlayerClient();
    const prover = '0x123'; // Replace with your prover contract address
    const emailProofProver = { abi: [] }; // Replace with your prover contract ABI
    const foundry = 534351; // Replace with your chain ID

    const hash = await vlayer.prove({
      address: prover,
      proverAbi: emailProofProver.abi,
      functionName: 'main',
      args: [unverifiedEmail],
      chainId: foundry,
    });

    const result = await vlayer.waitForProvingResult(hash);
    console.log(result);
    return result;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) {
      setError('Please connect to MetaMask');
      return;
    }

    if (key === 'ethGlobal' && !emlFile) {
      setError('Please upload an .eml file for ETHGlobal proof');
      return;
    }

    try {
      const proof = await generateZkProof();
      setZkProof(proof);
      setSuccess('Registration successful');
      setError(null);
    } catch (err) {
      setError('Failed to generate zkProof');
      setSuccess(null);
    }
  };

  return (    
  <Container className="mt-5">
    <Row>
      <Col md={8} className="mx-auto">
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Conditions to Join the Community</Card.Title>
            <Card.Text>
              To join our community, you must meet at least one of the following conditions:
              <ul>
                <li>Successfully hacked in ETHGlobal</li>
                <li>Donation to Ethereum Foundation</li>
                <li>Owner of Gitcoin passport</li>
              </ul>
            </Card.Text>
          </Card.Body>
        </Card>
        <h2>Citizen Registration</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Tabs
          id="proof-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k || 'ethGlobal')}
          className="mb-3"
        >
          <Tab eventKey="ethGlobal" title="ETHGlobal">
            <p>Provide proof of successfully hacking in ETHGlobal.</p>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload .eml File</Form.Label>
              <Form.Control type="file" accept=".eml" onChange={handleFileChange} />
            </Form.Group>
          </Tab>
          <Tab eventKey="donation" title="Donation to Ethereum Foundation">
            <p>Provide proof of donation to the Ethereum Foundation.</p>
          </Tab>
          <Tab eventKey="gitcoin" title="Gitcoin Passport">
            <p>Provide proof of owning a Gitcoin passport.</p>
          </Tab>
        </Tabs>
        <hr />
        <h3>Price to Join</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formPrice" className="mt-3">
            <Form.Label>Price to Join (ETH)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              Recommended price: 0.01 ETH
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={connectMetaMask} className="mt-3">
            {account ? `Connected: ${account}` : 'Connect MetaMask'}
          </Button>
          <Button variant="success" type="submit" className="mt-3 ms-3">
            Register
          </Button>
        </Form>
      </Col>
    </Row>
  </Container>
  );
};

export default Registration;