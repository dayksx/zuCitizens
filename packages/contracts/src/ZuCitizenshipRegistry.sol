// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Strings} from "@openzeppelin-contracts-5.0.1/utils/Strings.sol";
import {Prover} from "vlayer-0.1.0/src/Prover.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/src/EmailProof.sol";
import {EmailStrings} from "./EmailStrings.sol";

contract ZuCitizenshipRegistry is Prover {
    using Strings for string;
    using EmailStrings for string;
    using EmailProofLib for UnverifiedEmail;

    // Struct to store citizen information
    struct Citizen {
        bool isCitizen; // Indicates if the address is a registered citizen
        uint256 expiration; // Timestamp when the citizenship expires
        address[] identities; // Array of addresses representing the citizen's identities
    }

    // Mapping from address to Citizen struct
    mapping(address => Citizen) private citizens;

    // Events to log actions
    event CitizenRegistered(address indexed citizen, uint256 expiration);
    event CitizenshipRevoked(address indexed citizen);
    event IdentityAdded(address indexed citizen, address identity);
    event IdentityRemoved(address indexed citizen, address identity);

    string targetDomain;

    constructor(string memory _targetDomain) {
        targetDomain = _targetDomain;
    }

    // TODO: verify receiver
    function main(
        UnverifiedEmail calldata unverifiedEmail,
        address targetWallet
    ) public view returns (Proof, bytes32, address) {
        VerifiedEmail memory email = unverifiedEmail.verify();

        require(email.from.contains(targetDomain), "incorrect sender domain");
        require(
            email.subject.equal(
                "[POAP Inside] Thanks for hacking at ETHGlobal Singapore 2024!"
            ),
            "incorrect subject"
        );

        return (proof(), sha256(abi.encodePacked(email.from)), targetWallet);
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
