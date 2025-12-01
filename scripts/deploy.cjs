const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 Starting DEX V3 Deployment...\n");

    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("");

    // 1. Deploy Factory
    console.log("📦 Deploying DEXFactory...");
    const DEXFactory = await hre.ethers.getContractFactory("DEXFactory");
    const factory = await DEXFactory.deploy();
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("✅ DEXFactory deployed to:", factoryAddress);
    console.log("");

    // 2. Deploy Router
    console.log("📦 Deploying DEXRouter...");
    const DEXRouter = await hre.ethers.getContractFactory("DEXRouter");
    const router = await DEXRouter.deploy(factoryAddress);
    await router.waitForDeployment();
    const routerAddress = await router.getAddress();
    console.log("✅ DEXRouter deployed to:", routerAddress);
    console.log("");

    // 3. Deploy Test Tokens
    console.log("📦 Deploying Test Tokens...");
    const TestToken = await hre.ethers.getContractFactory("TestToken");

    const tokenA = await TestToken.deploy("Token A", "TKA", 1000000);
    await tokenA.waitForDeployment();
    const tokenAAddress = await tokenA.getAddress();
    console.log("✅ Token A deployed to:", tokenAAddress);

    const tokenB = await TestToken.deploy("Token B", "TKB", 1000000);
    await tokenB.waitForDeployment();
    const tokenBAddress = await tokenB.getAddress();
    console.log("✅ Token B deployed to:", tokenBAddress);

    const tokenC = await TestToken.deploy("Token C", "TKC", 1000000);
    await tokenC.waitForDeployment();
    const tokenCAddress = await tokenC.getAddress();
    console.log("✅ Token C deployed to:", tokenCAddress);
    console.log("");

    // 4. Create initial pools
    console.log("🏊 Creating liquidity pools...");

    // Pool 1: Token A - Token B (Medium fee)
    console.log("Creating pool: TKA-TKB with 0.05% fee...");
    const tx1 = await factory.createPool(tokenAAddress, tokenBAddress, 500);
    await tx1.wait();
    const poolAB = await factory.getPool(tokenAAddress, tokenBAddress, 500);
    console.log("✅ Pool TKA-TKB created at:", poolAB);

    // Pool 2: Token B - Token C (Low fee)
    console.log("Creating pool: TKB-TKC with 0.01% fee...");
    const tx2 = await factory.createPool(tokenBAddress, tokenCAddress, 100);
    await tx2.wait();
    const poolBC = await factory.getPool(tokenBAddress, tokenCAddress, 100);
    console.log("✅ Pool TKB-TKC created at:", poolBC);

    // Pool 3: Token A - Token C (High fee)
    console.log("Creating pool: TKA-TKC with 0.3% fee...");
    const tx3 = await factory.createPool(tokenAAddress, tokenCAddress, 3000);
    await tx3.wait();
    const poolAC = await factory.getPool(tokenAAddress, tokenCAddress, 3000);
    console.log("✅ Pool TKA-TKC created at:", poolAC);
    console.log("");

    // 5. Summary
    console.log("=".repeat(60));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📋 Contract Addresses:");
    console.log("   Factory:", factoryAddress);
    console.log("   Router:", routerAddress);
    console.log("   Token A (TKA):", tokenAAddress);
    console.log("   Token B (TKB):", tokenBAddress);
    console.log("   Token C (TKC):", tokenCAddress);
    console.log("   Pool TKA-TKB:", poolAB);
    console.log("   Pool TKB-TKC:", poolBC);
    console.log("   Pool TKA-TKC:", poolAC);
    console.log("\n💡 Next Steps:");
    console.log("   1. Copy these addresses to your frontend");
    console.log("   2. Add liquidity to pools");
    console.log("   3. Test token swaps");
    console.log("   4. Run: npx hardhat test");
    console.log("=".repeat(60));

    // Save addresses to file
    const addresses = {
        network: "localhost",
        chainId: 31337,
        contracts: {
            factory: factoryAddress,
            router: routerAddress
        },
        tokens: {
            TKA: {
                address: tokenAAddress,
                name: "Token A",
                symbol: "TKA",
                decimals: 18
            },
            TKB: {
                address: tokenBAddress,
                name: "Token B",
                symbol: "TKB",
                decimals: 18
            },
            TKC: {
                address: tokenCAddress,
                name: "Token C",
                symbol: "TKC",
                decimals: 18
            }
        },
        pools: {
            "TKA-TKB": {
                address: poolAB,
                token0: tokenAAddress,
                token1: tokenBAddress,
                fee: 500
            },
            "TKB-TKC": {
                address: poolBC,
                token0: tokenBAddress,
                token1: tokenCAddress,
                fee: 100
            },
            "TKA-TKC": {
                address: poolAC,
                token0: tokenAAddress,
                token1: tokenCAddress,
                fee: 3000
            }
        }
    };

    // Save to JSON
    fs.writeFileSync(
        "deployed-addresses.json",
        JSON.stringify(addresses, null, 2)
    );
    console.log("\n📄 Addresses saved to deployed-addresses.json");

    // Also save as TypeScript for frontend
    const tsContent = `// Auto-generated by deployment script
export const CONTRACTS = ${JSON.stringify(addresses, null, 2)};

export const FACTORY_ADDRESS = "${factoryAddress}";
export const ROUTER_ADDRESS = "${routerAddress}";

export const TOKENS = {
  TKA: "${tokenAAddress}",
  TKB: "${tokenBAddress}",
  TKC: "${tokenCAddress}"
};

export const POOLS = {
  "TKA-TKB": "${poolAB}",
  "TKB-TKC": "${poolBC}",
  "TKA-TKC": "${poolAC}"
};
`;

    fs.writeFileSync("deployed-addresses.ts", tsContent);
    console.log("📄 Addresses saved to deployed-addresses.ts (for frontend)");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });