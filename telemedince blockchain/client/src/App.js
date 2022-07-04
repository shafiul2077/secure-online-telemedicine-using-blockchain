import React, { Component } from "react";

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const ipfsClient = require("ipfs-http-client");

//gateway : ipfs.infura.io or localhost
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});
// const ipfs = ipfsClient("http://localhost:5001");

class App extends Component {
  state = {
    file: null,
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    ipfsHash: null,
    buffer: "",
    links: "",
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ file: null, links: "", buffer: "", ipfsHash: null });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(1100000).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });

    // const temp_hash = "this_is_a_temp_hash_101";

    // const sender_addr = await contract.methods
    //   .addfile(temp_hash)
    //   .send({ from: accounts[0] });
    // console.log(sender_addr.from);
    // const return_hash = await contract.methods
    //   .getfile(sender_addr.from, 0)
    //   .call();
    // console.log("return_hash : ", return_hash);
  };

  captureFile = (event) => {
    event.preventDefault();
    console.log("event.target.files are here : ", event.target.files);
    this.setState({ file: event.target.files });
    this.setState({ links: "", buffer: "", ipfsHash: null });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    console.log("Submitting file to ipfs... files are:", this.state.file);
    const file = this.state.file;

    console.log("file got from this.state.file", file);
    const output = await ipfs.add(file);
    const hash = output.cid.toString();
    console.log(
      "Ipfs add call output link",
      "https://gateway.ipfs.io/ipfs/" + hash
    );
    this.setState({ ipfsHash: hash });
    // .then((result) => {
    //   console.log("Ipfs add call output: result", result);

    // console.log("result cid string", result.cid.toString());
    console.log("hash value being sent to addfile method : ", hash);
    console.log("ipfsHash state value : ", this.state.ipfsHash);
    const add_result = await contract.methods
      .addfile(hash)
      .send({ from: accounts[0] });
    console.log("add result: ", add_result);
    const filelink = await contract.methods.getfile().call();
    //   .then(async (r) => {
    //
    console.log("get result: ", filelink);
    this.setState({
      links: "https://gateway.ipfs.io/ipfs/" + filelink,
    });
    //     // const response = await contract.methods.getfile().call();
    console.log(
      "here is your link: ",
      "https://gateway.ipfs.io/ipfs/" + filelink
    );
    // })
    // .catch((error) => {
    //   console.error("error", error);
    // });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App has-background-dark ">
        {/* <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div className="title is-1 has-text-primary">
          The stored value is: {this.state.storageValue}
        </div> */}
        <nav className="level">
          <p className="level-item has-text-centered">
            <h1 className="title is-1 has-text-primary">
              Ethereum Blockchain Based Prescrption Sharing
            </h1>
          </p>
        </nav>
        <h2 className="subtitle is-2 has-text-white">Upload Your Prescription Below: </h2>

        <form onSubmit={this.onSubmit}>
          {/* <input
            type="file"
            name="input-file"
            id="input-file"
            onChange={this.captureFile}
            multiple
          /> */}
          {/* <div className="file is-boxed is-centered">
            <label className="file-label">
              <input
                className="file-input"
                type="file"
                name="file"
                onChange={this.captureFile}
                multiple
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload" />
                </span>
                <span className="file-label">Choose files…</span>
              </span>
            </label>
          </div> */}
          <div className="field">
            <div className="file is-centered is-boxed is-success">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  name="resume"
                  onChange={this.captureFile}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload" />
                  </span>
                  <span className="file-label">Upload Prescription</span>
                </span>
              </label>
            </div>
          </div>
          <br />
          <div className="buttons is-centered">
            <button className="button is-link">Submit</button>
          </div>
        </form>
        <section className="section">
          <div className="container">
            <h3 className="subtitle is-3 has-text-primary">Send this download link to your patient</h3>
            <div>
              {this.state.links.length ? (
                <ul key={this.state.links}>
                  <a
                    className="has-text-white"
                    href={this.state.links}
                    key={this.state.links}
                  >
                    {this.state.links}
                  </a>
                </ul>
              ) : (
                <h3 className="subtitle is-3 has-text-white">
                  {" "}
                  Sorry ! No prescription has been uploaded yet
                </h3>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
