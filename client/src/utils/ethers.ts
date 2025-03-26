import { ethers } from 'ethers';
import attendanceTokenJson from '../abis/AttendanceToken.json';
import QuestionList from '../abis/QuestionList.json';

const { abi: tokenAbi, address: tokenAddress } = attendanceTokenJson;
const { abi: questionListAbi, address: questionListAddress } = QuestionList;

const provider = new ethers.JsonRpcProvider(
  'https://public-en-kairos.node.kaia.io	'
);

export const relayer = new ethers.Wallet(
  process.env.REACT_APP_RELAYER_PRIVATE_KEY || '',
  provider
);

const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, relayer);
const questionList = new ethers.Contract(
  questionListAddress,
  questionListAbi,
  relayer
);

export const createWallet = async () => {
  const wallet = ethers.Wallet.createRandom();
  return wallet;
};

export const importWallet = (privateKey: string) => {
  const wallet = new ethers.Wallet(privateKey);
  return wallet;
};

const symbol = async () => {
  const symbol = await tokenContract.symbol();
  return symbol;
};

export const getTokenBalance = async (address: string, permit?: boolean) => {
  const weiBalance = await tokenContract.balanceOf(address);
  const balance = ethers.formatEther(weiBalance);

  if (permit) {
    return weiBalance;
  } else {
    return `${Number(balance)} ${await symbol()}`;
  }
};

export const dailyLimit = async (address: string) => {
  const userCallData = await tokenContract.userCallData(address);
  return Number(userCallData[1]) === 0 ? true : false;
};

export const attendance = async (address: string) => {
  const attendance = await tokenContract.attendance(
    address,
    ethers.parseEther('10')
  );
  const receipt = await attendance.wait();
  if (receipt.status === 1) {
    return true;
  } else {
    return false;
  }
};

export const permit = async (privateKey: string) => {
  const owner = importWallet(privateKey);
  const ownerBalance = await getTokenBalance(owner.address, true);

  const deadline = Math.floor(Date.now() / 1000) + 3600;
  const nonce = await tokenContract.nonces(owner.address);
  const name = await tokenContract.name();

  const domain = {
    name: name,
    version: '1',
    chainId: (await provider.getNetwork()).chainId,
    verifyingContract: tokenAddress,
  };

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };

  const message = {
    owner: owner.address,
    spender: questionListAddress,
    value: ownerBalance,
    nonce: nonce,
    deadline: deadline,
  };

  const signature = await owner.signTypedData(domain, types, message);

  const { v, r, s } = ethers.Signature.from(signature);

  const permit = await tokenContract.permit(
    message.owner,
    message.spender,
    message.value,
    message.deadline,
    v,
    r,
    s
  );
  const receipt = await permit.wait();

  if (receipt.status === 1) {
    return true;
  } else {
    return false;
  }
};

export const getStudents = async () => {
  const allStudents = questionList.getAllStudents();
  return allStudents;
};

export const question = async (address: string, _question: string) => {
  const question = await questionList.question(address, _question);
  const receipt = await question.wait();
  if (receipt.status === 1) {
    return true;
  } else {
    return false;
  }
};

export const getQuestions = async () => {
  const result: Record<string, string[]> = {};
  const students = await getStudents();

  try {
    for (const student of students) {
      const questions: string[] = await questionList.getQuestions(student);
      result[student] = questions;
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};
