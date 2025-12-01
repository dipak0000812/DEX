// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../core/DEXFactory.sol";
import "../core/DEXPool.sol";

/**
 * @title DEXRouter
 * @notice Router for interacting with DEX pools
 */
contract DEXRouter {
    address public immutable factory;
    
    event SwapExecuted(
        address indexed sender,
        address[] path,
        uint256[] amounts
    );
    
    constructor(address _factory) {
        factory = _factory;
    }
    
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint24 fee,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        int24 tickLower,
        int24 tickUpper,
        address to,
        uint256 deadline
    ) external returns (uint256 amount0, uint256 amount1, uint256 liquidity) {
        require(deadline >= block.timestamp, "Expired");
        
        address pool = getPool(tokenA, tokenB, fee);
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        
        (uint256 amountA, uint256 amountB) = tokenA == token0
            ? (amountADesired, amountBDesired)
            : (amountBDesired, amountADesired);
        
        IERC20(token0).transferFrom(msg.sender, address(this), amountA);
        IERC20(token1).transferFrom(msg.sender, address(this), amountB);
        IERC20(token0).approve(pool, amountA);
        IERC20(token1).approve(pool, amountB);
        
        (amount0, amount1, liquidity) = DEXPool(pool).addLiquidity(
            amountA, amountB, tokenA == token0 ? amountAMin : amountBMin,
            tokenA == token0 ? amountBMin : amountAMin, tickLower, tickUpper
        );
        
        IERC20(pool).transfer(to, liquidity);
        
        if (amountA > amount0) IERC20(token0).transfer(msg.sender, amountA - amount0);
        if (amountB > amount1) IERC20(token1).transfer(msg.sender, amountB - amount1);
    }
    
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint24 fee,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB) {
        require(deadline >= block.timestamp, "Expired");
        address pool = getPool(tokenA, tokenB, fee);
        IERC20(pool).transferFrom(msg.sender, address(this), liquidity);
        (uint256 amount0, uint256 amount1) = DEXPool(pool).removeLiquidity(liquidity);
        (address token0, ) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
        require(amountA >= amountAMin && amountB >= amountBMin, "Insufficient output");
        IERC20(tokenA).transfer(to, amountA);
        IERC20(tokenB).transfer(to, amountB);
    }
    
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        uint24[] calldata fees,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {
        require(deadline >= block.timestamp, "Expired");
        require(path.length >= 2 && path.length == fees.length + 1, "Invalid path");
        
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);
        
        for (uint256 i = 0; i < path.length - 1; i++) {
            address pool = getPool(path[i], path[i + 1], fees[i]);
            IERC20(path[i]).approve(pool, amounts[i]);
            amounts[i + 1] = DEXPool(pool).swap(path[i], amounts[i], 0);
        }
        
        require(amounts[path.length - 1] >= amountOutMin, "Insufficient output");
        IERC20(path[path.length - 1]).transfer(to, amounts[path.length - 1]);
        emit SwapExecuted(msg.sender, path, amounts);
    }
    
    function getAmountsOut(
        uint256 amountIn,
        address[] calldata path,
        uint24[] calldata fees
    ) external view returns (uint256[] memory amounts) {
        require(path.length >= 2 && path.length == fees.length + 1, "Invalid path");
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        for (uint256 i = 0; i < path.length - 1; i++) {
            address pool = getPool(path[i], path[i + 1], fees[i]);
            amounts[i + 1] = DEXPool(pool).getQuote(path[i], amounts[i]);
        }
    }
    
    function getPool(address tokenA, address tokenB, uint24 fee) public view returns (address) {
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        address pool = DEXFactory(factory).getPool(token0, token1, fee);
        require(pool != address(0), "Pool does not exist");
        return pool;
    }
}