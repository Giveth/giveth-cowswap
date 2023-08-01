import { parse } from 'qs'

import { Field } from './actions'
import { queryParametersToSwapState } from './hooks'

jest.mock('legacy/components/analytics/hooks/useAnalyticsReporter.ts')

describe('hooks', () => {
  describe('#queryParametersToSwapState', () => {
    test('ETH to DAI', () => {
      expect(
        queryParametersToSwapState(
          parse(
            '?inputCurrency=ETH&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&exactAmount=20.5&exactField=output',
            { parseArrays: false, ignoreQueryPrefix: true }
          ),
          '',
          null
        )
      ).toEqual({
        [Field.OUTPUT]: { currencyId: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
        [Field.INPUT]: { currencyId: 'ETH' },
        typedValue: '20.5',
        chainId: null,
        independentField: Field.OUTPUT,
        recipient: null,
        recipientAddress: null,
        withDonation: false,
      })
    })

    test('does not duplicate eth for invalid output token', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=invalid', { parseArrays: false, ignoreQueryPrefix: true }),
          'ETH',
          null
        )
      ).toEqual({
        [Field.INPUT]: { currencyId: 'ETH' },
        [Field.OUTPUT]: { currencyId: null },
        typedValue: '',
        chainId: null,
        independentField: Field.INPUT,
        recipient: null,
        recipientAddress: null,
        withDonation: false,
      })
    })

    test('output ETH only', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=eth&exactAmount=20.5', { parseArrays: false, ignoreQueryPrefix: true }),
          '',
          null
        )
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'ETH' },
        [Field.INPUT]: { currencyId: null },
        typedValue: '20.5',
        chainId: null,
        independentField: Field.INPUT,
        recipient: null,
        recipientAddress: null,
        withDonation: false,
      })
    })

    test('invalid recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=eth&exactAmount=20.5&recipient=abc', { parseArrays: false, ignoreQueryPrefix: true }),
          '',
          null
        )
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'ETH' },
        [Field.INPUT]: { currencyId: null },
        typedValue: '20.5',
        chainId: null,
        independentField: Field.INPUT,
        recipient: null,
        recipientAddress: null,
        withDonation: false,
      })
    })

    test('valid recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=eth&exactAmount=20.5&recipient=0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5', {
            parseArrays: false,
            ignoreQueryPrefix: true,
          }),
          '',
          null
        )
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'ETH' },
        [Field.INPUT]: { currencyId: null },
        typedValue: '20.5',
        chainId: null,
        independentField: Field.INPUT,
        recipient: '0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5',
        recipientAddress: null,
        withDonation: false,
      })
    })
    test('accepts any recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=eth&exactAmount=20.5&recipient=bob.argent.xyz', {
            parseArrays: false,
            ignoreQueryPrefix: true,
          }),
          '',
          null
        )
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'ETH' },
        [Field.INPUT]: { currencyId: null },
        typedValue: '20.5',
        chainId: null,
        independentField: Field.INPUT,
        recipient: 'bob.argent.xyz',
        recipientAddress: null,
        withDonation: false,
      })
    })
  })
})
