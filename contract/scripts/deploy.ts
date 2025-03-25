import { ethers } from 'hardhat';
import { makeAbi } from './abiGenerator';

async function main() {
  const tokenContractName = 'AttendanceToken';
  const questionListName = 'QuestionList';

  console.log(`Deploying contracts`);

  const tokenContractFactory =
    await ethers.getContractFactory(tokenContractName);
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.waitForDeployment();

  const questionListFactory = await ethers.getContractFactory(questionListName);
  const questionList = await questionListFactory.deploy(tokenContract.target);
  await questionList.waitForDeployment();

  console.log(`${tokenContractName} deployed at: ${tokenContract.target}`);
  console.log(`${questionListName} deployed at: ${questionList.target}`);

  await makeAbi(`${tokenContractName}`, tokenContract.target);
  await makeAbi(`${questionListName}`, questionList.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
