module.exports = function (status) {
  var displayStatus = ''
  switch (status) {
    case 'APPROVED':
    case 'AUTO-APPROVED':
    case 'REJECTED':
    case 'UPDATED':
    case 'PENDING':
    case 'NEW':
      displayStatus = status.charAt(0) + status.slice(1).toLowerCase()
      break
    case 'APPROVED-ADVANCE-CLOSED':
      displayStatus = 'Closed'
      break
    case 'APPROVED-PAYOUT-BARCODE-EX':
      displayStatus = 'Barcode Expired'
      break
    case 'REQUEST-INFO-PAYMENT':
      displayStatus = 'Payment Information Requested'
      break
    case 'REQUEST-INFORMATION':
      displayStatus = 'Information Requested'
      break
    default:
      displayStatus = status
      break
  }
  return displayStatus
}
