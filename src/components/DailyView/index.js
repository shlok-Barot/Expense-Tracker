import React, { Component } from "react";

import ExpenseTable from "./ExpenseTable.js";
import TotalCard from "./TotalCard";
import CategoryTotalCard from "./CategoryTotalCard";
import MobileExpenseTable from "./MobileExpenseTable";
import DoughnutChart from "./DoughnutChart";
import GenerateExcel from "./GenerateExcel";
import Loader from "./../Common/Loader";
import { DatePicker } from "antd";
import moment from "moment";
import * as analytics from "./../../analytics/analytics";

class DailyViewPage extends Component {
  constructor(props) {
    super(props);

    function parseURLParams(url) {
      var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {},
        i,
        n,
        v,
        nv;

      if (query === url || query === "") return;

      for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
      }
      return parms;
    }

    var urlString = window.location.href;
    var urlParams = parseURLParams(urlString);

    this.state = {
      date: urlParams ? moment(urlParams.date[0]) : moment(),
      convertedCurrency: null,
    };
  }

  handelDateSelect(date) {
    this.setState({
      date: date,
    });
  }

  componentDidMount() {
    analytics.initGA();
    analytics.logPageView();

    if (this.props.settings) {
      this.setState({ convertedCurrency: 1 });
    }
  }

  render() {
    const form = {
      padding: window.screen.width > 720 ? "15px 0 0 0" : "15px",
    };

    const pad15 = {
      padding: "15px",
    };

    const styleFromSettings = {
      fontFamily: this.props.settings ? this.props.settings.font : "sans-serif",
      backgroundColor: this.props.settings
        ? this.props.settings.mode === "night"
          ? "#484842"
          : "auto"
        : "auto",
      minHeight: "91vh",
    };

    const nmBgForCharts = {
      backgroundColor: this.props.settings
        ? this.props.settings.mode === "night"
          ? "#2C3034"
          : "#EDF0EF"
        : "#EDF0EF",
      padding: "35px",
      margin: "15px 0",
    };

    const rightCol = { paddingLeft: "0" };

    const white = {
      color: this.props.settings
        ? this.props.settings.mode === "night"
          ? "#fff"
          : "#000"
        : "#000",
    };

    if (this.props.settings && this.props.cards) {
      return (
        <div className="container-fluid" style={styleFromSettings}>
          <div className="row">
            <div className="col-sm-4 mobileNoPadding">
              <form onSubmit={this.handleSubmit} style={form}>
                {/* <div style={datePickerHeader}> View your expenses on a particular date </div> */}
                <div className="form-group row mobileNoPadding">
                  <label className="col-2 col-form-label" style={white}>
                    <span>Date</span>
                  </label>
                  <div className="col-10 datepicker">
                    <DatePicker
                      className={
                        "form-control date " +
                        (this.props.settings.mode === "night"
                          ? "inputNightMode"
                          : "inputDayMode")
                      }
                      name="date"
                      format={"DD-MM-YYYY"}
                      value={this.state.date}
                      onChange={this.handelDateSelect.bind(this)}
                    />
                  </div>
                </div>
              </form>
              <TotalCard
                expenses={this.props.expenses}
                date={this.state.date.format("MM/DD/YYYY")}
                authUser={this.props.user}
                settings={this.props.settings}
                cards={this.props.cards}
              />
              <CategoryTotalCard
                expenses={this.props.expenses}
                date={this.state.date.format("MM/DD/YYYY")}
                authUser={this.props.user}
                cards={this.props.cards}
                settings={this.props.settings}
              />
            </div>
            <div className="col-sm-8 mobileNoPadding" style={rightCol}>
              <div
                className="col-sm-12 mobileNoPadding"
                style={
                  this.props.settings.mode === "night" ? nmBgForCharts : pad15
                }
              >
                <DoughnutChart
                  expenses={this.props.expenses}
                  date={this.state.date.format("MM/DD/YYYY")}
                  authUser={this.props.user}
                  settings={this.props.settings}
                />
              </div>
              <GenerateExcel
                expenses={this.props.expenses}
                date={this.state.date.format("MM/DD/YYYY")}
                authUser={this.props.user}
                settings={this.props.settings}
              />
              {this.state.convertedCurrency ? (
                window.screen.width > 720 ? (
                  <ExpenseTable
                    expenses={this.props.expenses}
                    date={this.state.date.format("MM/DD/YYYY")}
                    authUser={this.props.user}
                    settings={this.props.settings}
                    convertedCurrency={this.state.convertedCurrency}
                  />
                ) : (
                  <MobileExpenseTable
                    expenses={this.props.expenses}
                    authUser={this.props.user}
                    date={this.state.date.format("MM/DD/YYYY")}
                    settings={this.props.settings}
                    convertedCurrency={this.state.convertedCurrency}
                  />
                )
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }
}

export default DailyViewPage;
