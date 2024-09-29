import hre, { ethers, upgrades } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Ezrah Link", function () {
  // async function deployEzrahLink() {
  //   const [owner, otherAccount] = await ethers.getSigners();
  //
  //   const EzrahLink = await hre.ethers.getContractFactory("EzrahLink");
  //   const ezrahLink = await EzrahLink.deploy();
  //
  //   return { ezrahLink };
  // }

  async function deployEzrahLink() {
    const [owner, pauser, minter] = await ethers.getSigners(); // Get the required signers

    // Use `upgrades.deployProxy` instead of `deploy`
    const EzrahLink = await hre.ethers.getContractFactory("EzrahLink");
    const ezrahLink = await upgrades.deployProxy(
      EzrahLink,
      [owner.address, owner.address, owner.address], // Pass parameters to the initialize function
      { initializer: "initialize" }
    );

    return { ezrahLink, owner };
  }

  describe("Deployment", function () {
    it("Should deploy with a balance of 1 billion tokens minted", async function () {
      const { ezrahLink } = await loadFixture(deployEzrahLink);

      let [owner] = await ethers.getSigners();
      console.log(await owner.getAddress());
      console.log(await ezrahLink.getAddress());
      console.log(await ezrahLink.balanceOf(await owner.getAddress()));
      console.log(await ezrahLink.balanceOf(await ezrahLink.getAddress()));

      const expectedBalance = BigInt(1000000000) * BigInt(10 ** 18);
      expect(await ezrahLink.balanceOf(await owner.getAddress())).to.equal(
        expectedBalance
      );
    });
  });
});
