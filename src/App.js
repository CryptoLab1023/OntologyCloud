import React, { Component } from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Button from '@material-ui/core/Button';
import { Route, Switch, withRouter } from 'react-router-dom';
import { client, Parameter } from 'ontology-dapi';
import { Login, SignUp } from './components/auth/Auth';
import CustomizedTable from './components/table/Table';
import fs from 'fs';
import Input from '@material-ui/core/Input';
import FormLabel from '@material-ui/core/FormLabel';

import './App.css';

const scriptHash = 'a35c358b9f7aed5538700ddbbf075ae9e2452b37'; /** contract hash */

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      head: ['address', 'price', 'storage', ''],
      historyHead: ['address', 'price', 'storage', ''],
      body: [],
      account: '',
      loginFlg: true,
    };
    client.registerClient({});
  }

  registerAccount = (name, email, password) => {
    const data = JSON.stringify({name, email, password})
    fs.writeFile('./users.txt', data, (err) => {
      if (err) throw 0;
    });
  }

  login = (email, password) => {
    const registData = fs.readFile('./user.txt');
    const result = registData.indexOf(email);
    if (result !== -1) {
      this.setState({ loginflag: true });
    } else {
      alert('login error');
    }
  }

  logout = () => {
    this.setState({
      loginFlg: false
    });
  }

  registStrage = () => {
    fs.writeFile('./user_storage.txt', this.state.data, (err) => {
      if (err) throw 0;
    });
  }

  displayAccountInfo = () => {
    fs.readFile('./user_storage.txt', (err, data) => {
      if (err) throw 0;
      this.setState({ data: data });
    });
  }

  buy = async (myaddress, address, price) => {
    console.log(myaddress, address, price)
    await this.callContract('buy', [{ type: 'String', value: myaddress },{ type: 'String', value: address }, {type: 'Integer', value: price}]);
  }

  callContractRead = async (operation, parameter) => {
    const args: Parameter[] = parameter;
    return await client.api.smartContract.invokeRead({ scriptHash, operation, args });
  }

  callContract = async (operation, parameter) => {
    const args: Parameter[] = parameter;
    const gasPrice = 500;
    const gasLimit = 30000;
    return await client.api.smartContract.invoke({ scriptHash, operation, args, gasPrice, gasLimit });
  }

  callContractNonArg = async (operation, parameter) => {
    const gasPrice = 500;
    const gasLimit = 30000;
    return await client.api.smartContract.invoke({ scriptHash, operation, gasPrice, gasLimit });
  }

  setPrice = async (price) => {
    await this.callContract('setPrice', [{ type: 'Integer', value: price }])
  }

  registerStorage = async () => {
    await this.callContract('registerStorage', [{ type: 'String', value: this.state.account }, { type: 'Integer', value: this.state.registerPrice }, { type: 'Integer', value: this.state.registerAmount}])
  }

  updateStorage = async () => {
    await this.callContract('registerStorage', [{ type: 'String', value: this.state.account }, { type: 'Integer', value: this.state.updatePrice }, { type: 'Integer', value: this.state.updateAmount}])
  }

  deleteStorage= async () => {
    await this.callContract('delete', [{ type: 'String', value: this.state.account }])
  }

  getInformation = async () => {
    const account = await client.api.asset.getAccount();
    const balance = await client.api.network.getBalance({ address: account });
    const provider = await client.api.provider.getProvider();
    const price = await this.callContractRead('getPrice', [{ type: 'String', value: account }])
    const amount = await this.callContractRead('getAmount', [{ type: 'String', value: account }])
    let body = await this.callContractRead('showAll', [])
    if (body == "00")
        body = []
    // let history = await this.callContractRead('getHistory', [{ type: 'String', value: account }])
    console.log({account, price, amount, balance, body})
    this.setState({ account, balanceOng: balance.ONG, balanceOnt: balance.ONT, provider, amount: parseInt(amount.toString(), 16), price: parseInt(price.toString(), 16), body });
  }

  componentDidMount = async () => {
    setInterval(() => this.getInformation(), 1000)
  }

  render() {

    const box = {
        marginBottom: 50
    }

    const input = {
      marginRight: 20,
      marginLeft: 20,
      textAlign: 'center'
    }

    return (
      <div className="App">
        <Header
          loginFlg={this.state.loginFlg}
          logout={this.logout}
          account={this.state.account}
          balanceOng={this.state.balanceOng}
          balanceOnt={this.state.balanceOnt}
        />
        {
          this.state.loginFlg ?
            <div style={{ width: '90vw', margin: 'auto', marginTop: 20, }}>
              {/** 入力 */}
              {( this.state.amount && this.state.price ) ?
                <div style={box}>
                <h3>Update Storage Price Ordered</h3>
                  Storage: {this.state.amount} GB, Price: {this.state.price} ONT
                  <Input type="text" style={input} placeholder="Fill in Number" onChange={(e) => this.setState({ updatePrice: e.target.value })} value={this.state.updatePrice} required/>
                  <Input type="text" style={input} placeholder="Fill in Number" onChange={(e) => this.setState({ updateAmount: e.target.value })} value={this.state.updateAmount} required />
                  <Button variant="contained" color={'primary'} onClick={() => this.updateStorage()}>Update</Button>
                  <Button variant="contained" color={'secondary'} onClick={() => this.deleteStorage()}>Delete Storage</Button>
                </div>
                :
                <div style={box}>
                  <h3>Register your Storage</h3>
                  <FormLabel htmlFor="">storage price:</FormLabel>
                  <Input type="text" style={input} onChange={event => this.setState({ registerPrice: event.target.value })} value={this.state.registerPrice} required/>
                  <FormLabel htmlFor="">storage volume:</FormLabel>
                  <Input type="text" style={input} onChange={event => this.setState({ registerAmount: event.target.value })} value={this.state.registerAmount} required/>
                  <Button variant="contained" color={'primary'} onClick = {() => this.registerStorage()}>Register Storage</Button>
                </div>
              }
              { /** 出力 */}
              {
                this.state.body &&
                <div style={box}>
                  <h3>Market Prace</h3>
                  <CustomizedTable account={this.state.account} buy={this.buy} head={this.state.head} body={this.state.body} />
                </div>
              }
              {
                this.state.history &&
                <div style={box}>
                  <h3>Hisotory</h3>
                  <CustomizedTable account={this.state.account} buy={this.buy} head={this.state.historyHead} body={this.state.history} />
                </div>
              }
          </div> :
          <Switch>
              <Route exact path="/login"
                render={props => <Login login={this.login} name={this.state.name} email={this.state.email} password={this.state.password} setData={this.setData} {...props} />}
              />
              <Route exact path="/signup"
                render={props => <SignUp registerAccount={this.registerAccount} name={this.state.name} email={this.state.email} password={this.state.password} setData={this.setData} {...props} />}
              />
          </Switch>
        }
        <Footer />
        {/* <Button onClick={()=>console.log(this.state)}>aaa</Button> */}
      </div>
    );
  }
}

export default withRouter(App);
