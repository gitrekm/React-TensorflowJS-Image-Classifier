import React, { Component } from "react";
import "./UploadFile.css";
import swal from 'sweetalert'
import Spinner from "./Spinner";
import ColorPalette from "./ColorPalette";
// Importing tensorflow mobilenet model
import * as mobilenet from '@tensorflow-models/mobilenet';
// Palette
import getImagePalette from 'image-palette-core';
// Importing the default image
import defaultImg from "../images/defaultImg.jpg";

import pica from "pica";
// const pica = require('pica')();



export default class UploadFile extends Component {
	state = {
		fileToUpload: null,
		isLoading: false,
		predictions: [],
		palette: {}
	}


	// Start the automated Image Classifier once the user has chosen an image
	fileSelectorHandler = async (e) => {
		// Start the loader and restart the prediction and palette
		this.setState({
			isLoading: true,
		  predictions: [],
			palette: {}
		});
		// Take the first file uploaded.
		const file = e.target.files[0];
		// Start the automation ifthe user have choose an image to load
		if(file === undefined || file.size > 10**7){
			// Stop it right await and stop the loader
			this.setState({ isLoading: false });
		} else {
			// Select the file and call the reat file function to display the file on the page
			await this.setState({
				fileToUpload: file
			})
			// check if it's an image
			const ext = file.name.split(".").reverse()[0];
			if(ext === "jpg" || ext === "jpeg" || ext === "png"){
				// Read the image file and recognize the image
				this.readFile();
			}
			else {
				// If it's not an image just alert to the user
				swal("Wrong file type!", "Please choose an image (.jpg or png).", "error");
				// Stop it right await and stop the loader
				this.setState({ isLoading: false });
			}
		}
	}

	readFile = async (result) => {
		// Select the file from the state
		const selectedFile = this.state.fileToUpload;
		// init the file reader
		const reader = new FileReader();
		// Change the image source to display the image
		const imgtag = document.getElementById("myimage");
		// Set the image title
		imgtag.title = selectedFile.name;
		// Prepare the data for TensorFlow (put the src of the image inside an hidden image)
		const tfImg = document.querySelector("#myTfImage");

		// Self calling async function to change the image source before starting the tensorflow recognition
		(async function() {
			reader.onload = await function(event) {
				// imgtag.src = event.target.result;
				tfImg.src = event.target.result;
				imgtag.style.cssText = "box-shadow: 0 3px 10px 0 rgba(0,0,0,.2), 0 1px 3px 0 rgba(0,0,0,.08);"
				imgtag.style.backgroundImage=`url(${ event.target.result })`;
			};
			reader.readAsDataURL(selectedFile);
		})()
			.then(async () => {
				// Call the recognize function
				this.regognizePhoto();
			})
	}

	regognizePhoto = async () => {
		// Recognize the image label using TensorFlow mobilenet model
		const img = document.getElementById('myTfImage');
		// Load the model.
		const model = await mobilenet.load();
		// check if something went wrong...
		let predictions = null;
		setTimeout(() => {
			// If something went wrong during the process, tell it to the user and reload the page
			if(predictions === null){
				swal("Something went wrong...", "Please try again or try another image!", "error")
				  .then(() => {
						window.location.reload();
					})
			}
		}, 3000)
		// Classify the image. (check for the first prediction only)
		predictions = await model.classify(img, 1);
		// put the predictions in the state
		this.setState({ predictions });
		// Now, let's get the color palette
		this.getColorPalette(img);
		// Remove the loader
		this.setState({ isLoading: false });
	}

	getColorPalette = (img) => {
		// get the palette color and put it in the state
		const palette = getImagePalette(img);
		this.setState({palette});
	}

	render() {
		// Prepare the message to display to the user
		let predictionText = "Upload an image first!";
		if(this.state.isLoading){
			predictionText = "Analysing data..."
		}
		else if(this.state.predictions.length > 0){
			// Get the first prediction and the probability of the first prediction (out of 2)
			const probability = Math.floor(this.state.predictions[0].probability * 100) + "%";
			// Change the text prediction text if there is no photo, it's loading or we have the prediction
			predictionText = (<span>I think it's a <span className="prediction">{ this.state.predictions[0].className }</span> at <span className="prediction">{ probability }</span>!</span>);
		}

		return (
			<div className="uploadFileDiv">

				<h1 className="classifierTitle">Automated Image Classifier</h1>

				<div className="uploadDiv">
					<div className="imgAndPalette">
						<div
							className="imageDiv"
							style={{ backgroundImage: `url(${defaultImg})`}}
							id="myimage">
							{ this.state.isLoading && <Spinner /> }
						</div>

						<ColorPalette
							palette={ this.state.palette } />
					</div>

					<h3 className="predictionText">{ predictionText }</h3>

					<div className="buttonDiv">
						<button
							className="btn btn-pick"
							onClick={ () => this.fileInput.click() }>
							upload
						</button>
					</div>
				</div>

				{ /* upload input not showed */ }
				<input
					type="file"
					style={{ display: "none" }}
					onChange={ this.fileSelectorHandler }
					ref={ fileInput => this.fileInput = fileInput } />

				{ /* tensorflow Image not showed */ }
				<img
					src={ defaultImg }
					className="tfImg"
					id="myTfImage"
					alt="myTfImage"/>
			</div>
		)
	}
}
