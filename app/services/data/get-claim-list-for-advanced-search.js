const config = require('../../../knexfile').intweb
const knex = require('knex')(config)
const moment = require('moment')
const claimStatusEnum = require('../../../app/constants/claim-status-enum')
const prisonsEnum = require('../../../app/constants/prisons-enum')

const APPROVED_STATUS_VALUES = [ claimStatusEnum.APPROVED.value, claimStatusEnum.APPROVED_ADVANCE_CLOSED.value, claimStatusEnum.AUTOAPPROVED.value ]

var countQuery
var selectQuery

var validSearchOptions = [
  'reference',
  'name',
  'ninumber',
  'prisonerNumber',
  'prison',
  'assistedDigital',
  'claimStatus',
  'modeOfApproval',
  'pastOrFuture',
  'visitRules',
  'visitDateFrom',
  'visitDateTo',
  'dateSubmittedFrom',
  'dateSubmittedTo',
  'dateApprovedFrom',
  'dateApprovedTo',
  'dateRejectedFrom',
  'dateRejectedTo'
]

module.exports = function (searchCriteria, offset, limit) {
  var validSearchOptionFound = false

  for (var option in searchCriteria) {
    if (validSearchOptions.indexOf(option) !== -1) {
      if (searchCriteria[option]) {
        validSearchOptionFound = true
      }
    }
  }

  if (!validSearchOptionFound) {
    return Promise.resolve({
      claims: [],
      total: 0
    })
  }

  createBaseQueries(limit, offset)

  if (searchCriteria.reference) {
    applyReferenceFilter(countQuery, searchCriteria.reference)
    applyReferenceFilter(selectQuery, searchCriteria.reference)
  }

  if (searchCriteria.name) {
    applyNameFilter(countQuery, searchCriteria.name)
    applyNameFilter(selectQuery, searchCriteria.name)
  }

  if (searchCriteria.ninumber) {
    applyNINumberFilter(countQuery, searchCriteria.ninumber)
    applyNINumberFilter(selectQuery, searchCriteria.ninumber)
  }

  if (searchCriteria.prisonerNumber) {
    applyPrisonerNumberFilter(countQuery, searchCriteria.prisonerNumber)
    applyPrisonerNumberFilter(selectQuery, searchCriteria.prisonerNumber)
  }

  if (searchCriteria.prison) {
    applyPrisonFilter(countQuery, searchCriteria.prison)
    applyPrisonFilter(selectQuery, searchCriteria.prison)
  }

  if (searchCriteria.assistedDigital) {
    applyAssistedDigitalFilter(countQuery)
    applyAssistedDigitalFilter(selectQuery)
  }

  if (searchCriteria.claimStatus && searchCriteria.claimStatus !== 'all') {
    if (searchCriteria.claimStatus === 'paid') {
      applyPaidClaimStatusFilter(countQuery)
      applyPaidClaimStatusFilter(selectQuery)
    } else if (searchCriteria.claimStatus === 'inProgress') {
      applyInProgressClaimStatusFilter(countQuery)
      applyInProgressClaimStatusFilter(selectQuery)
    } else {
      applyClaimStatusFilter(countQuery, searchCriteria.claimStatus)
      applyClaimStatusFilter(selectQuery, searchCriteria.claimStatus)
    }
  }

  if (searchCriteria.modeOfApproval) {
    applyModeOfApprovalFilter(countQuery, searchCriteria.modeOfApproval)
    applyModeOfApprovalFilter(selectQuery, searchCriteria.modeOfApproval)
  }

  if (searchCriteria.pastOrFuture) {
    applyPastOrFutureFilter(countQuery, searchCriteria.pastOrFuture)
    applyPastOrFutureFilter(selectQuery, searchCriteria.pastOrFuture)
  }

  if (searchCriteria.visitRules) {
    applyVisitRulesFilter(countQuery, searchCriteria.visitRules)
    applyVisitRulesFilter(selectQuery, searchCriteria.visitRules)
  }

  if (searchCriteria.visitDateFrom) {
    applyVisitDateFromFilter(countQuery, searchCriteria.visitDateFrom)
    applyVisitDateFromFilter(selectQuery, searchCriteria.visitDateFrom)
  }

  if (searchCriteria.visitDateTo) {
    applyVisitDateToFilter(countQuery, searchCriteria.visitDateTo)
    applyVisitDateToFilter(selectQuery, searchCriteria.visitDateTo)
  }

  if (searchCriteria.dateSubmittedFrom) {
    applyDateSubmittedFromFilter(countQuery, searchCriteria.dateSubmittedFrom)
    applyDateSubmittedFromFilter(selectQuery, searchCriteria.dateSubmittedFrom)
  }

  if (searchCriteria.dateSubmittedTo) {
    applyDateSubmittedToFilter(countQuery, searchCriteria.dateSubmittedTo)
    applyDateSubmittedToFilter(selectQuery, searchCriteria.dateSubmittedTo)
  }

  if (searchCriteria.dateApprovedFrom) {
    applyDateApprovedFromFilter(countQuery, searchCriteria.dateApprovedFrom)
    applyDateApprovedFromFilter(selectQuery, searchCriteria.dateApprovedFrom)
  }

  if (searchCriteria.dateApprovedTo) {
    applyDateApprovedToFilter(countQuery, searchCriteria.dateApprovedTo)
    applyDateApprovedToFilter(selectQuery, searchCriteria.dateApprovedTo)
  }

  if (searchCriteria.dateRejectedFrom) {
    applyDateRejectedFromFilter(countQuery, searchCriteria.dateRejectedFrom)
    applyDateRejectedFromFilter(selectQuery, searchCriteria.dateRejectedFrom)
  }

  if (searchCriteria.dateRejectedTo) {
    applyDateRejectedToFilter(countQuery, searchCriteria.dateRejectedTo)
    applyDateRejectedToFilter(selectQuery, searchCriteria.dateRejectedTo)
  }

  return countQuery
    .then(function (count) {
      return selectQuery
        .then(function (claims) {
          claims.forEach(function (claim) {
            claim.DateSubmittedFormatted = moment(claim.DateSubmitted).format('DD/MM/YYYY - HH:mm')
            claim.Name = claim.FirstName + ' ' + claim.LastName
          })
          return {
            claims: claims,
            total: count[0]
          }
        })
    })

  function applyReferenceFilter (query, reference) {
    query.where('Claim.Reference', 'like', `%${reference}%`)
  }

  function applyNameFilter (query, name) {
    query.whereRaw(`CONCAT(Visitor.FirstName, ' ', Visitor.LastName) like ?`, [`%${name}%`])
  }

  function applyNINumberFilter (query, ninumber) {
    query.where('Visitor.NationalInsuranceNumber', 'like', `%${ninumber}%`)
  }

  function applyPrisonerNumberFilter (query, prisonerNumber) {
    query.where('Prisoner.PrisonNumber', 'like', `%${prisonerNumber}%`)
  }

  function applyPrisonFilter (query, prison) {
    query.where('Prisoner.NameOfPrison', 'like', `%${prison}%`)
  }

  function applyAssistedDigitalFilter (query) {
    query.whereNotNull('Claim.AssistedDigitalCaseworker')
  }

  function applyClaimStatusFilter (query, claimStatus) {
    var value = claimStatusEnum[claimStatus] ? claimStatusEnum[claimStatus].value : null
    if (value === claimStatusEnum.APPROVED.value) {
      query.whereIn('Claim.Status', APPROVED_STATUS_VALUES)
    } else {
      query.where('Claim.Status', value)
    }
  }

  function applyInProgressClaimStatusFilter (query) {
    query.whereIn('Claim.Status', [ claimStatusEnum.NEW.value, claimStatusEnum.UPDATED.value ])
  }

  function applyPaidClaimStatusFilter (query) {
    query.where(function () {
      this.where('Claim.PaymentStatus', 'PROCESSED')
        .orWhere(function () {
          this.where({
            'IsAdvanceClaim': true,
            'Status': claimStatusEnum.APPROVED_ADVANCE_CLOSED.value
          })
        })
    })
  }

  function applyModeOfApprovalFilter (query, modeOfApproval) {
    modeOfApproval = claimStatusEnum[modeOfApproval] ? claimStatusEnum[modeOfApproval].value : null
    query.where('Claim.Status', modeOfApproval)
  }

  function applyPastOrFutureFilter (query, pastOrFuture) {
    if (pastOrFuture === 'past') {
      query.where('Claim.IsAdvanceClaim', 'false')
    } else {
      query.where('Claim.IsAdvanceClaim', 'true')
    }
  }

  function applyVisitRulesFilter (query, visitRules) {
    var nonEnglandScotlandWalesPrisons = []
    var northernIrelandPrisons = []
    for (var prison in prisonsEnum) {
      if (prisonsEnum[prison].region !== 'ENG/WAL' && prisonsEnum[prison].region !== 'SCO') {
        nonEnglandScotlandWalesPrisons.push(prisonsEnum[prison].value)
        if (prisonsEnum[prison].region === 'NI') {
          northernIrelandPrisons.push(prisonsEnum[prison].value)
        }
      }
    }

    if (visitRules === 'englandScotlandWales') {
      query.whereNotIn('Prisoner.NameOfPrison', nonEnglandScotlandWalesPrisons)
    } else {
      query.whereIn('Prisoner.NameOfPrison', northernIrelandPrisons)
    }
  }

  function applyVisitDateFromFilter (query, visitDateFrom) {
    query.where('Claim.DateOfJourney', '>=', visitDateFrom)
  }

  function applyVisitDateToFilter (query, visitDateTo) {
    query.where('Claim.DateOfJourney', '<=', visitDateTo)
  }

  function applyDateSubmittedFromFilter (query, dateSubmittedFrom) {
    query.where('Claim.DateSubmitted', '>=', dateSubmittedFrom)
  }

  function applyDateSubmittedToFilter (query, dateSubmittedTo) {
    query.where('Claim.DateSubmitted', '<=', dateSubmittedTo)
  }

  function applyDateApprovedFromFilter (query, dateApprovedFrom) {
    query.where('Claim.DateReviewed', '>=', dateApprovedFrom)
      .whereIn('Claim.Status', APPROVED_STATUS_VALUES)
  }

  function applyDateApprovedToFilter (query, dateApprovedTo) {
    query.where('Claim.DateReviewed', '<=', dateApprovedTo)
      .whereIn('Claim.Status', APPROVED_STATUS_VALUES)
  }

  function applyDateRejectedFromFilter (query, dateRejectedFrom) {
    query.where('Claim.DateReviewed', '>=', dateRejectedFrom)
      .where('Claim.Status', 'REJECTED')
  }

  function applyDateRejectedToFilter (query, dateRejectedTo) {
    query.where('Claim.DateReviewed', '<=', dateRejectedTo)
      .where('Claim.Status', 'REJECTED')
  }

  function createBaseQueries (limit, offset) {
    countQuery = knex('Claim')
      .join('Visitor', 'Claim.EligibilityId', '=', 'Visitor.EligibilityId')
      .join('Prisoner', 'Claim.EligibilityId', '=', 'Prisoner.EligibilityId')
      .count('Claim.ClaimId AS Count')

    selectQuery = knex('Claim')
      .join('Visitor', 'Claim.EligibilityId', '=', 'Visitor.EligibilityId')
      .join('Prisoner', 'Claim.EligibilityId', '=', 'Prisoner.EligibilityId')
      .select('Claim.Reference', 'Visitor.FirstName', 'Visitor.LastName', 'Claim.DateSubmitted', 'Claim.DateOfJourney', 'Claim.ClaimType', 'Claim.ClaimId')
      .orderBy('Claim.DateSubmitted', 'asc')
      .limit(limit)
      .offset(offset)
  }
}
