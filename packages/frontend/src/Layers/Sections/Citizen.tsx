import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Alert } from "react-bootstrap";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";

const Citizen = () => {
  const { primaryWallet } = useDynamicContext();
  const [isCitizen, setIsCitizen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteeAddress, setInviteeAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [inviteCount, setInviteCount] = useState(0);

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

  useEffect(() => {
    const checkCitizenStatus = async () => {
      if (primaryWallet?.address) {
        // Add logic to check if the user is a citizen
        setIsCitizen(true); // Temporary - replace with actual check
      }
    };

    checkCitizenStatus();
  }, [primaryWallet]);

  const handleInvite = async () => {
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

      const expirationDate = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
      
      const tx = await contract.inviteCitizen(inviteeAddress, expirationDate);
      await tx.wait();

      setSuccess('Invitation sent successfully!');
      setInviteCount(prev => prev + 1);
      setInviteeAddress('');
      setShowInviteModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>My Citizenship Information</Card.Title>
              <Card.Text>
                <div className="mb-3">
                  <strong>Status:</strong> {isCitizen ? 'Active Citizen' : 'Not a Citizen'}<br/>
                  <strong>Wallet:</strong> {primaryWallet?.address || 'Not Connected'}<br/>
                  <strong>Invitations Sent:</strong> {inviteCount}
                </div>
                
                {isCitizen && (
                  <div className="mt-3">
                    <h5>Invite New Citizens</h5>
                    <p className="text-muted">As a citizen, you can invite others to join our community.</p>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => setShowInviteModal(true)}
                      className="mt-2"
                    >
                      Send New Invitation
                    </Button>
                  </div>
                )}
              </Card.Text>
            </Card.Body>
          </Card>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3">{success}</Alert>}
        </Col>
      </Row>

      <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invite New Citizen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Invitee Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="0x..."
              value={inviteeAddress}
              onChange={(e) => setInviteeAddress(e.target.value)}
            />
            <small className="form-text text-muted">
              Enter the Ethereum address of the person you want to invite
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleInvite}>
            Send Invitation
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Citizen;