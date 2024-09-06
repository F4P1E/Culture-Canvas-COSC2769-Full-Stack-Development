import React from "react";

const GroupVisibility = ({ visibility, isAdmin, onChangeVisibility }) => {
    return (
        <div className="group-visibility">
            <h3>Group Visibility</h3>
            <p>
                {visibility === 'Public'
                    ? 'Public: All logged-in user can see the group memebers, group posts, group comments, and group reactions.'
                    : 'Private: Only group memebers can see other group members, group posts, group comments, and group reactions.'}
            </p>

            {isAdmin && (
                <div>
                    <label>
                        <input
                        type="radio"
                        value="Public"
                        checked={visibility === 'Public'}
                        onChange={() => onChangeVisibility('Public')} 
                        />
                        Public
                    </label>
                    <label>
                        <input
                        type="radio"
                        value="Private"
                        checked={visibility === 'Private'}
                        onChange={() => onChangeVisibility('Private')} 
                        />
                        Private
                    </label>
                    </div>
            )}
        </div>
    );
};

export default GroupVisibility;