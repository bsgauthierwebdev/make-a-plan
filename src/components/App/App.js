import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import LandingPage from '../LandingPage/LandingPage';
import LogIn from '../LogIn/LogIn';
import SignUp from '../SignUp/SignUp';
import DemoProject from '../DemoProject/DemoProject';
import ContactUs from '../ContactUs/ContactUs';
import Dashboard from '../Dashboard/Dashboard';
import TestPage from '../TestPage/TestPage';
import ProjectListMain from '../ProjectListMain/ProjectListMain';
import ProjectPageMain from '../ProjectPageMain/ProjectPageMain';
import AddProject from '../AddProject/AddProject';
// import DashboardMain from '../DashboardMain/DashboardMain';
import Context from '../../context';
import NavBar from '../NavBar/NavBar';
import TokenService from '../../services/token-service';
import config from '../../config';

class App extends Component {
  state = {
    projects: [],
    materials: [],
    steps: []
  }
  static contextType = Context

  componentDidMount() {
    const reqConfig = {
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${TokenService.getAuthToken()}`,
        }
    }
    Promise.all([
        fetch(`${config.API_ENDPOINT}/projects`, reqConfig),
        fetch(`${config.API_ENDPOINT}/materials`, reqConfig),
        fetch(`${config.API_ENDPOINT}/steps`, reqConfig)
    ])
        .then(([projectsRes, materialsRes, stepsRes]) => {
            if (!projectsRes.ok)
                return projectsRes.json().then(e => Promise.reject(e));
            if (!materialsRes.ok)
                return materialsRes.json().then(e => Promise.reject(e));
            if (!stepsRes.ok)
                return stepsRes.json().then(e => Promise.reject(e));

            return Promise.all([
                projectsRes.json(),
                materialsRes.json(),
                stepsRes.json()
            ]);
        })
        .then(([projects, materials, steps]) => {
          console.log(projects)
          for (let id in projects) {
            let project = projects[id]
            project.materials = []
            for (let id in materials) {
              let material = materials[id]
              if (material.project_id == project.id) {
                project.materials.push(material)
              }
            }
            project.steps = []
            for (let id in steps) {
              let step = steps[id]
              if (step.project_id == project.id) {
                project.steps.push(step)
              }
            }
          }
            this.setState({projects});
        })
        .catch(error => {
            console.error({error});
        });
}

handleDeleteProject = projectId => {
  this.setState({
    projects: this.state.projects.filter(project => project.id !== projectId)
  });
};


  renderMainRoutes() {
    return (
      <>
        {['/user/projects/:projectId'].map(path => (
          <Route
            exact
            key = {path}
            path = {path}
            component = {ProjectPageMain}
          />
        ))}
        <Route 
          exact path = '/' 
          component = {LandingPage} 
        />
        <Route
          path = '/log-in'
          component = {LogIn}
        />
        <Route 
          path = '/sign-up'
          component = {SignUp}
        />
        <Route
          exact path = '/user'
          component = {Dashboard}
        />
        <Route
          exact path = '/user/projects'
          component = {ProjectListMain}
        />
        <Route
          path = '/user/new-project'
          component = {AddProject}
        />
        <Route
          path = '/demo'
          component = {DemoProject}
        />
        <Route
          path = '/contact'
          component = {ContactUs}
        />
        <Route
          path = '/user/test-page'
          component = {TestPage}
        />
      </>
    )
  }

  render() {
    const value = {
      projects: this.state.projects,
      materials: this.state.materials,
      steps: this.state.steps,
      deleteProject: this.handleDeleteProject,
    }

    return (
      <Context.Provider value = {value}>
      <div className = 'App'>
        <NavBar />
        {/* <header className = 'App__header'>
          <h1>Make A Plan</h1>
          <nav>
            <Link to = 'demo'>Demo | </Link>
            <Link to = '/log-in'>Log In | </Link>
            <Link to = '/sign-up'>Sign Up | </Link>
            <Link to = '/user'>My Account | </Link>
            <Link to = '/contact'>Contact Us |</Link>
            <Link to = '/test'>Test Page | </Link>
          </nav>
        </header> */}
        <div className = 'Dashboard__nav'>
            <Link to = '/'>Home | </Link>
            <Link to = '/user'>My Account | </Link>
            <Link to = '/user/projects'>My Projects | </Link>
            <Link to = '/user/new-project'>Add a Project | </Link>
            <Link to = '/user/test-page'>User Test</Link>
        </div>
        <main className = 'App__main'>
          {this.renderMainRoutes()}
        </main>
        <footer>
          <h6>Copyright 2021 bsgauthierwebdev</h6>
          <h6>
            <Link to = '/contact'>Contact us</Link>
            </h6>
          </footer>
      </div>
      </Context.Provider>
    )
  }
}

export default App;