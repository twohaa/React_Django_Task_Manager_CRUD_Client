import axios from "axios";
import React, { Component } from "react";
import "./App.css";
import Modal from "./components/Modal";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
      todolist: [],
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then((res) => this.setState({ todolist: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();
    if (item.id) {
      axios
        .put(`http:localhost:8000/api/tasks/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          Completed
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Inompleted
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todolist.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-info m-2"
          >
            Edit
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger m-2"
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="content p-3 mb-2 bg-dark">
        <h1 className="text-white text-uppercase text-center my-4">
          Task Manager
        </h1>
        <div className="row">
          <div className="col-md-6 col-sma-10 mx-auto p-0">
            <div className="card p-3">
              <div>
                <button onClick={this.createItem} className="btn btn-warning">
                  Add Task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className="my-3 mb-2 bg-dark text-white text-center">
          All right reservs to &copy;ToxiCoder
        </footer>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;
