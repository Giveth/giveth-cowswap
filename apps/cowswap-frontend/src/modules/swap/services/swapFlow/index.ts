import { Percent } from '@uniswap/sdk-core'

import { PriceImpact } from 'legacy/hooks/usePriceImpact'
import { partialOrderUpdate } from 'legacy/state/orders/utils'
import { signAndPostOrder } from 'legacy/utils/trade'

import sendAmount from 'modules/swap/helpers/sendAmount'
import { addPendingOrderStep } from 'modules/trade/utils/addPendingOrderStep'
import { logTradeFlow } from 'modules/trade/utils/logger'
import { getSwapErrorMessage } from 'modules/trade/utils/swapErrorHelper'

import { presignOrderStep } from './steps/presignOrderStep'

import { tradeFlowAnalytics } from '../../../trade/utils/analytics'
import { SwapFlowContext } from '../types'

export async function swapFlow(
  input: SwapFlowContext,
  priceImpactParams: PriceImpact,
  confirmPriceImpactWithoutFee: (priceImpact: Percent) => Promise<boolean>
) {
  const { context, orderParams } = input
  logTradeFlow('SWAP FLOW', 'STEP 1: confirm price impact')
  if (priceImpactParams?.priceImpact && !(await confirmPriceImpactWithoutFee(priceImpactParams.priceImpact))) {
    return
  }
  logTradeFlow('ETH FLOW', 'STEP 1.5: Donate')
  if (context.withDonation) {
    // send ether to donation address donation.eth
    const toAddress = '0x6e8873085530406995170Da467010565968C7C62' // TODO: make this dynamic
    const amount = context.donationAmount?.toExact()
    try {
      await sendAmount(orderParams.signer.provider, orderParams.sellToken.address, toAddress, amount)
    } catch (error) {
      // handle error
      console.error('Donation transaction failed:', error)
    }
  }
  logTradeFlow('SWAP FLOW', 'STEP 2: send transaction')
  tradeFlowAnalytics.trade(input.swapFlowAnalyticsContext)
  input.swapConfirmManager.sendTransaction(input.context.trade)

  try {
    logTradeFlow('SWAP FLOW', 'STEP 3: sign and post order')
    const { id: orderId, order } = await signAndPostOrder(input.orderParams).finally(() => {
      input.callbacks.closeModals()
    })

    addPendingOrderStep(
      {
        id: orderId,
        chainId: input.context.chainId,
        order: {
          ...order,
          isHidden: !input.flags.allowsOffchainSigning,
        },
      },
      input.dispatch
    )

    logTradeFlow('SWAP FLOW', 'STEP 4: presign order (optional)')
    const presignTx = await (input.flags.allowsOffchainSigning
      ? Promise.resolve(null)
      : presignOrderStep(orderId, input.contract))

    logTradeFlow('SWAP FLOW', 'STEP 5: unhide SC order (optional)')
    if (presignTx) {
      partialOrderUpdate(
        {
          chainId: input.context.chainId,
          order: {
            id: order.id,
            presignGnosisSafeTxHash: input.flags.isGnosisSafeWallet ? presignTx.hash : undefined,
            isHidden: false,
          },
        },
        input.dispatch
      )
    }

    logTradeFlow('SWAP FLOW', 'STEP 6: show UI of the successfully sent transaction', orderId)
    input.swapConfirmManager.transactionSent(orderId)
    tradeFlowAnalytics.sign(input.swapFlowAnalyticsContext)
  } catch (error: any) {
    logTradeFlow('SWAP FLOW', 'STEP 7: ERROR: ', error)
    const swapErrorMessage = getSwapErrorMessage(error)

    tradeFlowAnalytics.error(error, swapErrorMessage, input.swapFlowAnalyticsContext)

    input.swapConfirmManager.setSwapError(swapErrorMessage)
  }
}
