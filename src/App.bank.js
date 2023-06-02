import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
import { Chart } from './Chart';
import { Series } from './Chart';

const initialData = [
    { time: '2018-10-11', value: 52.89 },
    { time: '2018-10-12', value: 51.65 },
    { time: '2018-10-13', value: 51.56 },
    { time: '2018-10-14', value: 50.19 },
    { time: '2018-10-15', value: 51.86 },
    { time: '2018-10-16', value: 51.25 },
];
const currentDate = new Date(initialData[initialData.length - 1].time);

// export const App = props => {
function App(props) {

    const {
        colors: {
            backgroundColor = 'white',
            lineColor = '#2962FF',
            textColor = 'black',
        } = {},
    } = props;

    const [chartLayoutOptions, setChartLayoutOptions] = useState({});

    const series1 = useRef(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (series1.current === null) {
            return;
        }

        if (started) {
            const interval = setInterval(() => {
                currentDate.setDate(currentDate.getDate() + 1);
                const next = {
                    time: currentDate.toISOString().slice(0, 10),
                    value: 53 - 2 * Math.random(),
                };
                series1.current.update(next);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [started]);

    useEffect(() => {
        setChartLayoutOptions({
            background: {
                color: backgroundColor,

            },
            textColor,
        });
    }, [backgroundColor, textColor]);

    return (
        <>
            <button type="button" onClick={() => setStarted(current => !current)}>
                {started ? 'Stop updating' : 'Start updating series'}
            </button>
            <Chart layout={chartLayoutOptions}>
                <Series
                    ref={series1}
                    type={'line'}
                    data={initialData}
                    color={lineColor}
                />
            </Chart>
        </>
    );
};

export default App;