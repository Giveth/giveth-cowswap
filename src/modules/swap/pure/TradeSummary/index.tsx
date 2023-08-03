import { CurrencyAmount, Currency, Token } from '@uniswap/sdk-core'

import styled from 'styled-components/macro'

import { AutoColumn } from 'legacy/components/Column'
import { MouseoverTooltipContent } from 'legacy/components/Tooltip'

import { RowDeadline } from 'modules/swap/containers/Row/RowDeadline'
import { RowFee } from 'modules/swap/containers/Row/RowFee'
import { RowReceivedAfterSlippage } from 'modules/swap/containers/Row/RowReceivedAfterSlippage'
import { RowSlippage } from 'modules/swap/containers/Row/RowSlippage'
import { TradeSummaryProps } from 'modules/swap/containers/TradeSummary'
import { StyledRowBetween, TextWrapper } from 'modules/swap/pure/Row/styled'
import { StyledInfoIcon } from 'modules/swap/pure/styled'

// Sub-components

const Wrapper = styled.div``

export interface TradeSummaryContentProps extends TradeSummaryProps {
  fee: CurrencyAmount<Token> | null
  allowsOffchainSigning: boolean
  showDonation?: boolean
  donationAmount?: CurrencyAmount<Currency> | null
}

export function TradeSummaryContent(props: TradeSummaryContentProps) {
  const {
    showFee,
    trade,
    fee: feeFiatValue,
    allowsOffchainSigning,
    showHelpers,
    allowedSlippage,
    showDonation,
    donationAmount,
  } = props
  return (
    <Wrapper>
      <AutoColumn gap="2px">
        {/* Slippage */}
        {showFee && (
          <RowFee
            trade={trade}
            feeFiatValue={feeFiatValue}
            allowsOffchainSigning={allowsOffchainSigning}
            showHelpers={showHelpers}
          />
        )}
        {/* Slippage */}
        <RowSlippage allowedSlippage={allowedSlippage} showSettingOnClick={false} />

        {/* Transaction settings (eth flow only) */}
        <RowDeadline />

        {/* Min/Max received */}
        <RowReceivedAfterSlippage trade={trade} showHelpers={showHelpers} allowedSlippage={allowedSlippage} />
        {/* DONATION */}
        {showDonation && donationAmount && (
          <StyledRowBetween>
            <TextWrapper>
              Giveth Donation{' '}
              <MouseoverTooltipContent content={'A percentage of your swap goes to donation.eth'} wrap>
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
      </AutoColumn>
    </Wrapper>
  )
}
