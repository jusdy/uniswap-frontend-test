export const shortenAddress = (address: AddressString) => {
  if (!address) {
    return '-'
  }

  return address.slice(0, 5) + '...' + address.slice(-3)
}
