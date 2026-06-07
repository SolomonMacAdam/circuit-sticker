// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CircuitSticker {
    mapping(address => uint256) public userChips;
    mapping(address => uint256) public userRoutes;
    mapping(address => uint256) public userSparks;

    uint256 public totalChips;
    uint256 public totalRoutes;
    uint256 public totalSparks;

    event ChipPlaced(address indexed user, uint256 userChips, uint256 totalChips);
    event LineRouted(address indexed user, uint256 userRoutes, uint256 totalRoutes);
    event SparkTested(address indexed user, uint256 userSparks, uint256 totalSparks);

    function placeChip() external {
        unchecked {
            userChips[msg.sender] += 1;
            totalChips += 1;
        }

        emit ChipPlaced(msg.sender, userChips[msg.sender], totalChips);
    }

    function routeLine() external {
        unchecked {
            userRoutes[msg.sender] += 1;
            totalRoutes += 1;
        }

        emit LineRouted(msg.sender, userRoutes[msg.sender], totalRoutes);
    }

    function testSpark() external {
        unchecked {
            userSparks[msg.sender] += 1;
            totalSparks += 1;
        }

        emit SparkTested(msg.sender, userSparks[msg.sender], totalSparks);
    }
}
