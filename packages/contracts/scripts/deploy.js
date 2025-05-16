const hre = require("hardhat");

async function main() {
  console.log("Deploying Medilocker contracts...");

  // Get contract factories
  const BaseNameResolver = await hre.ethers.getContractFactory("BaseNameResolver");
  const AccessControl = await hre.ethers.getContractFactory("AccessControl");
  const ChainlinkOracle = await hre.ethers.getContractFactory("ChainlinkOracle");
  const MedicalRecordRegistry = await hre.ethers.getContractFactory("MedicalRecordRegistry");

  // Get deployment parameters
  const chainlinkRouter = process.env.CHAINLINK_ROUTER || "0x0000000000000000000000000000000000000000";
  const chainlinkDonId = process.env.CHAINLINK_DON_ID || "0x0000000000000000000000000000000000000000000000000000000000000000";
  const chainlinkSubscriptionId = process.env.CHAINLINK_SUBSCRIPTION_ID || "0";

  // Deploy BaseNameResolver
  console.log("Deploying BaseNameResolver...");
  const baseNameResolver = await BaseNameResolver.deploy();
  await baseNameResolver.waitForDeployment();
  console.log(`BaseNameResolver deployed to: ${await baseNameResolver.getAddress()}`);

  // Deploy AccessControl
  console.log("Deploying AccessControl...");
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  console.log(`AccessControl deployed to: ${await accessControl.getAddress()}`);

  // Deploy ChainlinkOracle
  console.log("Deploying ChainlinkOracle...");
  const chainlinkOracle = await ChainlinkOracle.deploy(
    chainlinkRouter,
    chainlinkDonId,
    chainlinkSubscriptionId
  );
  await chainlinkOracle.waitForDeployment();
  console.log(`ChainlinkOracle deployed to: ${await chainlinkOracle.getAddress()}`);

  // Deploy MedicalRecordRegistry
  console.log("Deploying MedicalRecordRegistry...");
  const medicalRecordRegistry = await MedicalRecordRegistry.deploy(await accessControl.getAddress());
  await medicalRecordRegistry.waitForDeployment();
  console.log(`MedicalRecordRegistry deployed to: ${await medicalRecordRegistry.getAddress()}`);

  console.log("All contracts deployed successfully!");
  
  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log(`BaseNameResolver: ${await baseNameResolver.getAddress()}`);
  console.log(`AccessControl: ${await accessControl.getAddress()}`);
  console.log(`ChainlinkOracle: ${await chainlinkOracle.getAddress()}`);
  console.log(`MedicalRecordRegistry: ${await medicalRecordRegistry.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 