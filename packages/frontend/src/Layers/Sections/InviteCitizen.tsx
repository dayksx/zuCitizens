import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { ethers } from 'ethers';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const REGISTRY_ADDRESS = '0x239EF3aa0B09551A35C6A43367cb81499d4Ba25f';

const REGISTRY_ABI = [
  {
    inputs: [
      { name: "_inviteeAddress", type: "address" },
      { name: "_expiration", type: "uint256" }
    ],
    name: "inviteCitizen",
    outputs: [{ name: "", type: "uint64" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const InviteCitizen = () => {
  const [inviteeAddress, setInviteeAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { primaryWallet } = useDynamicContext();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!primaryWallet?.address) {
      setError('Please connect your wallet');
      return;
    }

    if (!ethers.isAddress(inviteeAddress)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, signer);

      // Set expiration to 10 years from now (matching the contract)
      const expirationDate = Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60);
      
      const tx = await contract.inviteCitizen(inviteeAddress, expirationDate);
      await tx.wait();

      setSuccess('Invitation sent successfully!');
      setInviteeAddress('');
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    }
  };

  return (
    <div className="mt-4">
      <h3>Invite New Citizen</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleInvite}>
        <Form.Group className="mb-3">
          <Form.Label>Invitee Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="0x..."
            value={inviteeAddress}
            onChange={(e) => setInviteeAddress(e.target.value)}
            required
          />
          <Form.Text className="text-muted">
            Enter the Ethereum address of the person you want to invite
          </Form.Text>
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Send Invitation
        </Button>
      </Form>
    </div>
  );
};

export default InviteCitizen;