// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ZuCitizenshipRegistry} from "../src/ZuCitizenshipRegistry.sol";

contract ZuCitizenshipRegistryTest is Test {
    ZuCitizenshipRegistry public zuCitizenshipRegistry;

    function setUp() public {
        zuCitizenshipRegistry = new ZuCitizenshipRegistry();
    }

    function registerCitizen() public {
      address addr = address(0);
      uint256 exp = 1704067199;
      zuCitizenshipRegistry.registerCitizen(addr, exp);
      assertTrue(true);
    }
}
