import { useState } from 'react'

export function useDonationToggle() {
  const [isDonationEnabled, setDonationEnabled] = useState(false)

  const toggleDonationEnabled = () => {
    setDonationEnabled(!isDonationEnabled)
  }

  return {
    isDonationEnabled,
    toggleDonationEnabled,
  }
}
