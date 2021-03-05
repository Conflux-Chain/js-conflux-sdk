/* eslint-disable */
const { Conflux, Drip } = require('../src'); // require('js-conflux-sdk');

const conflux = new Conflux({
  url: 'http://test.confluxrpc.org/v2',
  networkId: 1,
  logger: console, // use console to print log
});

// ----------------------------------------------------------------------------
async function getAccountBalance() {
  const balance = await conflux.getBalance('cfxtest:aar8jzybzv0fhzreav49syxnzut8s0jt1a1pdeeuwb');

  console.log(balance); // "4999998839889983249999999950307784"
  console.log(Drip(balance).toGDrip()); // "4999998839889983249999999.950307784"
  console.log(Drip(balance).toCFX()); // "4999998839889983.249999999950307784"
}

function encryptAndDecryptPrivateKeyAccount() {
  // create Account by privateKey
  const account = conflux.wallet.addPrivateKey('0x46b9e861b63d3509c88b7817275a30d22d62c8cd8fa6486ddee35ef0d8e0495f');
  console.log(conflux.wallet.has(account.address)); // true

  conflux.wallet.delete(account.address);
  console.log(conflux.wallet.has(account.address)); // false

  const keystore = account.encrypt('password');
  console.log(keystore);
  /*
  {
    version: 3,
    id: '635b0de3-76f2-7ca7-9f70-78708b2aba89',
    address: '1be45681ac6c53d5a40475f7526bac1fe7590fb8',
    crypto: {
      ciphertext: '62a107a733d30a17b0c63c6c270c4943e0b39f5d64256b99d8d8755c51e96b34',
      cipherparams: { iv: 'd5febf02a0129ab2430192065a5f6a0b' },
      cipher: 'aes-128-ctr',
      kdf: 'scrypt',
      kdfparams: {
        dklen: 32,
        salt: 'e566feee04948dc918b9e0e851969bb080a6daa9f5d4cd18bab59652fa737ad3',
        n: 8192,
        r: 8,
        p: 1
      },
      mac: '30e638cffc0ec64343aa487e733e869c8cb6ee03e9aef540e2c16de5f5cee010'
    }
  }
   */

  const decryptedAccount = conflux.wallet.addKeystore(keystore, 'password');
  console.log(decryptedAccount);
  /*
  PrivateKeyAccount {
    address: 'cfxtest:aar8jzybzv0fhzreav49syxnzut8s0jt1a1pdeeuwb',
    publicKey: '0x2500e7f3fbddf2842903f544ddc87494ce95029ace4e257d54ba77f2bc1f3a8837a9461c4f1c57fecc499753381e772a128a5820a924a2fa05162eb662987a9f',
    privateKey: '0x46b9e861b63d3509c88b7817275a30d22d62c8cd8fa6486ddee35ef0d8e0495f'
  }
  */

  console.log(decryptedAccount.privateKey === account.privateKey); // true
  console.log(decryptedAccount.publicKey === account.publicKey); // true
  console.log(decryptedAccount.address === account.address); // true
}

function genRandomAccount() {
  const randomAccount = conflux.wallet.addRandom();
  console.log(randomAccount);
  /*
  PrivateKeyAccount {
    address: 'cfxtest:aapwgme763vhz9jw38nnbdjg1bzx1g8n3e6mtfmm6r',
    publicKey: '0x06402a2970f35e195ee9eaa4a9cb1464a9e5a8a79df1e48808e88f4a6c1744326affe84b6f37dcc3a48d8d5b5f6e2b4130e11b812c04f92edb48c40363764cae',
    privateKey: '0xa3bcf3d3d083b12120dbebb7fbb4bcbfd7ad0d2528f366546431668685765814'
  }
   */

  console.log(conflux.wallet.addRandom()); // different account
  /*
  PrivateKeyAccount {
    address: 'cfxtest:aas95jhnaf9m2z019wp8rfz1fgje63tc268aaeyaup',
    publicKey: '0x27589308adf0f0b6362a834da664a200453152b0103b3952d4b92e30c9f37587107dbc37953038b8e5ea697a7f745a59c36a50318cfa5d75e42637df7c6e5b8b',
    privateKey: '0xad5a63169fe8af526bd9834e3763e169bf28f8b9f72241ce647ebb2eb5d02dcb'
  }
  */
}

async function main() {
  await getAccountBalance();
  encryptAndDecryptPrivateKeyAccount();
  genRandomAccount();
}

main().finally(() => conflux.close());
