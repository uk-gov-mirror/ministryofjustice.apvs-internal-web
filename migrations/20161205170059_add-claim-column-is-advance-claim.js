exports.up = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.boolean('IsAdvanceClaim')
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.dropColumn('IsAdvanceClaim')
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}
