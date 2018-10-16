import React from "react";
import "./ColorPalette.css";

const ColorPalette = props => {

	// Take the color palette
	const { color, backgroundColor, alternativeColor } = props.palette;
	return (
		<div className="paletteDiv">
			{ color !== undefined && (
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div
						style={{ backgroundColor: `${ color }` }}
						className="colorDiv firstColor tooltip">
						<span className="tooltiptext">{ color }</span>
					</div>
					<div
						style={{ backgroundColor: `${ backgroundColor }` }}
						className="colorDiv tooltip">
						<span className="tooltiptext">{ backgroundColor }</span>
					</div>
					<div
						style={{ backgroundColor: `${ alternativeColor }` }}
						className="colorDiv lastColor tooltip">
						<span className="tooltiptext">{ alternativeColor }</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default ColorPalette;
