const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ownable", function () {
  it("sets deployer as owner", async function () {
    const [deployer] = await ethers.getSigners();

    const Ownable = await ethers.getContractFactory("Ownable");
    const ownable = await Ownable.deploy();

    expect(await ownable.owner()).to.equal(deployer.address);
  });

  it("prevents non-owner from transferring ownership", async function () {
    const [deployer, attacker] = await ethers.getSigners();

    const Ownable = await ethers.getContractFactory("Ownable");
    const ownable = await Ownable.deploy();

    await expect(
      ownable.connect(attacker).transferOwnership(attacker.address)
    ).to.be.revertedWith("NOT_OWNER");
  });

  it("allows owner to transfer ownership", async function () {
    const [deployer, newOwner] = await ethers.getSigners();

    const Ownable = await ethers.getContractFactory("Ownable");
    const ownable = await Ownable.deploy();

    await ownable.transferOwnership(newOwner.address);

    expect(await ownable.owner()).to.equal(newOwner.address);
  });

  it("emits OwnershipTransferred on transfer", async function () {
    const [deployer, newOwner] = await ethers.getSigners();

    const Ownable = await ethers.getContractFactory("Ownable");
    const ownable = await Ownable.deploy();

    await expect(ownable.transferOwnership(newOwner.address))
      .to.emit(ownable, "OwnershipTransferred")
      .withArgs(deployer.address, newOwner.address);
  });

  it("reverts on zero address newOwner", async function () {
    const [deployer] = await ethers.getSigners();

    const Ownable = await ethers.getContractFactory("Ownable");
    const ownable = await Ownable.deploy();

    await expect(
      ownable.transferOwnership(ethers.ZeroAddress)
    ).to.be.revertedWith("ZERO_ADDRESS");
  });

  it("reverts when transferring to the same owner", async function () {
    const [deployer] = await ethers.getSigners();

    const Ownable = await ethers.getContractFactory("Ownable");
    const ownable = await Ownable.deploy();

    await expect(
      ownable.transferOwnership(deployer.address)
    ).to.be.revertedWith("SAME_OWNER");
  });
});
