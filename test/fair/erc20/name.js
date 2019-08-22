const { shouldFail, deployDat, updateDatConfig } = require("../../helpers");

contract("fair / erc20 / name", accounts => {
  const maxLengthName =
    "Names are 64 characters max.....................................";
  let contracts;
  let tx;

  before(async () => {
    contracts = await deployDat(accounts);
  });

  it("should have an empty name by default name", async () => {
    assert.equal(await contracts.fair.name(), "");
  });

  describe("updateName", () => {
    describe("`control` can change name", () => {
      const newName = "New Name";

      before(async () => {
        tx = await updateDatConfig(contracts, { name: newName });
      });

      it("should have the new name", async () => {
        assert.equal(await contracts.fair.name(), newName);
      });

      it("should emit an event", async () => {
        const log = tx.logs[0];
        assert.notEqual(log, undefined);
        // assert.equal(log.event, 'NameUpdated');
        // assert.equal(log.args._previousName, name);
        // assert.equal(log.args._name, newName);
      });

      describe("max length", () => {
        before(async () => {
          tx = await updateDatConfig(contracts, { name: maxLengthName });
        });

        it("should have the new name", async () => {
          assert.equal(await contracts.fair.name(), maxLengthName);
        });

        it("should fail to update longer than the max", async () => {
          await shouldFail(
            updateDatConfig(contracts, {
              name: `${maxLengthName} more characters`
            })
          );
        });
      });
    });

    it.skip("should fail to change name from a different account", async () => {
      await shouldFail(
        updateDatConfig(contracts, { name: "Test" }, accounts[2]),
        "CONTROL_ONLY"
      );
    });
  });
});
