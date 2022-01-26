import React, {Component} from 'react'
import './App.css';
import Particles from 'react-tsparticles';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Register from './components/Register/Register';
import Signin from './components/Signin/Signin';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: '6128d5183b294f92a4647801139e1c5e'
});

const particlesOptions = {
  particles: {
    line_linked: {
      shadow: {
        enable: true, 
        color: '#3CA9D1',
        blue: 5
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width)
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  
  displayFaceBox = (box) => {
      this.setState({box})
      
  } 

  onInputChange = event => {
     this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(error => console.log(error))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    } 
    this.setState({route: route})
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
    const {onRouteChange, onButtonSubmit, onInputChange} = this;
    return (
      <div className="App">
         <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
        {route === 'home' 
          ? <div>
              <Logo />
              <Rank/>
              <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
             </div>
          : (
             route === 'signin' 
             ? <Signin onRouteChange={onRouteChange}/>
             : <Register onRouteChange={onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
