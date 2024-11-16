import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { 
  Alert, 
  Button, 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner 
} from "react-bootstrap";

const zuRegistryVerifierContract = "0x239EF3aa0B09551A35C6A43367cb81499d4Ba25f";
const BLOCK_EXPLORER_URL = "https://sepolia-optimism.etherscan.io"; // OP Sepolia
const EXPECTED_CHAIN_ID = '0xaa37dc'; // OP Sepolia chain ID (11155420 in decimal)

interface CitizenEvent {
  citizen: string;
  expiration: string;
}

// Define the event interface
interface CitizenRegisteredEventArgs {
  citizen: string;
  expiration: bigint;
}

interface CitizenRegisteredEvent extends ethers.Log {
  args: CitizenRegisteredEventArgs;
  eventName: string;
}

const Census = () => {
  console.log('Census component rendered');

  const [events, setEvents] = useState<CitizenEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkNetwork = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      
      if (chainId.toString(16) !== EXPECTED_CHAIN_ID.replace('0x', '')) {
        throw new Error(`Please switch to OP Sepolia network (Chain ID: ${EXPECTED_CHAIN_ID})`);
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check network first
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        return;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - ((7 * 24 * 60 * 60) / 2));
      
      const contract = new ethers.Contract(
        zuRegistryVerifierContract, 
        ["event CitizenRegistered(address indexed citizen, uint256 expiration)"], 
        provider
      );

      // Query in chunks of 2000 blocks
      const CHUNK_SIZE = 2000;
      let allEvents: ethers.Log[] = [];
      
      for (let start = fromBlock; start < currentBlock; start += CHUNK_SIZE) {
        const end = Math.min(start + CHUNK_SIZE - 1, currentBlock);
        console.log(`Fetching events from block ${start} to ${end}`);
        
        const filter = contract.filters.CitizenRegistered();
        const chunk = await contract.queryFilter(filter, start, end);
        allEvents = [...allEvents, ...chunk];
      }

      console.log("Raw events:", allEvents);

      const formattedEvents = allEvents.map(event => {
        const typedEvent = event as unknown as CitizenRegisteredEvent;
        return {
          citizen: typedEvent.args.citizen,
          expiration: new Date(Number(typedEvent.args.expiration) * 1000).toLocaleString()
        };
      });

      setEvents(formattedEvents);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      // More detailed error message
      setError(
        `Failed to fetch citizens. ${err.message || 'Please try again.'} ` +
        `Make sure you're connected to the correct network.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddressClick = (address: string) => {
    window.open(`${BLOCK_EXPLORER_URL}/address/${address}`, '_blank');
  };

  console.log("Rendering with events:", events); // Debug log
  console.log("Loading state:", loading); // Debug log
  console.log("Error state:", error); // Debug log

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Registered Citizens</h2>
            <div>
              <small className="text-muted d-block mb-2">
                Network: OP Sepolia (Chain ID: {EXPECTED_CHAIN_ID})
              </small>
              <Button 
                variant="outline-primary" 
                onClick={fetchEvents}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Loading...
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger">
              {error}
              {error.includes('network') && (
                <div className="mt-2">
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={async () => {
                      try {
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: EXPECTED_CHAIN_ID }],
                        });
                        // Retry fetching events after network switch
                        fetchEvents();
                      } catch (err) {
                        console.error('Failed to switch network:', err);
                      }
                    }}
                  >
                    Switch to OP Sepolia
                  </Button>
                </div>
              )}
            </Alert>
          )}
          
          {!loading && events.length === 0 && (
            <Alert variant="info">No citizens registered yet.</Alert>
          )}
          
          {events.map((event, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>
                  Citizen:{' '}
                  <span 
                    className="text-primary" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleAddressClick(event.citizen)}
                  >
                    {event.citizen}
                  </span>
                </Card.Title>
                <Card.Text>Expiration: {event.expiration}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Census;