class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            animationRunning: false,
            intervalId: -1
        };

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.step = this.step.bind(this);
    }

    start() {
        this.setState({ intervalId: setInterval(this.step, 1000) });
        this.setState({ animationRunning: true });
    }

    stop() {
        clearInterval(this.state.intervalId);
        this.setState({ animationRunning: false });
    }

    step() {
        let newCounter = this.state.counter + 1;
        this.setState({ counter: newCounter });
    }

    render() {
        return (
            <div>
                <div>Counter→ <span className="counter">{this.state.counter}</span></div>
                <button onClick={this.start} disabled={this.state.animationRunning}>Start</button>
                <button onClick={this.stop} disabled={!this.state.animationRunning}>Stop</button>
            </div>
        );
    }
}


class PrimeContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = { result: '' };

        this.changeResult = this.changeResult.bind(this);
    }

    changeResult(newResult) {
        this.setState({ result: newResult });
    }

    render() {
        return (
            <div>
                <PrimeOutput result={this.state.result} />
                <PrimeInput changeResult={this.changeResult} />
            </div>
        );
    }
}


class PrimeOutput extends React.Component {
    render() {
        return <div>Result: {this.props.result}</div>
    }
}


class PrimeInput extends React.Component {
    constructor(props) {
        super(props);

        this.calculateInWorker = this.calculateInWorker.bind(this);
    }

    calculateInWorker() {
        const iterations = document.getElementById("iterations-input").value;

        const worker = new Worker("./worker.js");
        worker.addEventListener("message", (message) => {
            const newResult = message.data.result;
            this.props.changeResult(newResult);
        }, false);

        worker.postMessage({ "iterations": iterations });
    }


    render() {
        return (
            <div>
                Number of iterations:
                <input id="iterations-input"></input>
                <button onClick={this.calculateInWorker}>Run calculations</button>
            </div>
        );
    }
}


class Animation extends React.Component {
    render() {
        return (
            <div>
                <Counter />
                <PrimeContainer />
                <Counter />
                <PrimeContainer />
            </div>
        );
    }
}


const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Animation />);
