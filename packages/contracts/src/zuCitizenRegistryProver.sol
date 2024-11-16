// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Strings} from "@openzeppelin-contracts-5.0.1/utils/Strings.sol";

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/EmailProof.sol";

import {AddressParser} from "./utils/AddressParser.sol";

interface IExample {
    function exampleFunction() external returns (uint256);
}

contract zuCitizenRegistryProver is Prover {
    using Strings for string;
    using RegexLib for string;
    using AddressParser for string;
    using EmailProofLib for UnverifiedEmail;

    function main(UnverifiedEmail calldata unverifiedEmail) public view returns (Proof memory, string memory) {
        VerifiedEmail memory email = unverifiedEmail.verify();

        require(
            email.from.matches("^.*@ethglobal.com$"),
            "from must be a ethglobal address"
        );

        return (proof(), email.from);
    }
}
