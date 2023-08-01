/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers'
import type { Provider } from '@ethersproject/providers'
import type { ComposableCoW, ComposableCoWInterface } from '../ComposableCoW'

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IConditionalOrder',
            name: 'handler',
            type: 'address',
          },
          {
            internalType: 'bytes32',
            name: 'salt',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'staticInput',
            type: 'bytes',
          },
        ],
        internalType: 'struct IConditionalOrder.ConditionalOrderParams',
        name: 'params',
        type: 'tuple',
      },
      {
        internalType: 'contract IValueFactory',
        name: 'factory',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: 'dispatch',
        type: 'bool',
      },
    ],
    name: 'createWithContext',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        name: 'safe',
        type: 'address',
      },
      {
        name: 'singleOrderHash',
        type: 'bytes32',
      },
    ],
    name: 'singleOrders',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'contract IConditionalOrder',
            name: 'handler',
            type: 'address',
          },
          {
            internalType: 'bytes32',
            name: 'salt',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'staticInput',
            type: 'bytes',
          },
        ],
        internalType: 'struct IConditionalOrder.ConditionalOrderParams',
        name: 'params',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'offchainInput',
        type: 'bytes',
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]',
      },
    ],
    name: 'getTradeableOrderWithSignature',
    outputs: [
      {
        components: [
          {
            internalType: 'contract IERC20',
            name: 'sellToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'buyToken',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'sellAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'buyAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint32',
            name: 'validTo',
            type: 'uint32',
          },
          {
            internalType: 'bytes32',
            name: 'appData',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'feeAmount',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'kind',
            type: 'bytes32',
          },
          {
            internalType: 'bool',
            name: 'partiallyFillable',
            type: 'bool',
          },
          {
            internalType: 'bytes32',
            name: 'sellTokenBalance',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'buyTokenBalance',
            type: 'bytes32',
          },
        ],
        internalType: 'struct GPv2Order.Data',
        name: 'order',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'singleOrderHash',
        type: 'bytes32',
      },
    ],
    name: 'remove',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export class ComposableCoW__factory {
  static readonly abi = _abi
  static createInterface(): ComposableCoWInterface {
    return new utils.Interface(_abi) as ComposableCoWInterface
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ComposableCoW {
    return new Contract(address, _abi, signerOrProvider) as ComposableCoW
  }
}
