import React, { useState, useEffect } from "react";
import Expense from "./Expense";
import ReactPaginate from "react-paginate";
import "../../assets/css/table.css";
import * as utils from "../Util";

const ExpenseTable = props => {
  const [expenses, setExpenses] = useState(
    JSON.parse(JSON.stringify(props.expenses)) || []
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (props.expenses && props.authUser) {
      const eachExpense = utils.eachExpense(props.expenses);
      const thisUsersExpenses = utils.currentUsersExpenses(
        eachExpense,
        props.authUser
      );

      setExpenses(thisUsersExpenses);
    }
  }, []);

  const nightMode = {
    background: props.settings
      ? props.settings.mode === "night" ? "#212529" : "auto"
      : "auto"
  };
  const currentUser = props.authUser;

  const recordPerPage = 10;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records =
    expenses.length > 0 ? expenses.slice(firstIndex, lastIndex) : [];
  const npage =
    expenses.length > 0 ? Math.ceil(expenses.length / recordPerPage) : [];

  const handelDateChange = e => {
    const eachExpense = utils.eachExpense(props.expenses);
    const thisUsersExpenses = utils.currentUsersExpenses(
      eachExpense,
      props.authUser
    );

    const searchResults = thisUsersExpenses.filter(elem =>
      elem.value.comments.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setExpenses(searchResults.length ? searchResults : props.expenses);
  };

  const handleChangePage = no => {
    if(no.selected === 0){
        setCurrentPage(1);
    }else{
        setCurrentPage(no.selected + 1);
    }
  };

  if (!expenses || !currentUser) {
    return (
      <label className="null_data">
        Add an expense by clicking on the + Button on the bottom right corner of
        this page.
      </label>
    );
  }

  if (expenses && currentUser) {
    const inputArea = {
      color: "yellow",
      background: "#2C3034",
      border: "none",
      marginLeft: "15px",
      width: "50%",
      float: "right"
    };

    return (
      <div>
        <table
          className="table table-striped table-bordered table-dark rwd-table expense-table mobileNoPadding"
          style={nightMode}
        >
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Date</th>
              <th scope="col">Expense</th>
              <th scope="col">Category</th>
              <th scope="col">
                Comments
                <input
                  type="text"
                  placeholder="  search"
                  style={inputArea}
                  onChange={handelDateChange}
                />
              </th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <Expense
              expenses={records}
              authUser={props.authUser}
              key={Math.random() * 100}
              settings={props.settings}
              convertedCurrency={props.convertedCurrency}
            />
          </tbody>
        </table>
     
        <ReactPaginate
          previousLabel={<i className="fa fa-angle-left" />}
          nextLabel={<i className="fa fa-angle-right" />}
          breakLabel={"..."}
          breakClassName={"page-item"}
          pageCount={npage}
          pageClassName={"page-item"}
          breakLinkClassName={"page-link"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"previous page-link"}
          nextLinkClassName={"next page-link"}
          pageRangeDisplayed={10}
          onPageChange={no => handleChangePage(no)}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
          renderOnZeroPageCount={null}
        />
      </div>
    );
  }
};

export default ExpenseTable;
