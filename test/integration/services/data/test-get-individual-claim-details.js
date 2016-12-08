var expect = require('chai').expect
var moment = require('moment')
var databaseHelper = require('../../../helpers/database-setup-for-tests')

var getClaim = require('../../../../app/services/data/get-individual-claim-details')
var reference = 'INDIVCD'
var testData
var date
var claimId

describe('services/data/get-individual-claim-details', function () {
  describe('get', function () {
    before(function () {
      testData = databaseHelper.getTestData(reference, 'Test')
      date = moment().toDate()
      return databaseHelper.insertTestData(reference, date, 'Test').then(function (ids) {
        claimId = ids.claimId
      })
    })

    it('should return a claims details', function () {
      return getClaim(claimId)
        .then(function (result) {
          expect(result.claim.Reference).to.equal(reference)
          expect(result.claim.ClaimType).to.equal('first-time')
          expect(result.claim.IsAdvanceClaim).to.equal(false)
          expect(result.claim.FirstName).to.equal(testData.Visitor.FirstName)
          expect(result.claim.DateSubmitted.toString()).to.equal(date.toString())
          expect(result.claim.NationalInsuranceNumber).to.equal(testData.Visitor.NationalInsuranceNumber)
          expect(result.claim.HouseNumberAndStreet).to.equal(testData.Visitor.HouseNumberAndStreet)
          expect(result.claim.EmailAddress).to.equal(testData.Visitor.EmailAddress)
          expect(result.claim.PrisonNumber).to.equal(testData.Prisoner.PrisonNumber)
          expect(result.claim.NameOfPrison).to.equal(testData.Prisoner.NameOfPrison)
          expect(result.claimExpenses[0].ExpenseType).to.equal(testData.ClaimExpenses[0].ExpenseType)
          expect(result.claimExpenses[0].DocumentStatus).to.equal(testData.ClaimDocument['expense'].DocumentStatus)
          expect(result.claimExpenses[1].Cost).to.equal(testData.ClaimExpenses[1].Cost)
          expect(result.claim.visitConfirmation.DocumentStatus).to.equal(testData.ClaimDocument['visit-confirmation'].DocumentStatus)
          expect(result.claim.benefitDocument[0].DocumentStatus).to.equal(testData.ClaimDocument['benefit'].DocumentStatus)
          expect(result.claimChild[0].Name).to.equal(testData.ClaimChild[0].Name)
          expect(result.claimChild[1].Name).to.equal(testData.ClaimChild[1].Name)
          expect(result.claimEvents[0].Caseworker).to.equal(testData.ClaimEvent[0].Caseworker)
          expect(result.claimEvents[1].Caseworker).to.equal(testData.ClaimEvent[1].Caseworker)
          expect(result.deductions[0].DeductionType).to.equal(testData.ClaimDeduction['hc3'].DeductionType)
          expect(result.deductions[1].DeductionType).to.equal(testData.ClaimDeduction['overpayment'].DeductionType)
        })
        .catch(function (error) {
          throw error
        })
    })

    after(function () {
      return databaseHelper.deleteAll(reference)
    })
  })
})
