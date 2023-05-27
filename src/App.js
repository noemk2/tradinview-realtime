import Chart from "kaktana-react-lightweight-charts";

const options = {
  timeScale: {
    tickMarkFormatter: (time) => {
      // from https://jsfiddle.net/TradingView/350xh1zu/ which came from "Tick marks formatter" example at https://www.tradingview.com/lightweight-charts/
      const date = new Date(time.year, time.month, time.day);
      const formattedTick =
        date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      console.log({ formattedTick });
      return formattedTick;
    }
  }
};

const mainSeriesData = [
  { time: { year: 2018, month: 9, day: 23 }, value: 18.586765395788515 },
  { time: { year: 2018, month: 9, day: 24 }, value: 16.67923813275883 },
  { time: { year: 2018, month: 9, day: 25 }, value: 18.139367606990206 },
  { time: { year: 2018, month: 9, day: 26 }, value: 19.175341064495118 },
  { time: { year: 2018, month: 9, day: 27 }, value: 17.026133664805055 },
  { time: { year: 2018, month: 9, day: 28 }, value: 17.862891721122114 },
  { time: { year: 2018, month: 9, day: 29 }, value: 18.307393426640242 },
  { time: { year: 2018, month: 9, day: 30 }, value: 20.870050581795134 },
  { time: { year: 2018, month: 10, day: 1 }, value: 19.004329503393258 },
  { time: { year: 2018, month: 10, day: 2 }, value: 19.442993891919564 },
  { time: { year: 2018, month: 10, day: 3 }, value: 19.104414198492133 },
  { time: { year: 2018, month: 10, day: 4 }, value: 22.075521421139175 },
  { time: { year: 2018, month: 10, day: 5 }, value: 19.100220372613407 },
  { time: { year: 2018, month: 10, day: 6 }, value: 20.66834030878228 },
  { time: { year: 2018, month: 10, day: 7 }, value: 19.833283354440272 }
];

const lineSeries = [
  {
    data: mainSeriesData,
    options: {
      title: "Portfolio Value"
    }
  }
];

function getTimeBoundaries(series) {
  // See also https://github.com/tradingview/lightweight-charts/blob/v3.3.0/docs/time-scale.md#fitcontent
  return {
    from: series[0].time,
    to: series[series.length - 1].time
  };
}

export default function App() {
  const { from, to } = getTimeBoundaries(mainSeriesData);
  console.log("lineSeries", JSON.stringify(lineSeries, null, 2));
  return (
    <Chart
      options={options}
      lineSeries={lineSeries}
      autoWidth
      height={300}
      from={from}
      to={to}
    />
  );
}
