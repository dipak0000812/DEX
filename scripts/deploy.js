import hre from "hardhat";
import fs from "fs";

async function main() {
    console.log("🚀 Starting DEX V3 Deployment...\n");

    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    // console.log("Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

    // 1. Deploy Factory
    console.log("📦 Deploying DEXFactory...");
    const DEXFactory = await hre.ethers.getContractFactory("DEXFactory");
    const factory = await DEXFactory.deploy();
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("✅ DEXFactory deployed to:", factoryAddress, "\n");

    // 2. Deploy Router
    console.log("📦 Deploying DEXRouter...");
    const DEXRouter = await hre.ethers.getContractFactory("DEXRouter");
    const router = await DEXRouter.deploy(factoryAddress);
    await router.waitForDeployment();
    const routerAddress = await router.getAddress();
    console.log("✅ DEXRouter deployed to:", routerAddress, "\n");

    // 3. Deploy Test Tokens
    console.log("📦 Deploying Test Tokens...");
    const TestToken = await hre.ethers.getContractFactory("TestToken");

    const tokenA = await TestToken.deploy("Token A", "TKA", 1000000);
    await tokenA.waitForDeployment();
    const tokenAAddress = await tokenA.getAddress();
    console.log("✅ Token A (TKA) deployed to:", tokenAAddress);

    const tokenB = await TestToken.deploy("Token B", "TKB", 1000000);
    await tokenB.waitForDeployment();
    const tokenBAddress = await tokenB.getAddress();
    console.log("✅ Token B (TKB) deployed to:", tokenBAddress);

    const tokenC = await TestToken.deploy("Token C", "TKC", 1000000);
    await tokenC.waitForDeployment();
    const tokenCAddress = await tokenC.getAddress();
    console.log("✅ Token C (TKC) deployed to:", tokenCAddress, "\n");

    // 4. Create Pools
    console.log("🏊 Creating liquidity pools...");

    // Pool 1: TKA-TKB (0.05% fee)
    console.log("Creating pool: TKA-TKB (0.05% fee)...");
    let tx = await factory.createPool(tokenAAddress, tokenBAddress, 500);
    await tx.wait();
    const poolAB = await factory.getPool(tokenAAddress, tokenBAddress, 500);
    console.log("✅ Pool TKA-TKB:", poolAB);

    // Pool 2: TKB-TKC (0.01% fee)
    console.log("Creating pool: TKB-TKC (0.01% fee)...");
    tx = await factory.createPool(tokenBAddress, tokenCAddress, 100);
    await tx.wait();
    const poolBC = await factory.getPool(tokenBAddress, tokenCAddress, 100);
    console.log("✅ Pool TKB-TKC:", poolBC);

    // Pool 3: TKA-TKC (0.3% fee)
    console.log("Creating pool: TKA-TKC (0.3% fee)...");
    tx = await factory.createPool(tokenAAddress, tokenCAddress, 3000);
    await tx.wait();
    const poolAC = await factory.getPool(tokenAAddress, tokenCAddress, 3000);
    console.log("✅ Pool TKA-TKC:", poolAC, "\n");

    // 5. Summary
    console.log("=".repeat(70));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(70));
    console.log("\n📋 CONTRACT ADDRESSES:\n");
    console.log("Factory:       ", factoryAddress);
    console.log("Router:        ", routerAddress);
    console.log("\nTokens:");
    console.log("  Token A (TKA):", tokenAAddress);
    console.log("  Token B (TKB):", tokenBAddress);
    console.log("  Token C (TKC):", tokenCAddress);
    console.log("\nPools:");
    console.log("  TKA-TKB (0.05%):", poolAB);
    console.log("  TKB-TKC (0.01%):", poolBC);
    console.log("  TKA-TKC (0.3%):", poolAC);
    console.log("\n" + "=".repeat(70));

    // 6. Save addresses
    const addresses = {
        network: "localhost",
        chainId: 31337,
        contracts: {
            factory: factoryAddress,
            router: routerAddress,
        },
        tokens: {
            TKA: {
                address: tokenAAddress,
                name: "Token A",
                symbol: "TKA",
                decimals: 18,
            },
            TKB: {
                address: tokenBAddress,
                name: "Token B",
                symbol: "TKB",
                decimals: 18,
            },
            TKC: {
                address: tokenCAddress,
                name: "Token C",
                symbol: "TKC",
                decimals: 18,
            },
        },
        pools: {
            "TKA-TKB": {
                address: poolAB,
                token0: tokenAAddress,
                token1: tokenBAddress,
                fee: 500,
            },
            "TKB-TKC": {
                address: poolBC,
                token0: tokenBAddress,
                token1: tokenCAddress,
                fee: 100,
            },
            "TKA-TKC": {
                address: poolAC,
                token0: tokenAAddress,
                token1: tokenCAddress,
                fee: 3000,
            },
        },
    };

    // Save as JSON
    fs.writeFileSync(
        "deployed-addresses.json",
        JSON.stringify(addresses, null, 2)
    );

    // Save as TypeScript for frontend
    const tsContent = `// Auto-generated by deployment script
// Network: ${addresses.network} (Chain ID: ${addresses.chainId})

export const DEPLOYED_ADDRESSES = ${JSON.stringify(addresses, null, 2)};

export const FACTORY_ADDRESS = "${factoryAddress}";
export const ROUTER_ADDRESS = "${routerAddress}";

export const TOKENS = {
  TKA: "${tokenAAddress}",
  TKB: "${tokenBAddress}",
  TKC: "${tokenCAddress}",
};

export const POOLS = {
  "TKA-TKB": "${poolAB}",
  "TKB-TKC": "${poolBC}",
  "TKA-TKC": "${poolAC}",
};
`;

    fs.writeFileSync("src/contracts/deployed-addresses.ts", tsContent);
    fs.writeFileSync("deployed-addresses.ts", tsContent);

    console.log("\n📄 Addresses saved to:");
    console.log("   - deployed-addresses.json");
    console.log("   - deployed-addresses.ts (for frontend)");
    console.log("\n💡 Next steps:");
    console.log("   1. Copy deployed-addresses.ts to your frontend");
    console.log("   2. Copy ABIs from artifacts/ to your frontend");
    console.log("   3. Start building your dApp!");
    console.log("\n✨ Happy coding!\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        fs.writeFileSync("deploy_error.txt", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        process.exit(1);
    });
