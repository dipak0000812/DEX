import hre from "hardhat";
import fs from "fs";

async function main() {
    console.log("🔄 Starting DEX Interaction...\n");

    // Load deployed addresses
    const addressesJson = fs.readFileSync("deployed-addresses.json", "utf8");
    const addresses = JSON.parse(addressesJson);

    const [user] = await hre.ethers.getSigners();
    console.log("Using account:", user.address);
    // console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(user.address)), "ETH\n");

    // Get contracts
    const factory = await hre.ethers.getContractAt("DEXFactory", addresses.contracts.factory);
    const router = await hre.ethers.getContractAt("DEXRouter", addresses.contracts.router);
    const tokenA = await hre.ethers.getContractAt("TestToken", addresses.tokens.TKA.address);
    const tokenB = await hre.ethers.getContractAt("TestToken", addresses.tokens.TKB.address);
    const tokenC = await hre.ethers.getContractAt("TestToken", addresses.tokens.TKC.address);
    const pool = await hre.ethers.getContractAt("DEXPool", addresses.pools["TKA-TKB"].address);

    // Check balances
    console.log("📊 Token Balances:");
    console.log("   TKA:", hre.ethers.formatEther(await tokenA.balanceOf(user.address)));
    console.log("   TKB:", hre.ethers.formatEther(await tokenB.balanceOf(user.address)));
    console.log("   TKC:", hre.ethers.formatEther(await tokenC.balanceOf(user.address)), "\n");

    // Add Liquidity
    console.log("💧 Adding Liquidity to TKA-TKB pool...");
    const amount = hre.ethers.parseEther("1000");

    await tokenA.approve(await pool.getAddress(), amount);
    await tokenB.approve(await pool.getAddress(), amount);

    const addLiqTx = await pool.addLiquidity(amount, amount, 0, 0, -887272, 887272);
    await addLiqTx.wait();

    const lpBalance = await pool.balanceOf(user.address);
    console.log("✅ Liquidity added! LP tokens:", hre.ethers.formatEther(lpBalance), "\n");

    // Check Pool State
    console.log("🏊 Pool State:");
    const reserve0 = await pool.reserve0();
    const reserve1 = await pool.reserve1();
    console.log("   Reserve TKA:", hre.ethers.formatEther(reserve0));
    console.log("   Reserve TKB:", hre.ethers.formatEther(reserve1), "\n");

    // Swap
    console.log("💱 Swapping 100 TKA for TKB...");
    const swapAmount = hre.ethers.parseEther("100");

    await tokenA.approve(await pool.getAddress(), swapAmount);
    const swapTx = await pool.swap(await tokenA.getAddress(), swapAmount, 0);
    await swapTx.wait();

    console.log("✅ Swap completed!\n");

    // Final balances
    console.log("📊 Final Balances:");
    console.log("   TKA:", hre.ethers.formatEther(await tokenA.balanceOf(user.address)));
    console.log("   TKB:", hre.ethers.formatEther(await tokenB.balanceOf(user.address)));
    console.log("   LP Tokens:", hre.ethers.formatEther(await pool.balanceOf(user.address)));

    console.log("\n✅ All interactions completed!\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });