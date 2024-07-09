var canvas1 = document.getElementById('stage1');

//const outputElement = document.getElementById('output_csv');

async function getCsvGraph() {
  var date = new Date();    // Dateオブジェクトを作成
  var a = date.getTime();   // UNIXタイムスタンプを取得する (ミリ秒単位)
  var curr_time = Math.floor( a / 1000 );  // UNIXタイムスタンプを取得する (秒単位)

    var tt = curr_time - 3600*24   // 24時間前
    const res = await fetch(`https://proxy.cep-hd-dlp.chuden.co.jp/data-n8suh89sqhcjo5g5/data-api/day-csv?id=CgETViZ2&subscription-key=0e35a874f02a4887adc1ed0b2561f645&startDate=${tt}`);
    console.log("aaa");
    const raw_data = await res.text();
    const data = convertArray(raw_data);
    for (var row of data){
      row[3] = (row[3] - curr_time) / 3600;  // 秒を時間に変換
    }

    co2data = [];
    tempdata = [];
    RHdata = [];
    for (var row of data){
      co2data.push({x: row[3], y:row[0]});
      //tempdata.push({x: row[3], y:row[1]});
      //RHdata.push({x: row[3], y:row[2]});
    }
  var co2Chart = drawGraph(canvas1, co2data, 'CO2 濃度 [ppm]');

};

function drawGraph(canv, data, ylabel) {
  var chart = new Chart(canv, {
    type: 'scatter',
    data: {
      datasets: [{
        showLine: true,
        data: data,
        borderColor: '#ffffff',
      }]
    },
    options: {
      elements: {
         point:{
          radius: 0
        },
      },
      plugins: {
        legend: {// 凡例の非表示
          display: false
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Time [時間]',  // 単位を時間に変更
            font: {
              size: 28,
              family: 'serif',
            }
          }
        },
        y: {
          title: {
            display: true,
            text: ylabel,
            font: {
              size: 28,
              family: 'serif',
            }
          }
        },
      },
    }
  });
  return chart;
}

function convertArray(data) {
  const dataArray = [];
  const dataString = data.split('\r\n');
  for (let i = 0; i < dataString.length; i++) {
    var data=dataString[i].split(',');
    if (data[1]=='Ｒ３ー４０１'){ 
      dataArray.push(data.slice(3,7).map(parseFloat));
    }
  }
  return dataArray;
}

getCsvGraph();
console.log("bbb");
