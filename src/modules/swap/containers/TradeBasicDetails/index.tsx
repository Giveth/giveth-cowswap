import { BoxProps } from 'rebass'
import TradeGp from 'legacy/state/swap/TradeGp'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { INITIAL_ALLOWED_SLIPPAGE_PERCENT } from 'legacy/constants'
import { useHigherUSDValue } from 'legacy/hooks/useStablecoinPrice'
import { LowerSectionWrapper } from 'modules/swap/pure/styled'
import { RowFee } from 'modules/swap/containers/Row/RowFee'
import { RowSlippage } from 'modules/swap/containers/Row/RowSlippage'
import { RowReceivedAfterSlippage } from 'modules/swap/containers/Row/RowReceivedAfterSlippage'
import { useIsEthFlow } from 'modules/swap/hooks/useIsEthFlow'
import { useIsWrapOrUnwrap } from 'modules/trade/hooks/useIsWrapOrUnwrap'
import { StyledRowBetween, TextWrapper } from 'modules/swap/pure/Row/styled'
import { MouseoverTooltipContent } from 'legacy/components/Tooltip'
import { StyledInfoIcon } from 'modules/swap/pure/styled'

interface TradeBasicDetailsProp extends BoxProps {
  allowedSlippage: Percent | string
  isExpertMode: boolean
  allowsOffchainSigning: boolean
  trade?: TradeGp
  fee: CurrencyAmount<Currency>
  showDonation?: boolean
  donationAmount?: CurrencyAmount<Currency> | null
}

export function TradeBasicDetails(props: TradeBasicDetailsProp) {
  const {
    trade,
    allowedSlippage,
    isExpertMode,
    allowsOffchainSigning,
    fee,
    showDonation,
    donationAmount,
    ...boxProps
  } = props
  const allowedSlippagePercent = !(allowedSlippage instanceof Percent)
    ? INITIAL_ALLOWED_SLIPPAGE_PERCENT
    : allowedSlippage

  // trades are null when there is a fee quote error e.g
  // so we can take both
  const feeFiatValue = useHigherUSDValue(trade?.fee.feeAsCurrency || fee)
  const isEthFlow = useIsEthFlow()
  const isWrapOrUnwrap = useIsWrapOrUnwrap()

  const showRowFee = trade || fee
  const showRowSlippage =
    (isEthFlow || isExpertMode || !allowedSlippagePercent.equalTo(INITIAL_ALLOWED_SLIPPAGE_PERCENT)) && !isWrapOrUnwrap
  const showRowReceivedAfterSlippage = isExpertMode && trade
  return (
    <LowerSectionWrapper {...boxProps}>
      {/* Fees */}
      {showRowFee && (
        <RowFee
          trade={trade}
          showHelpers={true}
          allowsOffchainSigning={allowsOffchainSigning}
          fee={fee}
          feeFiatValue={feeFiatValue}
        />
      )}
      {/* Slippage */}
      {showRowSlippage && <RowSlippage allowedSlippage={allowedSlippagePercent} />}
      {showRowReceivedAfterSlippage && (
        <RowReceivedAfterSlippage trade={trade} allowedSlippage={allowedSlippagePercent} showHelpers={true} />
      )}

      {/* DONATION */}
      {showDonation && donationAmount && (
        <StyledRowBetween>
          <TextWrapper>
            Giveth Donation{' '}
            <MouseoverTooltipContent content={'1% of your swap goes to donation.eth'} wrap>
              <StyledInfoIcon size={16} />
            </MouseoverTooltipContent>
          </TextWrapper>
          <TextWrapper>
            {`${donationAmount.toExact()} ${donationAmount.currency.symbol} (≈$${+donationAmount
              .multiply(trade?.executionPrice!)
              .toExact()})`}
          </TextWrapper>
        </StyledRowBetween>
      )}
    </LowerSectionWrapper>
  )
}
