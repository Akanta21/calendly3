const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Set Rate", function () {
  let Contract, contract;
  let owner, addr1, addr2;

  beforeEach(async function() {
    [owner, addr1, addr2] = await ethers.getSigners();


    Contract = await ethers.getContractFactory("Calendly");
    contract = await Contract.deploy();
    await contract.deployed();
  })

  it("Should set the minutely rate", async function () {
    const setRateTx = await contract.setRate(100);

    // wait until the transaction is mined
    await setRateTx.wait();

    expect(await contract.getRate()).to.equal(100);
  });

  it("Should throw 'Only owner can set rate'", async function() {
      // get addresses
      const [owner, addr1, addr2] = await ethers.getSigners();

      // call setRate using a different account address
      // this should fail since this address is not the owner
  
      await expect(
        contract.connect(addr1).setRate(500)
      ).to.be.revertedWith('Only owner can set rate')
  })

  it("Should add two appts", async function() {
    const tx1 = await contract.setRate(ethers.utils.parseEther("0.001"));
    await tx1.wait();

    const tx2 = await contract.connect(addr1).createAppointment("Meeting Larry", 1644143400, 1644150600, {value: ethers.utils.parseEther("2")});
    await tx2.wait();

    const tx3 = await contract.connect(addr2).createAppointment("Breakfast at Tiffany's", 1644154200, 1644159600, {value: ethers.utils.parseEther("1.5")});
    await tx3.wait();

    const appointments = await contract.getAppointments()

    expect(appointments.length).to.equal(2)

    const ownerBalance = await ethers.provider.getBalance(owner.address);
    const addr1Balance = await ethers.provider.getBalance(addr1.address);
    const addr2Balance= await ethers.provider.getBalance(addr2.address);

    console.log(ownerBalance);
    console.log(addr1Balance);
    console.log(addr2Balance);
  })


});
