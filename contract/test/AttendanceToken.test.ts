import { expect } from 'chai';
import { ethers, network } from 'hardhat';

describe('AttendanceToken 구현 테스트', function () {
  let token: any;
  let relayer: any;
  let owner: any;
  let otherAccount: any;
  const provider = ethers.provider;

  const permit = async (deadline?: number) => {
    const ownerBalance = await token.balanceOf(owner.address);

    if (!deadline) {
      deadline = Math.floor(Date.now() / 1000) + 3600;
    }

    const nonce = await token.nonces(owner.address);
    const domain = {
      name: 'MyGasslessToken',
      version: '1',
      chainId: (await provider.getNetwork()).chainId,
      verifyingContract: token.target,
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
      spender: otherAccount.address,
      value: ownerBalance,
      nonce: nonce,
      deadline: deadline,
    };

    const signature = await owner.signTypedData(domain, types, message);

    const { v, r, s } = ethers.Signature.from(signature);

    const permit = await token.permitWithDailyLimit(
      message.owner,
      message.spender,
      message.value,
      message.deadline,
      v,
      r,
      s
    );
    await permit.wait();

    return ownerBalance;
  };

  beforeEach(async function () {
    [relayer, owner, otherAccount] = await ethers.getSigners();
    const AttendanceTokenFactory =
      await ethers.getContractFactory('AttendanceToken');
    token = await AttendanceTokenFactory.deploy();
    await token.waitForDeployment();

    const transfer = await token.transfer(
      owner.address,
      ethers.parseEther('1000')
    );

    await transfer.wait();
  });

  it('초기 토큰은 relayer가 보유하고 있어야 합니다.', async function () {
    const balance = await token.balanceOf(relayer.address);

    expect(typeof balance).to.equal('bigint');
    expect(balance).to.be.greaterThan(0n);
  });

  it('permitWithDailyLimit 함수로 permit 실행이 가능해야 합니다.', async function () {
    const result = await permit();

    const allowance = await token.allowance(
      owner.address,
      otherAccount.address
    );

    expect(typeof allowance).to.equal('bigint');
    expect(allowance).to.equal(result);
  });

  it('daliyLimit으로 인하여 permitWithDailyLimit이 하루에 두 번 이상 실행되지 않아야 합니다.', async function () {
    await permit();

    await expect(permit()).to.be.revertedWith(
      'Limit reached. Please try again later.'
    );
  });

  it('daliyLimit 이후 하루가 지나면 permitWithDailyLimit이 다시 실행 가능해야 합니다.', async function () {
    await permit();

    await expect(permit()).to.be.revertedWith(
      'Limit reached. Please try again later.'
    );

    await network.provider.send('evm_increaseTime', [86400]);
    await network.provider.send('evm_mine');

    const block = await ethers.provider.getBlock('latest');
    if (!block) throw new Error('Block not found');

    const newDeadline = block.timestamp + 3600;
    const result = await permit(newDeadline);
    const allowance = await token.allowance(
      owner.address,
      otherAccount.address
    );

    expect(allowance).to.equal(result);
  });
});
