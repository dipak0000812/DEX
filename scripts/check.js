import hre from "hardhat";
// import { ethers } from "hardhat"; // This might fail if not exported

console.log("HRE keys:", Object.keys(hre));

try {
    const { ethers } = await import("hardhat");
    console.log("Ethers from import:", !!ethers);
} catch (e) {
    console.log("Import failed:", e.message);
}
