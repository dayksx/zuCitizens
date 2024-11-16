// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import { Verifier } from "vlayer-0.1.0/Verifier.sol";
import { ZuCitizenshipRegistryProver } from "ZuCitizenshipRegistryProver.sol";

address constant PROVER_ADDR = address(0xd7141F4954c0B082b184542B8b3Bd00Dc58F5E05);
bytes4 constant  PROVER_FUNC_SELECTOR = ZuCitizenshipRegistryProver.main.selector;

contract ZuCitizenshipRegistry is Verifier {
    // Mapping from address to Citizen struct
    mapping(address => Citizen) private citizens;

    // Events to log actions
    event CitizenRegistered(address indexed citizen, uint256 expiration);
    event CitizenshipRevoked(address indexed citizen);
    event IdentityAdded(address indexed citizen, address identity);
    event IdentityRemoved(address indexed citizen, address identity);

    // function for the verified citizens to register
    function registerCitizen(Proof _p, address _citizen) external onlyVerified(PROVER_ADDR, PROVER_FUNC_SELECTOR) {
        _registerCitizen(_citizen, block.timestamp + 2 years);
    }

    // Function to register a new citizen
    // Only the admin can call this function
    // _citizen: Address of the new citizen
    // _expiration: Timestamp when the citizenship expires
    function registerCitizen(address _citizen, uint256 _expiration) public {
        require(!citizens[_citizen].isCitizen, "Citizen already registered");
        citizens[_citizen].isCitizen = true;
        citizens[_citizen].expiration = _expiration;
        citizens[_citizen].identities.push(_citizen); // Add the citizen's address as their first identity
        emit CitizenRegistered(_citizen, _expiration);
    }
}
