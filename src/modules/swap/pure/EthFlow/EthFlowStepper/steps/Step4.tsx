import { useEffect, useMemo } from 'react'
import Checkmark from 'legacy/assets/cow-swap/checkmark.svg'
import Exclamation from 'legacy/assets/cow-swap/exclamation.svg'
import styled from 'styled-components/macro'
import { EthFlowStepperProps, SmartOrderStatus } from '..'
import { Step, StepProps } from '../Step'

const ExpiredMessage = styled.span`
  color: ${({ theme }) => theme.warning};
`

export function Step4({
  nativeTokenSymbol,
  tokenLabel,
  order,
  creation,
  refund,
  cancellation,
  donation,
}: EthFlowStepperProps) {
  const { state, isExpired, rejectedReason } = order
  const { ready, order: _order } = donation
  const { failed: creationFailed } = creation
  const { hash: refundHash, failed: refundFailed } = refund
  const { hash: cancellationHash, failed: cancellationFailed } = cancellation
  const isFilled = state === SmartOrderStatus.FILLED
  const isDonating = state === SmartOrderStatus.DONATING
  const Donated = state === SmartOrderStatus.DONATED
  const isRefunded = refundFailed === false || cancellationFailed === false
  // Get the label, state and icon
  const {
    label,
    state: stepState,
    icon,
  } = useMemo<StepProps>(() => {
    if (Donated) {
      return {
        label: 'Donated 1% of ' + tokenLabel,
        state: 'success',
        icon: Checkmark,
      }
    }
    if (isDonating) {
      return {
        label: 'Donating 1% of ' + tokenLabel,
        state: 'pending',
        icon: Exclamation,
      }
    }
    return {
      label: 'Donate 1% of ' + tokenLabel,
      state: 'not-started',
      icon: Exclamation,
    }
  }, [isFilled, isDonating, creationFailed, tokenLabel, nativeTokenSymbol])

  const isRefunding = !!refundHash && refundFailed === undefined
  const isCanceling = !!cancellationHash && cancellationFailed === undefined
  const isOrderRejected = !!rejectedReason
  const wontReceiveToken = !isFilled && (isExpired || isOrderRejected || isRefunding || isCanceling || isRefunded)
  const isSuccess = stepState === 'success'

  const crossOut = !isSuccess && wontReceiveToken

  useEffect(() => {
    // DO IT
    console.log('DO IT HERE PLEASEEE', { ready, _order })
    if (ready) {
    }
  }, [ready])

  return (
    <Step state={stepState} icon={icon} label={label} crossOut={crossOut}>
      <>
        {!isDonating && !creationFailed && isExpired && !(isSuccess || isOrderRejected) && (
          <ExpiredMessage>Order has expired</ExpiredMessage>
        )}
      </>
    </Step>
  )
}
