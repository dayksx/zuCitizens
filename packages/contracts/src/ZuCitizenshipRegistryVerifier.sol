// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import {Proof} from "vlayer-0.1.0/Proof.sol";
import { Verifier } from "vlayer-0.1.0/Verifier.sol";
import { ZuCitizenshipRegistryProver } from "./ZuCitizenshipRegistryProver.sol";

address constant PROVER_ADDR = address(0xB9200A945f69Deeb19E485ab392eFF3B8575C2F3);
bytes4 constant  PROVER_FUNC_SELECTOR = ZuCitizenshipRegistryProver.main.selector;

contract ZuCitizenshipRegistryVerifier is Verifier {
    // Mapping from address to Citizen struct
    mapping(address => Citizen) private citizens;

        // Struct to store citizen information
    struct Citizen {
        bool isCitizen; // Indicates if the address is a registered citizen
        uint256 expiration; // Timestamp when the citizenship expires
        address[] identities; // Array of addresses representing the citizen's identities
    }

    // Events to log actions
    event CitizenRegistered(address indexed citizen, uint256 expiration);
    event CitizenshipRevoked(address indexed citizen);
    event IdentityAdded(address indexed citizen, address identity);
    event IdentityRemoved(address indexed citizen, address identity);

    // function for the verified citizens to register
    function registerCitizen(Proof calldata proof, string calldata email, address _citizen) external {
        this.registerCitizenVerify(proof, email);
        _registerCitizen(_citizen, block.timestamp + 30 days);
    }

    function registerCitizenVerify(Proof calldata, string calldata
    ) view external onlyVerified(PROVER_ADDR, PROVER_FUNC_SELECTOR) returns (bool) {
        return true;
    }

    // Function to register a new citizen
    // Only the admin can call this function
    // _citizen: Address of the new citizen
    // _expiration: Timestamp when the citizenship expires
    function _registerCitizen(address _citizen, uint256 _expiration) private {
        require(!citizens[_citizen].isCitizen, "Citizen already registered");
        citizens[_citizen].isCitizen = true;
        citizens[_citizen].expiration = _expiration;
        citizens[_citizen].identities.push(_citizen); // Add the citizen's address as their first identity
        emit CitizenRegistered(_citizen, _expiration);
    }
}
