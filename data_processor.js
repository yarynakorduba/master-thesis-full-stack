const json = require('./src/api/data/AIR_Q_TU_Graz/output_chunk_1.json');
const fs = require('node:fs');
const res = json.map(datum => {
    return {
        oxygen: datum.oxygen[0],
        timestamp: datum.timestamp,
        health: datum.health,
        dewpt: datum.dewpt[0],
        no2: datum.no2?.[0] || undefined,
        TypPS: datum.TypPS,
        tvoc: datum.tvoc?.[0],
        gauss: Math.random(0.0, 1.0)
    }
})


fs.writeFile('./src/api/data/AIR_Q_TU_Graz/test.json', JSON.stringify(res), err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });