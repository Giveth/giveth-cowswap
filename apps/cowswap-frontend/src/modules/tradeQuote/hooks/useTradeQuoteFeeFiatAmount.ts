import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { CurrencyAmount, Token } from '@uniswap/sdk-core'

import { useHigherUSDValue } from 'legacy/hooks/useStablecoinPrice'

import { useTradeQuote } from './useTradeQuote'

import { tradeQuoteParamsAtom } from '../state/tradeQuoteParamsAtom'

export function useTradeQuoteFeeFiatAmount(): CurrencyAmount<Token> | null {
  const quote = useTradeQuote()
  const { amount } = useAtomValue(tradeQuoteParamsAtom)

  const feeAmountStr = quote.response?.quote.feeAmount

  const feeAmount = useMemo(() => {
    if (!amount || !feeAmountStr) return null

    return CurrencyAmount.fromRawAmount(amount?.currency, feeAmountStr)
  }, [amount, feeAmountStr])

  return useHigherUSDValue(feeAmount).value
}
