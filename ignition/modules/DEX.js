const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DEXModule", (m) => {
    // Deploy Factory
    const factory = m.contract("DEXFactory");

    // Deploy Router
    const router = m.contract("DEXRouter", [factory]);

    // Deploy Test Tokens
    const tokenA = m.contract("TestToken", ["Token A", "TKA", 1000000]);
    const tokenB = m.contract("TestToken", ["Token B", "TKB", 1000000]);
    const tokenC = m.contract("TestToken", ["Token C", "TKC", 1000000]);

    return { factory, router, tokenA, tokenB, tokenC };
});
