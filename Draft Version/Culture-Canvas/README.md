# Culture Canvas Draft Version
Background
You will develop an online social network website like Facebook. The website consists of the following technical components
•	Backend (Express)
•	Frontend (React)
•	Database: MySQL and/or MongoDB
•	Application design: RESTful API
Object
•	Users
•	Admins
•	Groups
Object relationship
•	Friend (between two users)
•	Member (between a user and a group)
•	Group admin (between a user and a group)
Object
•	Post (by a user)
•	Comment (by a user to a post)
•	Reaction: Like/Love/Haha/Angry (by a user to a post or comment)
•	A post can contain text and images
•	A comment can contain text only
•	A user can have at most one reaction for a specific post or comment
Post visibility level
The below levels apply to posts created by users shared directly on their home (wall)
•	Public: all logged-in users can see and comment and react
•	Friend: only friends can see and comment and react
Group visibility level
•	Public: all logged-in users can see the group members, group posts, group comments, and group reactions
•	Private: only group members can see other group members, group posts, group comments, and group reactions
In both cases, group members can create posts, add comments, and react to posts/comments
Interface
User
•	Registration/Login
•	Send a friend request
•	Accept a friend request
•	Unfriend someone
•	Send a group member request
•	Create a post (on the home or in a group)
•	Add a comment
•	Edit a post/comment. In this case, the history of posts/comments must also be available
•	React to a post/comment. Change a previous reaction (no history is needed)
•	Create a group (must wait for admin approval – if approved, the user becomes the group admin)
•	View post feed (visible posts by friends and group posts are displayed here). For long posts, the excerpts are shown
•	View post detail (full post content and all comments are shown)
Group admin
•	Approve member requests
•	Remove members from group
•	Remove group posts and comments
Site admin
•	Approve group creation request
•	Suspend/resume user accounts
•	Delete any posts/comments
Notification
•	Whenever a user receives a friend request, friend request accepted, comment, reaction, group creation approval, the interface must show some kinds of notifications
•	Whenever a group admin receives a group member request, the interface must show some kinds of notifications
User experience requirements
The application should work partly in case there is no response from the server
•	The post feed should continue to function to some extent
•	Users must be able to react to posts or comments, those reactions will be sent to the server once the connection is resumed
In your document, you must explain clearly how you implement those user experience requirements.

