import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const ARTIFACTS_DIR = path.join(ROOT_DIR, "artifacts/contracts");
const FRONTEND_ABIS_DIR = path.join(ROOT_DIR, "src/contracts/abis");

function getAbi(contractPath, contractName) {
    const artifactPath = path.join(ARTIFACTS_DIR, contractPath, `${contractName}.json`);
    if (!fs.existsSync(artifactPath)) {
        console.error(`❌ Artifact not found: ${artifactPath}`);
        return null;
    }
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    return artifact.abi;
}

function writeAbiTs(filename, variableName, abi) {
    const content = `export const ${variableName} = ${JSON.stringify(abi, null, 4)} as const;\n`;
    fs.writeFileSync(path.join(FRONTEND_ABIS_DIR, filename), content);
    console.log(`✅ Updated ${filename}`);
}

async function main() {
    console.log("🔄 Updating Frontend ABIs...");

    // 1. Factory ABI
    const factoryAbi = getAbi("core/DEXFactory.sol", "DEXFactory");
    if (factoryAbi) writeAbiTs("FactoryABI.ts", "FACTORY_ABI", factoryAbi);

    // 2. Pool ABI
    const poolAbi = getAbi("core/DEXPool.sol", "DEXPool");
    if (poolAbi) writeAbiTs("PoolABI.ts", "POOL_ABI", poolAbi);

    // 3. Router ABI (New)
    // Check if RouterABI.ts exists, if not create it
    const routerAbi = getAbi("periphery/DEXRouter.sol", "DEXRouter");
    if (routerAbi) writeAbiTs("RouterABI.ts", "ROUTER_ABI", routerAbi);

    // 4. ERC20 ABI (from TestToken)
    const tokenAbi = getAbi("TestToken.sol", "TestToken");
    if (tokenAbi) writeAbiTs("ERC20ABI.ts", "ERC20_ABI", tokenAbi);

    console.log("\n✨ Frontend ABIs updated successfully!");
}

main();
