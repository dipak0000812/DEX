// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DEXPool.sol";

/**
 * @title DEXFactory
 * @notice Factory contract for creating and managing liquidity pools
 * @dev Simplified V3-style factory with fee tiers
 */
contract DEXFactory {
    // State variables
    address public owner;
    
    // Fee tiers (in basis points: 100 = 1%, 500 = 5%)
    uint24 public constant FEE_LOW = 100;      // 0.01% for stablecoin pairs
    uint24 public constant FEE_MEDIUM = 500;   // 0.05% for most pairs
    uint24 public constant FEE_HIGH = 3000;    // 0.3% for exotic pairs
    
    // Mapping: token0 => token1 => fee => pool address
    mapping(address => mapping(address => mapping(uint24 => address))) public getPool;
    
    // Array of all pools
    address[] public allPools;
    
    // Enabled fee tiers
    mapping(uint24 => bool) public feeEnabled;
    
    // Events
    event PoolCreated(
        address indexed token0,
        address indexed token1,
        uint24 indexed fee,
        address pool,
        uint256 poolId
    );
    
    event FeeAmountEnabled(uint24 indexed fee);
    
    constructor() {
        owner = msg.sender;
        
        // Enable default fee tiers
        feeEnabled[FEE_LOW] = true;
        feeEnabled[FEE_MEDIUM] = true;
        feeEnabled[FEE_HIGH] = true;
        
        emit FeeAmountEnabled(FEE_LOW);
        emit FeeAmountEnabled(FEE_MEDIUM);
        emit FeeAmountEnabled(FEE_HIGH);
    }
    
    /**
     * @notice Create a new liquidity pool
     * @param tokenA First token address
     * @param tokenB Second token address
     * @param fee Fee tier for the pool
     * @return pool Address of the created pool
     */
    function createPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external returns (address pool) {
        require(tokenA != tokenB, "Identical tokens");
        require(feeEnabled[fee], "Fee not enabled");
        
        // Order tokens (token0 < token1)
        (address token0, address token1) = tokenA < tokenB 
            ? (tokenA, tokenB) 
            : (tokenB, tokenA);
        
        require(token0 != address(0), "Zero address");
        require(getPool[token0][token1][fee] == address(0), "Pool exists");
        
        // Deploy new pool
        pool = address(new DEXPool(token0, token1, fee));
        
        // Store pool reference
        getPool[token0][token1][fee] = pool;
        getPool[token1][token0][fee] = pool; // Bidirectional mapping
        allPools.push(pool);
        
        emit PoolCreated(token0, token1, fee, pool, allPools.length - 1);
    }
    
    /**
     * @notice Enable a new fee tier
     * @param fee Fee amount to enable
     */
    function enableFeeAmount(uint24 fee) external {
        require(msg.sender == owner, "Not owner");
        require(!feeEnabled[fee], "Fee already enabled");
        require(fee < 100000, "Fee too high"); // Max 10%
        
        feeEnabled[fee] = true;
        emit FeeAmountEnabled(fee);
    }
    
    /**
     * @notice Get total number of pools
     */
    function allPoolsLength() external view returns (uint256) {
        return allPools.length;
    }
}