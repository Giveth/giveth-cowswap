import { Contract } from '@ethersproject/contracts'
import { parseUnits, parseEther } from '@ethersproject/units'
import Erc20 from 'legacy/abis/erc20.json'

async function sendAmount(provider: any, contractAddress: string, toAddress: string, amount: any, sendEther?: boolean) {
  if (!provider) return
  // Convert the amount to Wei (1 Ether = 1e18 Wei)
  const amountWei = parseEther(amount)

  let transactionResponse

  if (sendEther) {
    // Formulate the transaction to send Ether directly
    const transaction = {
      to: toAddress,
      value: amountWei,
    }

    // Send the transaction
    transactionResponse = await provider.getSigner()!.sendTransaction(transaction)
  } else {
    const abi = Erc20
    const contract = new Contract(contractAddress, abi, provider.getSigner())
    // Convert the amount to the token's decimal units
    const decimals = await contract.decimals()
    const amountTokenUnits = parseUnits(amount, decimals)

    // Send the token
    transactionResponse = await contract.transfer(toAddress, amountTokenUnits)
  }

  console.log(`Transaction hash: ${transactionResponse.hash}`)
  return transactionResponse.hash
  //   // Wait for the transaction to be mined
  //   const transactionReceipt = await transactionResponse.wait()

  //   console.log(`Transaction was mined in block ${transactionReceipt.blockNumber}`)
}

export default sendAmount
