import React, {useState} from "react";

const ToggleButton2 = ({ isToggled, onToggle }) => {

    return (
        <div>
            {/* Display the button with different text based on the toggle state */}
            <button onClick={onToggle}>
                {isToggled ? 'Add advertisements' : 'View route'}
            </button>

            {/* Display a message based on the toggle state */}
            <p>{isToggled ? 'Button is set to view routes' : 'Button is set to add advertisements'}</p>
        </div>
    );
}

export default ToggleButton2;