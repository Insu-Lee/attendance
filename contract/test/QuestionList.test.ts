import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('QuestionList', function () {
  let Token: any;
  let QuestionList: any;
  let token: any;
  let questionList: any;
  let owner: any;
  let student: any;
  let other: any;

  const QUESTION_FEE = ethers.parseEther('1');

  beforeEach(async function () {
    [owner, student, other] = await ethers.getSigners();

    Token = await ethers.getContractFactory('AttendanceToken');
    token = await Token.deploy();
    await token.waitForDeployment();

    await token.transfer(student.address, QUESTION_FEE);

    const QuestionListFactory = await ethers.getContractFactory('QuestionList');
    questionList = await QuestionListFactory.deploy(token.target);
  });

  it('질문 작성 시 토큰 전송 및 저장 확인', async function () {
    await token.connect(student).approve(questionList.target, QUESTION_FEE);

    const tx = await questionList
      .connect(owner)
      .question(student.address, 'What is Solidity?');
    await tx.wait();

    const result = await questionList.getQuestions(student.address);
    expect(result.length).to.equal(1);
    expect(result[0]).to.equal('What is Solidity?');

    const balance = await token.balanceOf(questionList.target);
    expect(balance).to.equal(QUESTION_FEE);
  });

  it('질문 시 student가 zero address이면 실패', async function () {
    await expect(questionList.connect(owner).question(student.address, 'Hi')).to
      .be.reverted;
  });

  it('질문 시 내용이 비어있으면 실패', async function () {
    await expect(
      questionList.connect(owner).question(student.address, '')
    ).to.be.revertedWith('No questions available.');
  });

  it('토큰 잔액 부족 시 전송 실패', async function () {
    await token.transfer(other.address, QUESTION_FEE);

    await expect(questionList.connect(owner).question(student.address, 'Hi')).to
      .be.reverted;
  });

  it('withDrawToken 실행 시 컨트랙트 보유 토큰이 owner에게 이동', async function () {
    await token.connect(student).approve(questionList.target, QUESTION_FEE);
    await questionList.connect(owner).question(student.address, 'Who are you?');

    const ownerBalanceBefore = await token.balanceOf(owner.address);

    const tx = await questionList.connect(owner).withDrawToken();
    await tx.wait();

    const ownerBalanceAfter = await token.balanceOf(owner.address);
    expect(ownerBalanceAfter).to.be.greaterThan(ownerBalanceBefore);
  });

  it('출금 시 컨트랙트 잔액이 0이면 실패', async function () {
    await expect(
      questionList.connect(owner).withDrawToken()
    ).to.be.revertedWith('Insufficient balance.');
  });
});
