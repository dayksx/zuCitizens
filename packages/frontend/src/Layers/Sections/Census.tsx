import { ethers } from "ethers";
import React, { useEffect, useState, useContext } from "react";
import { Breadcrumb, Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";


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

  return (
    <main className="col-10">
      <h1>Census</h1>

    </main>
  );
};

export default Census;