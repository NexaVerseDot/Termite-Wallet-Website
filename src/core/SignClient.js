import Client from '@walletconnect/sign-client'

class SignClient extends Client {
  static async initialize() {
    const options = {
      relayUrl: 'wss://relay.walletconnect.com',
      projectId: process.env.REACT_APP_WC_PROJECT_ID,
      metadata: {
        name: 'Termite Money',
        description: 'Termite Money Premium',
        url: 'https://termite.money',
        icons: ['https://avatars.githubusercontent.com/u/']
      }
    }

    const client = new SignClient(options)
    await client.initialize()

    return client
  }

  sendRequest(userAddress, topic, inputData, chainId, contract) {
    return this.request(this.requestParams(chainId, topic, this.contractCallTx(inputData, userAddress, contract)))
  }

  requestParams(chainId, topic, tx) {
    return {
      topic,
      chainId,
      request: {
        method: 'eth_sendTransaction',
        params: [tx]
      }
    }
  }

  contractCallTx(data, from, to) {
    return {
      from,
      to,
      value: '0',
      data
    }
  }
}

export default SignClient
