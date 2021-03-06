const { deployDat } = require("../datHelpers");
const { approveAll } = require("../helpers");
const { tokens } = require("hardlydifficult-eth");
const { constants } = require("../helpers");
const { expectRevert } = require("@openzeppelin/test-helpers");

contract("dat / collectInvestment", (accounts) => {
  it("shouldFail with DO_NOT_SEND_ETH", async () => {
    const token = await tokens.sai.deploy(web3, accounts[0]);
    const contracts = await deployDat(accounts, { currency: token.address });
    await approveAll(contracts, accounts);
    await token.mint(accounts[1], constants.MAX_UINT, {
      from: accounts[0],
    });
    await token.approve(contracts.dat.address, constants.MAX_UINT, {
      from: accounts[1],
    });
    await expectRevert(
      contracts.dat.buy(accounts[1], "100000000000000000000", 1, {
        from: accounts[1],
        value: 1,
      }),
      "DO_NOT_SEND_ETH"
    );
  });
});
