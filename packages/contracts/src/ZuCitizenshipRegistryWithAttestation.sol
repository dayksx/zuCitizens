// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {ISPHook} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

import { Verifier } from "vlayer-0.1.0/Verifier.sol";
import { ZuCitizenshipRegistryProver } from "ZuCitizenshipRegistryProver.sol";

address constant PROVER_ADDR = address(0xd7141F4954c0B082b184542B8b3Bd00Dc58F5E05);
bytes4 constant  PROVER_FUNC_SELECTOR = ZuCitizenshipRegistryProver.main.selector;

contract ZuCitizenshipRegistryWithAttestation is Verifier, ISPHook {

    ISP public spInstance;
    uint64 public schemaId;

    error CallerIsNotSPInstance();

    modifier onlySPInstance() {
        if (_msgSender() != spInstance) {
            revert CallerIsNotSPInstance();
        }
        _;
    }

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

    event Invited(address indexed inviter, address invitee);
    constructor() Ownable(_msgSender()) {}

    function setSPInstance(address instance) external onlyOwner {
        spInstance = ISP(instance);
    }

    function setSchemaID(uint64 schemaId_) external onlyOwner {
        schemaId = schemaId_;
    }

    // function for the contract owner to mark an address as registered citizen
    function registerCitizenByOwner(address _citizen, uint256 _expiration) external onlyOwner {
        _registerCitizen(_citizen, _expiration);
    }
    
    // function for the contract owner to mark an address as registered citizen
    function registerCitizen(Proof _p, address _citizen, uint256 _expiration) external onlyVerified(PROVER_ADDR, PROVER_FUNC_SELECTOR) {
        _registerCitizen(_citizen, _expiration);
    }

    function inviteCitizen(
        address _inviteeAddress,
        uint256 _expiration
    ) external returns (uint64) {
        require(citizens[_msgSender()].isCitizen, "Inviter is not a citizen");

        bytes[] memory recipient = new bytes[](1);
        recipient[0] = abi.encode(_inviteeAddress);

        bytes memory data = abi.encode(_inviteeAddress, _expiration);


        Attestation memory a = Attestation({
            schemaId: schemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipient,
            data: data
        });

        uint64 attestationId = spInstance.attest(a, "", "", "");
        emit Invited(
            _msgSender(),
            inviteeAddress
        );

        return attestationId;
    }

    function didReceiveAttestation(
        address, // attester
        uint64, // schemaId
        uint64 attestationId,
        bytes calldata // extraData
    ) external onlySPInstance {
        Attestation memory attestation = ISP(_msgSender()).getAttestation(
            attestationId
        );
        address invitee = abi.decode(attestation.recipients[0], (address));

        _registerCitizen(invitee, block.timestamp + 10 years);
    }

    function didReceiveAttestation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    ) external pure {
        revert UnsupportedOperation();
    }

    function didReceiveRevocation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        bytes calldata // extraData
    ) external payable {
        revert UnsupportedOperation();
    }

    function didReceiveRevocation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    ) external pure {
        revert UnsupportedOperation();
    }

    // TODO: verify receiver
    function main(
        UnverifiedEmail calldata unverifiedEmail,
        address targetWallet
    ) public view returns (Proof, bytes32, address) {
        VerifiedEmail memory email = unverifiedEmail.verify();

        require(
            email.from.matches("^.*@ethglobal.com$"),
            "from must be a ethglobal address"
        );

        // require(
        //     email.subject.equal(
        //         "[POAP Inside] Thanks for hacking at ETHGlobal Singapore 2024!"
        //     ),
        //     "incorrect subject"
        // );

        return (proof(), sha256(abi.encodePacked(email.from)), targetWallet);
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
