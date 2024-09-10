// SCSS
import "../styles/PeoplePage.scss";

import React from "react";
import StrangerList from "../Friends/StrangerList";

const PeoplePage = () => {
	return (
		<div className="people-page">
			{/* Header for the HomePage */}
			<h1>People Page</h1>

            <StrangerList />
		</div>
	);
};

export default PeoplePage;