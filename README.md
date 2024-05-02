# simple-blog
 This is a NestJS application that allows users to post blogs, update and delete them, add comments, and count views on the blogs. It also incorporates session-based authentication for user management and uses BullMQ queue for processing tasks.

Features

Posting Blogs: Users can create and publish their blogs using this application. They can add a title, content, and tags to their blog posts.
Update/Delete: Authors have the ability to update or delete their blog posts as needed.
Commenting Capability: Readers can leave comments on the blog posts to engage in discussions with the author and other readers.
View Counting: The application tracks the number of views on each blog post, providing insights into the popularity of the content.
Session-Based Authentication: User authentication is handled through sessions, ensuring secure access to the application and its features.
BullMQ Queue: The application uses BullMQ queue for handling background tasks such as sending notifications, processing comments, and managing view counts efficiently.

Installation

Clone the repository:

git clone 'https://github.com/Wronghand-hash/simple-blog'

Install dependencies:

cd nestjs-blogging-app
npm install

Set up the environment variables for the application, including database configuration, session management, and BullMQ queue settings.
Start the application:

npm start

Usage

Once the application is running, users can access the blog posting, updating, deleting, and commenting features through the provided UI or API endpoints.

Technologies Used

NestJS: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
BullMQ: A Node.js library for handling distributed, message queueing systems for processing tasks in the background.
Session-Based Authentication: Utilizes session management for user authentication and authorization.
Database: The application uses a database system for storing blog posts, comments, user data, and view counts.
