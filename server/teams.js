const db = require('./db')

function processRelationships(teamSize) {
 return db.getRelationships().then(relationships => {
    const lowestCount = relationships.reduce((acc, x) => {
      if (x.count < acc) acc = x.count
      return acc
    }, relationships[0].count)
    const highestCount = relationships.reduce((acc, x) => {
      if (x.count > acc) acc = x.count
      return acc
    }, relationships[0].count)
    let orderedArray = []
    for (let i = lowestCount; i <= highestCount; i++) {
      const result = relationships.filter(x => x.count == i)
      orderedArray.push(result)
    }
    orderedArray = orderedArray.concat.apply([], orderedArray)
    const teams = makeTeams(teamSize)

    return populateTeams(orderedArray, teams)
  })
}

function makeTeams(teamSize) {
  for (var teams=[]; teams.push([])<teamSize;){
  }
  return teams
}

function populateTeams(orderedArray, teams) {
  // I would like to point out this optimises for pairings not yet had
  // it does not address the cate-brad issue atm
  let uniqueIds = getUniqueIds(orderedArray)
  let maxSize = Math.ceil(uniqueIds.length / teams.length)

  orderedArray.forEach((pair) => {
    let pairIndexes = getIndexes(pair, teams)
    if (pairIndexes[0] + pairIndexes[1] == -2){
      teams[getEmptiest(teams)].push(pair.id_one, pair.id_two)
    } else if (pairIndexes[0] == -1 || pairIndexes[1] == -1){
      let sorted = pairIndexes[0] == -1 ? 1 : 0
      let currentTeam = teams[pairIndexes[sorted]]
      let nextTeam = (currentTeam.length < maxSize ? currentTeam : teams[getEmptiest(teams)])
      nextTeam.push(sorted == 0 ? pair.id_two : pair.id_one)
    }
  })
  return teams
}

//im making this func assuming more than just your cohort will use this
function getUniqueIds(pairsArr) {
  let arr = [];
  pairsArr.forEach((pair) => {
    if(!arr.includes(pair.id_one)) arr.push(pair.id_one)
    if(!arr.includes(pair.id_two)) arr.push(pair.id_two)
  })
  return arr
}

function getIndexes(pair, teams) {
  let arr = [-1, -1]
  teams.forEach((team, i) => {
    if(team.includes(pair.id_one)) arr[0] = i
    if(team.includes(pair.id_two)) arr[1] = i
  })
  return arr
}

function getEmptiest(teams) {
  lengthsArr = teams.map((team) => team.length)
  return lengthsArr.indexOf(Math.min.apply(Math, lengthsArr))
}

module.exports = {
  processRelationships,
  makeTeams,
  populateTeams
}
