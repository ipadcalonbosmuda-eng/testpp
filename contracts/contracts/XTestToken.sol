// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract XTestToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant PUBLIC_CAP = 500_000_000 * 10**18; // 500 million tokens for public mint
    uint256 public constant PER_WALLET_CAP = 2_000_000 * 10**18; // 2 million tokens per wallet
    
    uint256 public publicMinted = 0;
    mapping(address => uint256) public walletMinted;
    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount);
    
    constructor() ERC20("xTesT", "XTEST") {
        // Owner gets the remaining tokens (500M) for team/development
        _mint(owner(), MAX_SUPPLY - PUBLIC_CAP);
    }
    
    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized minter");
        _;
    }
    
    function setMinter(address minter, bool isMinter) external onlyOwner {
        minters[minter] = isMinter;
        if (isMinter) {
            emit MinterAdded(minter);
        } else {
            emit MinterRemoved(minter);
        }
    }
    
    function mint(address to, uint256 amount) external onlyMinter nonReentrant {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        require(publicMinted + amount <= PUBLIC_CAP, "Exceeds public mint cap");
        require(walletMinted[to] + amount <= PER_WALLET_CAP, "Exceeds per-wallet cap");
        
        publicMinted += amount;
        walletMinted[to] += amount;
        
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    function getRemainingPublicSupply() external view returns (uint256) {
        return PUBLIC_CAP - publicMinted;
    }
    
    function getWalletRemainingCap(address wallet) external view returns (uint256) {
        return PER_WALLET_CAP - walletMinted[wallet];
    }
}
