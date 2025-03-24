import { ethers } from 'hardhat';
import { makeAbi } from './abiGenerator';

async function main() {
  const tokenContractName = 'AttendanceToken';

  console.log(`Deploying contracts`);

  const tokenContractFactory =
    await ethers.getContractFactory(tokenContractName);
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.waitForDeployment();

  console.log(`Contract deployed at: ${tokenContract.target}`);
  await makeAbi(`${tokenContractName}`, tokenContract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
