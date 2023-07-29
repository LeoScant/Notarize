const {expect } = require('chai');
const {BN, constants, expectEvent, expectRevert, time}= require('@openzeppelin/test-helpers')
const {ZERO_ADDRESS} = constants;

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const Notarize = artifacts.require('Notarize');
const fromWei = (x) => web3.utils.fromWei(x.toString());
const toWei = (x) => web3.utils.toWei(x.toString());

const HashWriter = '0x9bd7b39e404ec8163ddb5278c0044198ca50a2bf864985cbc93f934a5afed5d6'
const DefaultAdminRole = '0x0000000000000000000000000000000000000000000000000000000000000000'
const hash1 = '0xb5df927444f1a6b664a55ae3d31257913a486dfc7fdd94479619f5ce0b7fbe53'
const hash2 = '0xf4b410be209d07dd0fc4e34eabfd6ff4c5b9e8cd3bdacf8088e2ce6c56aaaeeb'


contract('Notarization Test', async (accounts) => {
    const Admin = accounts[0];
    const HashWriter1 = accounts[1];

    it('retrieve contract', async () => {
        NotarizeContract = await Notarize.deployed();
        expect(NotarizeContract.address).to.be.not.equal(ZERO_ADDRESS);
        expect(NotarizeContract.address).to.match(/0x[0-9a-fA-F]{40}/);
    })

    it('Contract admin assing hash writer to role account1', async () => {
        await expectRevert(NotarizeContract.setHashWriterRole(HashWriter1, {from: HashWriter1}), 
            'AccessControl: account ' + HashWriter1.toLowerCase() + ' is missing role ' + DefaultAdminRole);
        await NotarizeContract.setHashWriterRole(HashWriter1, {from: Admin});
        expect(await NotarizeContract.hasRole(HashWriter, HashWriter1)).to.be.true;
    })

    it('A hash writer address cannot assign the same role to another address', async () => {
        await expectRevert(NotarizeContract.setHashWriterRole(HashWriter1, {from: HashWriter1}), 
        'AccessControl: account ' + HashWriter1.toLowerCase() + ' is missing role ' + DefaultAdminRole);
    })

    it('An admin address cannot notarize a document', async () => {
        await expectRevert(NotarizeContract.addNewDocument("Example", hash1, {from: Admin}), 
        "AccessControl: account " + Admin.toLowerCase() + " is missing role " + HashWriter);
    })

    it('A hash writer address can notarize a document and get notarized doc back', async () => {
        await NotarizeContract.addNewDocument("Example", hash1, {from: HashWriter1});
        tot = await NotarizeContract.getDocsCount();
        console.log("Total documents registered: " + tot);
        result = await NotarizeContract.getDocInfo(tot - 1);
        console.log(result[0].toString()+": "+ result[1]);
    })

    it('A hash writer address cannot notarize the same document twice', async () => {
        await expectRevert(NotarizeContract.addNewDocument("Example2", hash1, {from: HashWriter1}), 
        "Hash already registered");
        tot = await NotarizeContract.getDocsCount();
        console.log("Total documents registered: " + tot);
    })

    it('A hash writer address can notarize another document and get notarized doc back', async () => {
        await NotarizeContract.addNewDocument("Example2", hash2, {from: HashWriter1});
        tot = await NotarizeContract.getDocsCount();
        console.log("Total documents registered: " + tot);
        result = await NotarizeContract.getDocInfo(tot - 1);
        console.log(result[0].toString()+": "+ result[1]);
    })

    it('is document already registerd', async () => {
        expect(await NotarizeContract.getRegisteredHash(hash1)).to.be.true;
        const hash1Corrupted = "0xb5df927444f1a6b664a55ae3d31257913a486dfc7fdd94479619f5ce0b7fbe5a"
        expect(await NotarizeContract.getRegisteredHash(hash1Corrupted)).to.be.false;
    })
})
