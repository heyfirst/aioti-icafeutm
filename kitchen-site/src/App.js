import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NotificationSystem from 'react-notification-system'
import { compose, withState, withHandlers } from 'recompose'

/* global firebase */

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order: [],
      foods: []
    }
  }

  async componentWillMount() {
    await firebase.database().ref().child('/orders')
    .orderByKey().limitToLast(500)
      .on('value', snapshot => {
        this.setState({ order: snapshot.val() })
        this._notificationSystem.addNotification({
          message: 'New order is comming.',
          level: 'success'
        });
      })
    await firebase.database().ref().child('/foods')
      .once('value').then(snapshot => {
        let raw = snapshot.val()
        let foods = Object.keys(raw)
        .reverse()
        .map(key => ({
          key,
          data: raw[key]
        }))
        this.setState({ foods })
      })
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
  }

  render() {
    return (
      <div>
        <NotificationSystem ref="notificationSystem" />
        <KitchenCompose orderList={this.state.order} foods={this.state.foods}/>
      </div>
    );
  }
}

const Kitchen = (props) => {
  if(props.orderList === null) {
    return <div />
  }
  const order = Object.keys(props.orderList)
    .reverse()
    .map(key => ({
      key,
      data: props.orderList[key]
    }))
  return (
    <div className="App">
      <nav className="navbar navbar-light bg-faded">
        <a className="navbar-brand" href="#">iCafe @ UTM</a>
      </nav>
      <h1 className="text-center">Kitchen Dashboard</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-6">
            <div className="card">
              <ul className="list-group list-group-flush">
                {
                  order.map(o => (
                    <a
                      key={o.key}
                      href="#"
                      className={"list-group-item " + (props.orderKey === o.key ? 'active' : '')}
                      onClick={() => props.setOrderKey(o.key)}
                    >
                      {`ORDER:  ${o.key} `}

                      {
                        o.data.payment && (<span className="badge badge-success">PAY</span>)
                      }
                    </a>
                  ))
                }
              </ul>
            </div>
          </div>
          <div className="col-6">
            <Order order={order.find(o => o.key === props.orderKey)} foods={props.foods}/>
          </div>
        </div>
      </div>
    </div>
  )
}

const KitchenCompose = compose(
  withState('orderKey','setOrderKey',''),
)(Kitchen)

const Order = props => {
  if( props.order === undefined) {
    return <div />
  }

  let order = props.order
  return (
    <div className="card">
      <div className="card-block text-left">
        <h3 className="card-title">{order.data.table}</h3>
        <p>just a table on the iCafe : )</p>
      </div>
      <ul className="list-group list-group-flush">
        {
          order.data.menus.map(m => {
            return (<li key={m.food} href="#" className="list-group-item">{m.food} x {m.quantity}</li>)
          })
        }
      </ul>
      <div className="card-block">
        <h5 className="text-right">
          {'Total price: RM'}
          {
            Math.round(order.data.menus.reduce( (sum,m) => {
                return sum + props.foods.find(f => m.food === f.data.name).data.price * m.quantity
              }, 0) * 100) / 100
          }
        </h5>
      </div>
    </div>
  )
}

export default App;
