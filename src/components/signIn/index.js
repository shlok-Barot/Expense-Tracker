import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { SignUpLink } from "../signUp/index";
import { auth } from "../../firebase";
import * as routes from "../../constants/routes";
import * as analytics from "./../../analytics/analytics";

import logo from "./../../assets/images/logo.png";

import firebase from "firebase";

const SignInPage = ({ history }) => (
  <div>
    <SignInForm history={history} />
  </div>
);

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    analytics.initGA();
    analytics.logPageView();
  }

  callGoogleSignIn = () => {
    const { history } = this.props;

    let provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;

        // The signed-in user info.
        let user = result.user;

        history.push(routes.HOME);
      })
      .catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        // The email of the user's account used.
        let email = error.email;

        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;

        alert(errorMessage, "Retry !!!");
        // ...
      });
  };

  onSubmit = (event) => {
    const { email, password } = this.state;

    const { history } = this.props;

    auth
      .doSignInWithEmailAndPassword(email.trim(), password)
      .then((authUser) => {
        // allow signin only when user is verified
        if (authUser && authUser.emailVerified) {
          this.setState(() => ({ ...INITIAL_STATE }));
          history.push(routes.HOME);
        } else {
          history.push(routes.USER_VERIFICATION);
        }
      })
      .catch((error) => {
        this.setState(byPropKey("error", error));
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;

    const imgStyle = {
      margin: "25px 35%",
    };

    const isInvalid = password === "" || email === "";

    // const fullHeight = {
    //   minHeight: "100vh",
    // };

    const areaPadding = {
      padding: "7%",
    };

    // const areaMonthPadding = {
    //   padding: "5% 7%",
    // };

    // const homeImgStyle = {
    //   verticaAlign: "middle",
    //   borderRadius: "10px",
    //   boxShadow: "100px solid red",
    //   boxShadow: "20px 20px rgba(0,0,0,0.4)",
    //   borderStyle: "none",
    //   width: "100%",
    //   height: "auto",
    // };

    return (
      <div className="container-fluid">
        <div className="row" style={{ minHeight: "88vh" }}>
          <div className="col-sm-12 col-md-6" style={areaPadding}>
            <div className="landing">
              <img src={logo} style={imgStyle} width="auto" height="100" />
              <span>
                Expense Manager which takes note of all your daily expenses
              </span>
              <hr />
              <p>
                Sign up to create an account - and start managing your expenses
              </p>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 ">
            <div className="login-page">
              <form onSubmit={this.onSubmit} className="form">
                <input
                  value={email}
                  onChange={(event) =>
                    this.setState(byPropKey("email", event.target.value))
                  }
                  type="text"
                  placeholder="Email Address"
                />
                <input
                  value={password}
                  onChange={(event) =>
                    this.setState(byPropKey("password", event.target.value))
                  }
                  type="password"
                  placeholder="Password"
                />
                <button disabled={isInvalid} type="submit">
                  Sign In
                </button>

                <p>
                  <Link to={routes.PASSWORD_FORGET}>Forgot password?</Link>
                </p>
                <hr />
                <div
                  type="button"
                  onClick={this.callGoogleSignIn}
                  className="googleSignIn"
                >
                  <span className="googleLogo">
                    <i className="fa fa-google" />
                  </span>
                  Sign in with google
                </div>

                {error && <p>{error.message}</p>}
              </form>
              <SignUpLink />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SignInPage);

export { SignInForm };
