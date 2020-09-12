import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Pusher from "pusher-js";
import axios from "./axios";
import "./App.css";
import SideBar from "./SideBar";
import Chat from "./Chat";
import Login from "./Login";
import { useStateValue } from "./StateProvider";

function App() {
  const [messages, setMessage] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  // const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      setMessage(response.data);
    });
  }, []);
  useEffect(() => {
    const pusher = new Pusher("338992baec76b183fd23", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (data) {
      JSON.stringify(data);
      setMessage([...messages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);
  //console.log(user);
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <SideBar />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat messages={messages} />
              </Route>
              <Route path="/">{/* <Chat messages={messages} /> */}</Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
