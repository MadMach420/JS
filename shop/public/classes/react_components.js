class Device extends React.Component {
    render() {
        return (
            <div className="col-md-4">
                <div className="card animate">
                    <img className="card-img-top" src={this.props.device.photoUrl} alt="Card image cap" />
                    <div className="card-body">
                        <h4 className="card-title">{ this.props.device.name }</h4>
                        <h5 className="card-subtitle text-muted">{ this.props.device.type }, { this.props.device.subtype }</h5>
                        <p className="card-text">{this.props.device.description}</p>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">{ this.props.device.quantity } available</li>
                        <li className="list-group-item">Price: { this.props.device.price }</li>
                    </ul>
                </div>
            </div>
        )
    }
}


class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = { devices: [], filter: null }

        this.updateDevices = this.updateDevices.bind(this);
        this.setFilter = this.setFilter.bind(this);

        window.addEventListener("updateDevices", this.updateDevices);
        window.addEventListener("setFilter", this.setFilter);
        window.dispatchEvent(new Event("devicesContainerLoaded"));
    }

    updateDevices(e) {
        this.setState({ devices: e.detail });
    }

    setFilter(e) {
        this.setState({ filter: e.detail })
    }

    render() {
        return (
            <div className="row" id="device-container">
                {
                    this.state.devices
                        .filter(item => {
                            if (!this.state.filter) return true;
                            return this.state.filter.type == item.type && this.state.filter.subtype == item.subtype;
                        }).map(item => (
                            <Device key={item.name} device={item} />
                        ))
                }
            </div>
        );
    }
}


const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Container />);