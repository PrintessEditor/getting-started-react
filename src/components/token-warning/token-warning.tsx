import React from "react";
import "./token-warning.css";

export const TokenWarning: React.FC = () => {
    return (
        <div className="token-warning">
            <h4>This site is using a test token</h4>
            You will not be able to modify or print the template.
            Please contact us to get your personal token.
        </div>
    )
}