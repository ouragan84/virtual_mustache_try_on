import React, {  useRef } from "react"
import './App.css';
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import {drawMesh, drawMoustaches} from "./utilities";

let CanvasWidth = 640;
let CanvasHeight = 480;

const moustache1 = {
  height: 400,
  width: 400,
  centerx: 200,
  centery: 270,
  span: 350,
  src: "moustache1.png"
}

const moustache2 = {
  height: 200,
  width: 200,
  centerx: 100,
  centery: 130,
  span: 150,
  src: "moustache2.png"
}

const moustache3 = {
  height: 507,
  width: 338,
  centerx: 250,
  centery: 230,
  span: 400,
  src: "moustache3.png"
}



let selectedMoustache = moustache1;
let CurrentMoustacheImage = new Image();
CurrentMoustacheImage.src = selectedMoustache.src;
// let runBlazefaceNextUpdate = false;


const defaultImage = 'blankImage.jpg';

function App() {
  // Setup references
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // load blazeface
  const runBlazeface = async (width, height) => {
    const net = await blazeface.load({
      inputResolution:{width:width, height:height}, scale:.8
    });
    waitForDetect(.5, net, width, height);
    
    // console.log("hi");
  }

  // detect function
  const detect = async (net, width, height) => {

    console.log("inside detect : " +width +" x " + height);

    if (
      typeof imageRef.current !== "undefined" &&
      imageRef.current !== null
    ) {
      // get video propreties
      // const video = webcamRef.current.video;
      // const videoWidth = webcamRef.current.video.videoWidth;
      // const videoHeight = webcamRef.current.video.videoHeight;
      const image = imageRef.current;

      // set video width
      // webcamRef.current.video.width = videoWidth;
      // webcamRef.current.video.height = videoHeight;

      // set canvas width
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      // make detections
      const face = await net.estimateFaces(image);
      console.log("faces detected:");
      console.log(face); // might be a good idea to indicate the probability of the prediction

      // get canvas context for drawing
      const ctx = canvasRef.current.getContext("2d");
      
      drawMesh(face, ctx);

      face.forEach(element => {
        // console.log(element);
        drawMoustaches(element, ctx, selectedMoustache, CurrentMoustacheImage);
      });
    }
  }

  const imageHandler = (event) => {
    /*console.log("file handled");
    console.log(event.target.files[0]);
    SelectedFile = event.target.files[0];
    console.log(SelectedFile);*/

    const reader = new FileReader();

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, imageRef.current.width, imageRef.current.height);

    reader.onload = () =>{
      if(reader.readyState === 2){
        // SelectedFile = reader.result
        // console.log(SelectedFile);
        imageRef.current.src = reader.result; // set up a kind of timer, execute blazeface next step
        // runBlazefaceNextUpdate = true;
        waitForLoading(.5);
      }
    }
    reader.readAsDataURL(event.target.files[0])
  }

  // console.log(runBlazefaceNextUpdate);

  // useEffect(() => {
  //   console.log("hey!");
  //   // code to run after render goes here
  //   if(runBlazefaceNextUpdate){
  //     runBlazefaceNextUpdate = false;
  //     console.log("hey!");
  //     console.log(imageRef.current.width + " x " + imageRef.current.height);
  //     runBlazeface(imageRef.current.width, imageRef.current.height);
      
  //   }
  // });

  function waitForLoading(duration) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
        console.log(imageRef.current.width + " x " + imageRef.current.height);
        runBlazeface(imageRef.current.width, imageRef.current.height);
      }, duration * 1000)
    })
  }

  function waitForDetect(duration, net, width, height) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
        detect(net, width, height);
      }, duration * 1000)
    })
  }

  const chooseMoustache1 = () => {
    console.log("moustache1");
    selectedMoustache = moustache1;
    updateMoustache();
  }

  const chooseMoustache2 = () => {
    console.log("moustache2");
    selectedMoustache = moustache2;
    updateMoustache();
  }

  const chooseMoustache3 = () => {
    console.log("moustache3");
    selectedMoustache = moustache3;
    updateMoustache();
  }

  const updateMoustache = () => {
    CurrentMoustacheImage = new Image();
    CurrentMoustacheImage.src = selectedMoustache.src;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, imageRef.current.width, imageRef.current.height);
    waitForLoading(.5);
  }

  // if(runBlazefaceNextUpdate){
  //   runBlazefaceNextUpdate = false;
  //   console.log("hey!");
  //   console.log(imageRef.current.width + " x " + imageRef.current.height);
  //   runBlazeface(imageRef.current.width, imageRef.current.height);
  // }

  return (
    <div className="App">
      <input type="file" accept="image/*" name="image-upload" id="input" onChange={imageHandler}/>
      <button onClick={chooseMoustache1}>Select Moustache 1</button>
      <button onClick={chooseMoustache2}>Select Moustache 2</button>
      <button onClick={chooseMoustache3}>Select Moustache 3</button>
      <header className="App-header">
        {/*<Webcam ref={webcamRef} style={
          {
            position:"absolute",
            marginLeft:"auto",
            marginRight:"auto",
            left:0,
            right:0,
            textAlign:"centr",
            zIndex:9,
            width:CanvasWidth,
            height:CanvasHeight
          }
        } />*/}
        
        <img ref={imageRef} src={defaultImage} alt="" id="img" className="img" style={
              {
                position:"absolute",
                marginLeft:"auto",
                marginRight:"auto",
                marginTop: 50,
                left:0,
                right:0,
                textAlign:"centr",
                zIndex:9
              }
        } />

        <canvas ref={canvasRef} style={
          {
            position:"absolute",
            marginLeft:"auto",
            marginRight:"auto",
            marginTop: 50,
            left:0,
            right:0,
            textAlign:"centr",
            zIndex:9
          }
        } />
      </header>
    </div>
  );
}

export default App;