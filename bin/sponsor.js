#!/usr/bin/env node
/* eslint-disable no-console */
const { program } = require('commander');
const { Conflux, Drip } = require('../src');

const mainnetMeta = {
  url: 'https://main.confluxrpc.com',
  networkId: 1029,
};

const testnetMeta = {
  url: 'https://test.confluxrpc.com',
  networkId: 1,
};

program
  .version('0.0.1')
  .name('sponsor')
  .option('-t, --testnet', 'Use Conflux testnet network');

program
  .command('info')
  .description('Get contract sponsor info')
  .argument('<contractAddr>', 'Contract address')
  .action(info);

program
  .command('setGasSponsor')
  .description('Set gas sponsor')
  .argument('<contractAddr>', 'Contract address')
  .argument('<upperBound>', 'Sponsor upper bound in GDrip')
  .argument('<value>', 'Value in CFX')
  .action(setGasSponsor);

program
  .command('setCollateralSponsor')
  .description('Set collateral sponsor')
  .argument('<contractAddr>', 'Contract address')
  .argument('<value>', 'Value in CFX')
  .action(setCollateralSponsor);

program
  .command('addToWhiteList')
  .description('Add address to whitelist')
  .argument('<contractAddr>', 'Contract address')
  .argument('<targetAddr>', '')
  .action(addToWhiteList);

program
  .command('removeFromWhiteList')
  .description('Remove address from whitelist')
  .argument('<contractAddr>', 'Contract address')
  .argument('<targetAddr>', '')
  .action(removeFromWhiteList);

async function info(contractAddr) {
  const { conflux, SponsorWhitelistControl } = _getClient();
  const sponsorInfo = await conflux.getSponsorInfo(contractAddr);
  console.log('Gas Sponsor: ', sponsorInfo.sponsorForGas);
  console.log('Gas Sponsor Balance: ', new Drip(sponsorInfo.sponsorBalanceForGas).toCFX(), 'CFX');
  console.log('Gas Sponsor upperBound: ', new Drip(sponsorInfo.sponsorGasBound).toGDrip(), 'GDrip');
  console.log('Collateral Sponsor: ', sponsorInfo.sponsorForCollateral);
  console.log('Collateral Sponsor Balance: ', new Drip(sponsorInfo.sponsorBalanceForCollateral).toCFX(), 'CFX');
  const isAllWhiteList = await SponsorWhitelistControl.isAllWhitelisted(contractAddr);
  console.log('IsAllWhitelisted: ', isAllWhiteList);
  const admin = await _getAdmin(conflux, contractAddr);
  console.log('Contract Admin: ', admin);
  console.log('');
}

async function setGasSponsor(contractAddr, upperBound, value) {
  const { conflux, SponsorWhitelistControl } = _getClient();
  const account = _getAccount(conflux);
  /* const admin = await _getAdmin(conflux, contractAddr);
  if (account.address !== admin) {
    console.log('You are not admin');
    return;
  } */
  // TODO add more check: value > upperBound * 1000; new sponsor balance > old sponsor balance; sponsor have enough balance for value
  const receipt = await SponsorWhitelistControl
    .setSponsorForGas(contractAddr, Drip.fromGDrip(upperBound))
    .sendTransaction({
      from: account.address,
      value: Drip.fromCFX(value),
    })
    .executed();
  console.log(`Set gas sponsor success: ${receipt.outcomeStatus === 0}, tx hash ${receipt.transactionHash}`);
}

async function setCollateralSponsor(contractAddr, value) {
  const { conflux, SponsorWhitelistControl } = _getClient();
  const account = _getAccount(conflux);
  /* const admin = await _getAdmin(conflux, contractAddr);
  if (account.address !== admin) {
    console.log('You are not admin');
    return;
  } */
  // TODO add more check: sponsor for collateral must bigger than current if want replace a old sponsor
  const receipt = await SponsorWhitelistControl
    .setSponsorForCollateral(contractAddr)
    .sendTransaction({
      from: account.address,
      value: Drip.fromCFX(value),
    })
    .executed();
  console.log(`Set collateral sponsor success: ${receipt.outcomeStatus === 0}, tx hash ${receipt.transactionHash}`);
}

async function removeFromWhiteList(contractAddr, targetAddr) {
  const { conflux, SponsorWhitelistControl } = _getClient();
  const account = _getAccount(conflux);
  const admin = await _getAdmin(conflux, contractAddr);
  if (account.address !== admin) {
    console.log('You are not admin');
    return;
  }
  const receipt = await SponsorWhitelistControl
    .removePrivilegeByAdmin(contractAddr, [targetAddr])
    .sendTransaction({
      from: account.address,
    })
    .executed();
  console.log(`Remove from whitelist success: ${receipt.outcomeStatus === 0}, tx hash ${receipt.transactionHash}`);
}

async function addToWhiteList(contractAddr, targetAddr) {
  const { conflux, SponsorWhitelistControl } = _getClient();
  const account = _getAccount(conflux);
  const admin = await _getAdmin(conflux, contractAddr);
  if (account.address !== admin) {
    console.log('You are not admin');
    return;
  }
  const receipt = await SponsorWhitelistControl
    .addPrivilegeByAdmin(contractAddr, [targetAddr])
    .sendTransaction({
      from: account.address,
    })
    .executed();
  console.log(`Add to whitelist success: ${receipt.outcomeStatus === 0}, tx hash ${receipt.transactionHash}`);
}

function _getClient() {
  const options = program.opts();
  const conflux = options.testnet ? new Conflux(testnetMeta) : new Conflux(mainnetMeta);
  const SponsorWhitelistControl = conflux.InternalContract('SponsorWhitelistControl');
  return {
    conflux,
    SponsorWhitelistControl,
  };
}

async function _getAdmin(conflux, contractAddr) {
  const AdminControl = conflux.InternalContract('AdminControl');
  const admin = await AdminControl.getAdmin(contractAddr);
  return admin;
}

function _getAccount(conflux) {
  if (!process.env.PRIVATE_KEY) {
    console.log('Please set PRIVATE_KEY environment variable to update sponsor');
    process.exit();
  }
  return conflux.wallet.addPrivateKey(process.env.PRIVATE_KEY);
}

program.parse(process.argv);
