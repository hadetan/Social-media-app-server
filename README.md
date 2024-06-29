# Social Media App Server

## Description
A social media web app that is build using NodeJS and ReactJS [Frontend Link](https://github.com/hadetan/Social-media-app-client). We can create an account or login into an existing account and we can logout once its logged in or signed in, we can post images with captions, get a list of users whom we are following and get recommendations of user's profile who already exists in this social media's database, we can follow other user's, we can like others and as well as our posts (if we have any), we can update our name, bio and profile picture and lastly we can delete our account if we wish to.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database](#database)
- [License](#license)
- [Contact Information](#contact-information)

## Installation
### Prerequisites
- Node.js
- Mongodb Atlas

### Setup Instructions
```bash
# Clone the repository
git clone https://github.com/hadetan/Social-media-app-server.git

# Navigate to the project directory
cd yourproject

# Install dependencies
npm install
```

## Usage
```bash
# Start the development server
npm start
```

## API Documentation

### End Points
```bash
# Base API url
${server url}/api/v1
```
- GET
```bash
# User token refresh api
/auth/refresh

# Posts of users followed for feed
/user/getFeedData

# My posts
/user/getMyPosts

# My all informations
/user/getMyInfo

# All posts from a user
/user/getUserPosts
```

- POST
```bash
# Create account
/auth/signup

# Login account
/auth/login

# Logout account
/auth/logout

# Follow or unfollow user
/user/follow

# User profile
/user/getUserProfile

# Create post
/posts/

# Like or unlike a post
/posts/like
```

- PUT
```bash
# Update my profile
/user/

# Update my post
/posts/
```

- DELETE
```bash
# Delete my account
/user/

# Delete my post
/posts/
```

## Database

### MongoDB

### Schema
- `users`: Email (required), Password (required), Name, Bio, Avatar, Followers, Followings, Posts.
- `posts`: Owner [Referred to `user`], Image, Caption, Likes [Referred to `user`].

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact Information
Maintainer: Aquib Ali