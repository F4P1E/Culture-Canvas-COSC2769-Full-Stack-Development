import React from "react";
import StrangerList from "../Friends/StrangerList";
import "../styles/PeoplePage.scss";

const PeoplePage = () => {
	return (
		<div className="people-page">
			{/* Header for the HomePage */}
			<h1>People Page</h1>
		<div className="stranger-list-container">
            <StrangerList />
			</div>
		</div>
	);
};

export default PeoplePage;