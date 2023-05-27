import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import Erc20 from 'legacy/abis/erc20.json'

async function sendAmount(contractAddress: string, toAddress: string, amount: string, sendEther: boolean) {
  const { provider } = useWeb3React()
  if (!provider) return
  // Convert the amount to Wei (1 Ether = 1e18 Wei)
  const amountWei = ethers.utils.parseEther(amount)

  let transactionResponse

  if (sendEther) {
    // Formulate the transaction to send Ether directly
    const transaction = {
      to: toAddress,
      value: amountWei,
    }

    // Send the transaction
    transactionResponse = await provider!.getSigner().sendTransaction(transaction)
  } else {
    const abi = Erc20
    const contract = new ethers.Contract(contractAddress, abi, provider!.getSigner())

    // Convert the amount to the token's decimal units
    const decimals = await contract.decimals()
    const amountTokenUnits = ethers.utils.parseUnits(amount, decimals)

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
