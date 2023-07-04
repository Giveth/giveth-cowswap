import React from 'react'
import styled from 'styled-components/macro'

const Label = styled.label`
  margin: 20px 0 5px 0;
  background: rgba(234, 244, 224, 1);
  padding: 20px 10px;
  border-radius: 10px;
  color: rgba(57, 107, 38, 1);
  font-weight: 500;
  * {
    cursor: pointer;
  }
  input[type='checkbox'] {
    accent-color: rgba(57, 107, 38, 1);
  }
  span {
    font-size: 14px;
    margin: 0 0 0 4px;
  }
`

const DonationInput = ({ children }: React.PropsWithChildren) => {
  return <Label>{children}</Label>
}

export default DonationInput
