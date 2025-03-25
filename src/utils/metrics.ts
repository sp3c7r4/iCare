export const counters = { db1Reads: 0, db1Writes: 0, db2Reads: 0, db2Writes: 0 }

export const metric = {
  readFromDB1: function () {
    counters.db1Reads += 1;
    console.log(counters)
  },
  writeToDB1: function() {
    counters.db1Writes += 1;
    console.log(counters)
  },
  readFromDB2: function () {
    counters.db2Reads += 1;
    console.log(counters)
  },
  writeToDB2: function() {
    counters.db2Writes += 1;
    console.log(counters)
  },
  memoryUsage: function () { 
    return process.memoryUsage() 
  },
  cpuUsage: function() { 
    return process.cpuUsage() 
  }
}