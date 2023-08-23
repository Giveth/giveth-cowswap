import { Percent } from '@uniswap/sdk-core'

import { PriceImpact } from 'legacy/hooks/usePriceImpact'

import sendAmount from 'modules/swap/helpers/sendAmount'
import { signEthFlowOrderStep } from 'modules/swap/services/ethFlow/steps/signEthFlowOrderStep'
import { EthFlowContext } from 'modules/swap/services/types'
import { addPendingOrderStep } from 'modules/trade/utils/addPendingOrderStep'
import { tradeFlowAnalytics } from 'modules/trade/utils/analytics'
import { logTradeFlow } from 'modules/trade/utils/logger'
import { getSwapErrorMessage } from 'modules/trade/utils/swapErrorHelper'

import { calculateUniqueOrderId } from './steps/calculateUniqueOrderId'

export async function ethFlow(
  ethFlowContext: EthFlowContext,
  priceImpactParams: PriceImpact,
  confirmPriceImpactWithoutFee: (priceImpact: Percent) => Promise<boolean>
): Promise<void> {
  const {
    swapFlowAnalyticsContext,
    context,
    swapConfirmManager,
    contract,
    callbacks,
    appDataInfo,
    dispatch,
    orderParams: orderParamsOriginal,
    checkInFlightOrderIdExists,
    addInFlightOrderId,
  } = ethFlowContext

  logTradeFlow('ETH FLOW', 'STEP 1: confirm price impact')
  if (priceImpactParams?.priceImpact && !(await confirmPriceImpactWithoutFee(priceImpactParams.priceImpact))) {
    return undefined
  }

  // TODO: IMPROVE DONATION FLOW
  logTradeFlow('ETH FLOW', 'STEP 1.5: Donate')
  if (context.withDonation) {
    // send ether to donation address donation.eth
    const toAddress = '0x6e8873085530406995170Da467010565968C7C62' // TODO: make this dynamic
    const amount = context.donationAmount?.toExact()
    try {
      await sendAmount(orderParamsOriginal.signer.provider, '', toAddress, amount, true)
    } catch (error) {
      // handle error
      console.error('Donation transaction failed:', error)
    }
  }

  logTradeFlow('ETH FLOW', 'STEP 2: send transaction')
  // TODO: check if we need own eth flow analytics or more generic
  tradeFlowAnalytics.trade(swapFlowAnalyticsContext)
  swapConfirmManager.sendTransaction(context.trade)

  logTradeFlow('ETH FLOW', 'STEP 3: Get Unique Order Id (prevent collisions)')
  const { orderId, orderParams } = await calculateUniqueOrderId(
    orderParamsOriginal,
    contract,
    checkInFlightOrderIdExists
  )

  try {
    logTradeFlow('ETH FLOW', 'STEP 4: sign order')
    const { order, txReceipt } = await signEthFlowOrderStep(orderId, orderParams, contract, addInFlightOrderId).finally(
      () => {
        callbacks.closeModals()
      }
    )

    logTradeFlow('ETH FLOW', 'STEP 5: add pending order step')
    addPendingOrderStep(
      {
        id: orderId,
        chainId: context.chainId,
        order,
      },
      dispatch
    )
    // TODO: maybe move this into addPendingOrderStep?
    ethFlowContext.addTransaction({ hash: txReceipt.hash, ethFlow: { orderId: order.id, subType: 'creation' } })

    logTradeFlow('ETH FLOW', 'STEP 6: add app data to upload queue')
    callbacks.uploadAppData({ chainId: context.chainId, orderId, appData: appDataInfo })

    logTradeFlow('ETH FLOW', 'STEP 7: show UI of the successfully sent transaction', orderId)
    swapConfirmManager.transactionSent(orderId)
    tradeFlowAnalytics.sign(swapFlowAnalyticsContext)
  } catch (error: any) {
    logTradeFlow('ETH FLOW', 'STEP 8: ERROR: ', error)
    const swapErrorMessage = getSwapErrorMessage(error)

    tradeFlowAnalytics.error(error, swapErrorMessage, swapFlowAnalyticsContext)

    swapConfirmManager.setSwapError(swapErrorMessage)
  }
}
