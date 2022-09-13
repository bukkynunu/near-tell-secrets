import React, { useState, useEffect, useCallback } from "react";
import {
  login,
  logout as destroy,
  accountBalance,
  getAccountId,
} from "./utils/near";
import {
  getSecrets as getSecretsList,
  addSecret,
  likeSecret,
  dislikeSecret,
  giftOwner

} from "./utils/marketplace";

import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [secrets, setSecrets] = useState([])
  const account = window.walletConnection.account();
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());

      await getSecrets();
    }
  }, [account]);

  useEffect(() => {
    if (!account.accountId) {
      login();
    }
  }, []);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const getSecrets = useCallback(async () => {
    setLoading(true);
    try {
      const secrets = await getSecretsList();
      setSecrets(secrets);
      console.log(secrets);

    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [setSecrets, secrets]);

  const gift = async (id, amount) => {
    setLoading(true);
    try {
      if(!amount)alert("Please set amount to gift")
      await giftOwner({ id, amount });
      getSecrets();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const like = async (id) => {
    setLoading(true);
    try {
      await likeSecret({ id });
      getSecrets();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const dislike = async (id) => {
    setLoading(true);
    try {
      await dislikeSecret({ id });
      getSecrets();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    console.log(text);
    if (!text) return;
    try {
      addSecret({secretText: text})
      getSecrets();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* ======= Header ======= */}
      <header id="header" className="fixed-top d-flex align-items-center">
        <div className="container d-flex justify-content-between">
          <div className="logo">
            <h1><a href="/">Secrets</a></h1>
            {/* Uncomment below if you prefer to use an image logo */}
            {/* <a href="index.html"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>*/}
          </div>
          <nav id="navbar" className="navbar">
            <ul>
              <li><a className="nav-link scrollto active" href="#hero">Home</a></li>
              <li><a className="nav-link scrollto" href="#contact">Balance: {balance} NEAR</a></li>
            </ul>
            <i className="bi bi-list mobile-nav-toggle" />
          </nav>{/* .navbar */}
        </div>
      </header>{/* End Header */}
      {/* ======= Hero Section ======= */}
      <section id="hero" className="d-flex flex-column justify-content-center align-items-center">
        <div className="container text-center text-md-left" data-aos="fade-up">
          <h1>Welcome to Secrets</h1>
          <h2>Tell your story and earn from it</h2>
          <a href="#contact " className="btn-get-started scrollto">Get Started</a>
        </div>
      </section>{/* End Hero */}
      <main id="main">
        {/* ======= Steps Section ======= */}
        <section id="steps" className="steps section-bg">
          <div className="container">
            <div className="row no-gutters">
              {secrets.map(secret => <div className="col-lg-4 col-md-6 content-item" data-aos="fade-in">
                <span>{secret.secretText}</span>
                <p>{secret.id}</p>
                <br />
                <div className='d-flex justify-content-between'>
                <div>
                <i onClick={()=>like(secret.id)} class="bi bi-hand-thumbs-up"></i>{secret.likes}
                </div>
                  <div><i onClick={()=>dislike(secret.id)} class="bi bi-hand-thumbs-down"></i>{secret.dislikes}</div>
                  
                </div>
                <div className="form-group mt-3">
                  <input type="text" className="form-control" name="amount" id="amount" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <button className='btn btn-success' onClick={() => gift(secret.id, amount)}>Gift</button>

              </div>)}
            </div>
          </div>
        </section>{/* End Steps Section */}

        {/* ======= Contact Section ======= */}
        <section id="contact" className="contact">
          <div className="container">
            <div className="section-title" data-aos="fade-up">
              <h2>Add Your Secret </h2>
              <p>Add your secret to the pool</p>
            </div>
            <div className="row mt-5 justify-content-center" data-aos="fade-up">
              <div className="col-lg-10">
                <form onSubmit={submitForm} role="form" className="php-email-form">
                  <div className="form-group mt-3">
                    <textarea className="form-control" onChange={(e) => setText(e.target.value)} name="message" rows={5} placeholder="Secrets..." required defaultValue={""} />
                  </div>
                  <div className="text-center"><button type="submit">Start Here</button></div>
                </form>
              </div>
            </div>
          </div>
        </section>{/* End Contact Section */}
      </main>{/* End #main */}
    </div>
  );
}

export default App;
