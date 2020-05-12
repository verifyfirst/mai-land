import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from 'antd';
import { BreakpointProvider } from 'react-socks';
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'

import Overview from './components/pages/Overview'
import CDPs from './components/pages/CDPs'
import Pools from './components/pages/Pool'
import Anchors from './components/pages/Anchors'
import About from './components/pages/About'
import Testing from './components/pages/Testing'

import 'antd/dist/antd.css'
import './App.css'

const { Content } = Layout;

const App = (props) => {
  return (
    <Router>
        <div>
        <BreakpointProvider>
          <Layout>
            <Header />
            <Layout style={{height:"100vh", psition:"relative"}}>
              <Sidebar />
              <Content style={{background: "#fff"}}>
                <Switch>
                  <Route path="/" exact component={Overview} />
                  <Route path="/overview" exact component={Overview} />
                  <Route path="/cdps" exact component={CDPs} />
                  <Route path="/pools" exact component={Pools} />
                  <Route path="/anchors" exact component={Anchors} />
                  <Route path="/about" exact component={About} />
                  <Route path="/testing" exact component={Testing} />
                </Switch>
              </Content>
            </Layout>
          </Layout>
          </BreakpointProvider>
        </div>
      </Router>
  );
}


export default App;
