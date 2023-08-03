import React, { createContext, useContext, useState } from 'react'

interface DonationToggleContextData {
  donationPercentage: number
  isDonationEnabled: boolean
  toggleDonationEnabled: () => void
  setDonationPercentage: (percentage: number) => void
}

interface DonationToggleProviderProps {
  children: React.ReactNode
}

const DonationToggleContext = createContext<DonationToggleContextData | undefined>(undefined)

export const DonationProvider: React.FC<DonationToggleProviderProps> = ({ children }) => {
  const [isDonationEnabled, setIsDonationEnabled] = useState<boolean>(true)
  const [donationPercentage, setPercentage] = useState<number>(1)

  const toggleDonationEnabled = () => {
    if (isDonationEnabled) {
      setPercentage(0)
    } else {
      setPercentage(1)
    }
    setIsDonationEnabled(!isDonationEnabled)
  }

  const setDonationPercentage = (percentage: number) => {
    setPercentage(percentage)
    if (Number(percentage) === 0) {
      setIsDonationEnabled(false)
    } else {
      setIsDonationEnabled(true)
    }
  }

  return (
    <DonationToggleContext.Provider
      value={{ isDonationEnabled, donationPercentage, toggleDonationEnabled, setDonationPercentage }}
    >
      {children}
    </DonationToggleContext.Provider>
  )
}

export const useDonation = (): DonationToggleContextData => {
  const context = useContext(DonationToggleContext)
  if (!context) {
    throw new Error('useDonation must be used within a DonationToggleProvider')
  }
  return context
}
