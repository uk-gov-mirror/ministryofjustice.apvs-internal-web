var expect = require('chai').expect
var updateAutoApprovalConfig = require('../../../../app/services/data/update-auto-approval-config')
var config = require('../../../../knexfile').migrations
var knex = require('knex')(config)
var dateFormatter = require('../../../../app/services/date-formatter')
var defaultsConfig = require('../../../../config')

var insertedIds = []

describe('services/data/update-auto-approval-config', function () {
  var existingAutoApprovalId

  before(function () {
    return getCurrentAutoApprovalConfigId()
      .then(function (currentAutoApprovalConfigId) {
        if (currentAutoApprovalConfigId) {
          existingAutoApprovalId = currentAutoApprovalConfigId.AutoApprovalConfigId
          return setIsEnabled(existingAutoApprovalId, false)
        } else {
          return Promise.resolve()
        }
      })
      .then(function () {
        return insertTestData()
      })
  })

  it('should disable the current Auto Approval config and insert the new one', function () {
    var AutoApprovalConfig = {
      caseworker: 'second-caseworker',
      autoApprovalEnabled: 'true',
      costVariancePercentage: null,
      maxClaimTotal: null,
      maxDaysAfterAPVUVisit: null,
      maxNumberOfClaimsPerYear: null,
      MaxNumberOfClaimsPerMonth: null,
      NumberOfConsecutiveAutoApprovals: null,
      rulesDisabled: ['auto-approval-rule-1', 'auto-approval-rule-2']
    }
    return updateAutoApprovalConfig(AutoApprovalConfig)
      .then(function (result) {
        insertedIds.push(result)
        return knex('AutoApprovalConfig')
          .where('IsEnabled', true)
          .orderBy('DateCreated', 'desc')
          .first()
          .then(function (result) {
            expect(result.Caseworker).to.equal('second-caseworker')
            expect(result.AutoApprovalEnabled).to.equal(true)
            expect(result.CostVariancePercentage).to.equal(null)
            expect(result.RulesDisabled).to.equal('auto-approval-rule-1,auto-approval-rule-2')
            expect(result.CostPerMile, 'should have set CostPerMile to default').to.equal(parseFloat(defaultsConfig.AUTO_APPROVAL_COST_PER_MILE))
          })
      })
  })

  it('should disable the current Auto Approval config and insert the new one if rulesDisabled is null', function () {
    var AutoApprovalConfig = {
      caseworker: 'second-caseworker',
      autoApprovalEnabled: 'false',
      costVariancePercentage: null,
      maxClaimTotal: null,
      maxDaysAfterAPVUVisit: null,
      maxNumberOfClaimsPerYear: null,
      MaxNumberOfClaimsPerMonth: null,
      NumberOfConsecutiveAutoApprovals: null,
      rulesDisabled: null
    }
    return updateAutoApprovalConfig(AutoApprovalConfig)
      .then(function (result) {
        insertedIds.push(result)
        return knex('AutoApprovalConfig')
          .where('IsEnabled', true)
          .orderBy('DateCreated', 'desc')
          .first()
          .then(function (result) {
            expect(result.Caseworker).to.equal('second-caseworker')
            expect(result.AutoApprovalEnabled).to.equal(false)
            expect(result.CostVariancePercentage).to.equal(null)
            expect(result.RulesDisabled).to.equal(null)
          })
      })
  })

  after(function () {
    return knex('AutoApprovalConfig')
      .whereIn('AutoApprovalConfigId', insertedIds)
      .del()
      .then(function () {
        if (existingAutoApprovalId) {
          return setIsEnabled(existingAutoApprovalId, true)
        }
      })
  })
})

function insertTestData () {
  return knex('AutoApprovalConfig')
    .insert({
      Caseworker: 'first-caseworker',
      DateCreated: dateFormatter.now().toDate(),
      AutoApprovalEnabled: 'true',
      CostVariancePercentage: '5.00',
      MaxClaimTotal: '100.00',
      MaxDaysAfterAPVUVisit: '28',
      MaxNumberOfClaimsPerYear: '10',
      MaxNumberOfClaimsPerMonth: '2',
      NumberOfConsecutiveAutoApprovals: '4',
      RulesDisabled: 'auto-approval-rule-1,auto-approval-rule-2,auto-approval-rule-3',
      CostPerMile: '0.13',
      IsEnabled: 'true'
    })
    .returning('AutoApprovalConfigId')
    .then(function (result) {
      insertedIds.push(result[0])
    })
}

function setIsEnabled (autoApprovalConfigId, isEnabled) {
  return knex('IntSchema.AutoApprovalConfig')
    .where('AutoApprovalConfigId', autoApprovalConfigId)
    .update({
      IsEnabled: isEnabled
    })
}

function getCurrentAutoApprovalConfigId () {
  return knex('IntSchema.AutoApprovalConfig')
    .first()
    .where('IsEnabled', true)
    .select('AutoApprovalConfigId')
}
