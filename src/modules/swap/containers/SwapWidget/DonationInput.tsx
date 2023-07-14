import React from 'react'
import styled from 'styled-components/macro'

interface IDonationInputProps {
  children: React.ReactNode
  onClick: () => void
}

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 5px 0;
  background: rgba(234, 244, 224, 1);
  padding: 20px 10px;
  border-radius: 10px;
  color: rgba(57, 107, 38, 1);
  font-weight: 500;
  cursor: pointer;

  input[type='checkbox'] {
    accent-color: rgba(57, 107, 38, 1);
  }
  span {
    font-size: 15px;
    margin: 0 0 0 4px;
  }
`

const DonationInput = ({ onClick, children }: IDonationInputProps) => {
  return <Label onClick={onClick}>{children}</Label>
}

export default DonationInput
