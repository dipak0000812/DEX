// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DEXPool
 * @notice Liquidity pool with concentrated liquidity (V3-style)
 * @dev Simplified implementation focusing on core concepts
 */
contract DEXPool is ERC20, ReentrancyGuard {
    // Tokens
    address public immutable token0;
    address public immutable token1;
    uint24 public immutable fee;
    
    // Pool state
    uint256 public reserve0;
    uint256 public reserve1;
    uint256 public price; // Simplified price: token1 per token0 (scaled by 1e18)
    
    // Liquidity positions (simplified - in real V3, this is more complex)
    struct Position {
        uint256 liquidity;
        int24 tickLower;
        int24 tickUpper;
        uint256 token0Owed;
        uint256 token1Owed;
    }
    
    mapping(address => Position) public positions;
    
    // Price range (ticks) - simplified tick system
    int24 public currentTick;
    int24 public constant MIN_TICK = -887272;
    int24 public constant MAX_TICK = 887272;
    
    // Events
    event Mint(
        address indexed sender,
        address indexed owner,
        uint256 amount0,
        uint256 amount1,
        uint256 liquidity
    );
    
    event Burn(
        address indexed owner,
        uint256 amount0,
        uint256 amount1,
        uint256 liquidity
    );
    
    event Swap(
        address indexed sender,
        address indexed recipient,
        int256 amount0,
        int256 amount1,
        uint256 price
    );
    
    constructor(
        address _token0,
        address _token1,
        uint24 _fee
    ) ERC20("DEX-V3-LP", "DXV3-LP") {
        token0 = _token0;
        token1 = _token1;
        fee = _fee;
    }
    
    /**
     * @notice Add liquidity to the pool
     */
    function addLiquidity(
        uint256 amount0Desired,
        uint256 amount1Desired,
        uint256 amount0Min,
        uint256 amount1Min,
        int24 tickLower,
        int24 tickUpper
    ) external nonReentrant returns (
        uint256 amount0,
        uint256 amount1,
        uint256 liquidity
    ) {
        require(amount0Desired > 0 && amount1Desired > 0, "Invalid amounts");
        require(tickLower < tickUpper, "Invalid tick range");
        require(tickLower >= MIN_TICK && tickUpper <= MAX_TICK, "Tick out of range");
        
        // Calculate optimal amounts based on current reserves
        if (reserve0 == 0 && reserve1 == 0) {
            // First liquidity provider
            amount0 = amount0Desired;
            amount1 = amount1Desired;
            liquidity = sqrt(amount0 * amount1);
            currentTick = 0; // Initialize at middle
        } else {
            // Subsequent providers - maintain ratio
            uint256 amount1Optimal = (amount0Desired * reserve1) / reserve0;
            
            if (amount1Optimal <= amount1Desired) {
                require(amount1Optimal >= amount1Min, "Insufficient token1");
                amount0 = amount0Desired;
                amount1 = amount1Optimal;
            } else {
                uint256 amount0Optimal = (amount1Desired * reserve0) / reserve1;
                require(amount0Optimal >= amount0Min, "Insufficient token0");
                amount0 = amount0Optimal;
                amount1 = amount1Desired;
            }
            
            // Calculate liquidity proportional to pool
            liquidity = min(
                (amount0 * totalSupply()) / reserve0,
                (amount1 * totalSupply()) / reserve1
            );
        }
        
        require(liquidity > 0, "Insufficient liquidity minted");
        
        // Transfer tokens
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        
        // Update reserves
        reserve0 += amount0;
        reserve1 += amount1;
        
        // Update price
        price = (reserve1 * 1e18) / reserve0;
        
        // Mint LP tokens
        _mint(msg.sender, liquidity);
        
        // Update position
        Position storage position = positions[msg.sender];
        position.liquidity += liquidity;
        position.tickLower = tickLower;
        position.tickUpper = tickUpper;
        
        emit Mint(msg.sender, msg.sender, amount0, amount1, liquidity);
    }
    
    /**
     * @notice Remove liquidity from the pool
     */
    function removeLiquidity(
        uint256 liquidity
    ) external nonReentrant returns (uint256 amount0, uint256 amount1) {
        require(liquidity > 0, "Invalid liquidity");
        require(balanceOf(msg.sender) >= liquidity, "Insufficient balance");
        
        uint256 totalLiquidity = totalSupply();
        
        // Calculate amounts proportional to liquidity
        amount0 = (liquidity * reserve0) / totalLiquidity;
        amount1 = (liquidity * reserve1) / totalLiquidity;
        
        require(amount0 > 0 && amount1 > 0, "Insufficient liquidity burned");
        
        // Burn LP tokens
        _burn(msg.sender, liquidity);
        
        // Update reserves
        reserve0 -= amount0;
        reserve1 -= amount1;
        
        // Update price if reserves remain
        if (reserve0 > 0 && reserve1 > 0) {
            price = (reserve1 * 1e18) / reserve0;
        }
        
        // Transfer tokens back
        IERC20(token0).transfer(msg.sender, amount0);
        IERC20(token1).transfer(msg.sender, amount1);
        
        // Update position
        Position storage position = positions[msg.sender];
        position.liquidity -= liquidity;
        
        emit Burn(msg.sender, amount0, amount1, liquidity);
    }
    
    /**
     * @notice Swap tokens
     */
    function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin
    ) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "Invalid amount");
        require(tokenIn == token0 || tokenIn == token1, "Invalid token");
        
        bool isToken0 = tokenIn == token0;
        
        // Calculate output amount with fee (constant product formula)
        uint256 amountInWithFee = amountIn * (10000 - fee);
        
        if (isToken0) {
            // Swapping token0 for token1
            amountOut = (amountInWithFee * reserve1) / (reserve0 * 10000 + amountInWithFee);
            require(amountOut >= amountOutMin, "Insufficient output");
            require(amountOut < reserve1, "Insufficient liquidity");
            
            // Transfer tokens
            IERC20(token0).transferFrom(msg.sender, address(this), amountIn);
            IERC20(token1).transfer(msg.sender, amountOut);
            
            // Update reserves
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            // Swapping token1 for token0
            amountOut = (amountInWithFee * reserve0) / (reserve1 * 10000 + amountInWithFee);
            require(amountOut >= amountOutMin, "Insufficient output");
            require(amountOut < reserve0, "Insufficient liquidity");
            
            // Transfer tokens
            IERC20(token1).transferFrom(msg.sender, address(this), amountIn);
            IERC20(token0).transfer(msg.sender, amountOut);
            
            // Update reserves
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }
        
        // Update price
        price = (reserve1 * 1e18) / reserve0;
        
        emit Swap(
            msg.sender,
            msg.sender,
            isToken0 ? int256(amountIn) : -int256(amountOut),
            isToken0 ? -int256(amountOut) : int256(amountIn),
            price
        );
    }
    
    /**
     * @notice Get quote for swap
     */
    function getQuote(
        address tokenIn,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        require(tokenIn == token0 || tokenIn == token1, "Invalid token");
        
        uint256 amountInWithFee = amountIn * (10000 - fee);
        
        if (tokenIn == token0) {
            amountOut = (amountInWithFee * reserve1) / (reserve0 * 10000 + amountInWithFee);
        } else {
            amountOut = (amountInWithFee * reserve0) / (reserve1 * 10000 + amountInWithFee);
        }
    }
    
    // Helper functions
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}