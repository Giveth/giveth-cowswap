import styled from 'styled-components/macro'

import { useDonation } from 'modules/swap/hooks/useDonation'

interface IPicker {
  isSelected: boolean
}

const DonationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(234, 244, 224, 1);
  border-radius: 12px;
  margin: 5px 0;
  padding: 14px 16px;
  color: #327900;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  height: 138px;
`

const Label = styled.div`
  display: flex;
  align-items: center;
  color: rgba(57, 107, 38, 1);
  font-weight: 500;

  input[type='checkbox'] {
    accent-color: rgba(57, 107, 38, 1);
  }
  span {
    font-size: 15px;
    margin: 0 0 0 4px;
  }
`

const Options = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Picker = styled.div<IPicker>`
  cursor: pointer;
  width: 48px;
  height: 32px;
  padding: 8px;
  border-radius: 100px;
  background: ${({ isSelected }) => (isSelected ? '#327900' : '#d6f1c4')};
  color: ${({ isSelected }) => (isSelected ? 'white' : 'inherit')};
  text-align: center;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.02), 0px 4px 8px 0px rgba(0, 0, 0, 0.04);
`
const InputContainer = styled.div`
  position: relative;
`

const RightAlignedInput = styled.input`
  text-align: right;
  border: 1px solid #000;
  width: 62px;
  height: 33px;
  border-radius: 6px;
  border: 1px solid #69a93b;
  background: #f2ffe9;
  padding-right: 25px;
  color: #327900;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`
const PercentageSymbol = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
`

const DonationInput = () => {
  const { isDonationEnabled, donationPercentage, setDonationPercentage, toggleDonationEnabled } = useDonation()
  const percents = [0.1, 0.3, 1, 3, 5]
  return (
    <DonationContainer>
      <span>Donate a % of your swap to support Public Goods.</span>
      <Options>
        {percents.map((percent, index) => (
          <Picker
            key={index}
            isSelected={donationPercentage === percent}
            onClick={() => {
              setDonationPercentage(percent)
            }}
          >
            {percent}%
          </Picker>
        ))}
        <p>or more...</p>
        <InputContainer>
          <RightAlignedInput
            type="number"
            min={0}
            max={100}
            step={0.01}
            value={donationPercentage}
            onChange={(e) => {
              let input = Number(e.target.value)
              if (input < 100) {
                input = Number(Number(input).toFixed(2))
                setDonationPercentage(input)
              }
            }}
          />
          <PercentageSymbol>%</PercentageSymbol>
        </InputContainer>
      </Options>
      <Label>
        <input type="checkbox" checked={!isDonationEnabled} onChange={() => toggleDonationEnabled()} />
        <span>I don't want to support public goods</span>
      </Label>
    </DonationContainer>
  )
}

export default DonationInput
