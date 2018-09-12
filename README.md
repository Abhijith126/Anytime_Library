# Anytime-Library
This project is based on Angular 5 using Google Firebase for authentication and firestore for database

Catch the live action at : https://anytimelibrary-a79ac.firebaseapp.com

# License
MIT License, Check License file for more info

## Explaination of project

This is a Library application which can perform below actions.
Issue book, renew book and return book.
Share the book via social media
Like the book, rate the book and post comments/reviews of the book and more...

Admin user can add new book and can modify the logged in user details and book details.

## How to make yourself as Admin?
click on profile -> edit profile -> check admin option and save. Congratz you're an admin :)

To run the application locally please follow these steps.
```
npm install
npm install --save @ngx-share/core @ngx-share/button
npm install --save @fortawesome/fontawesome-svg-core @fortawesome/angular-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons
```
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. 

## Version Info
```
Angular CLI: 1.6.5
Node: 8.11.1
Angular: 5.2.8
@angular/cdk: 5.2.4
@angular/cli: 1.6.5
@angular/material: 5.2.4
@angular-devkit/build-optimizer: 0.0.42
@angular-devkit/core: 0.0.29
@angular-devkit/schematics: 0.0.52
@ngtools/json-schema: 1.1.0
@ngtools/webpack: 1.9.5
@schematics/angular: 0.1.17
typescript: 2.5.3
webpack: 3.10.0
```
--------------------------------------------------------------------

## Official Documentation of how to use every component/feature.
	#Angular: https://angular.io/docs
	#bootstrap v4: https://getbootstrap.com/docs/4.0/getting-started/introduction/
	#Material design: https://material.angular.io/components/categories
----------------------------------------------------------------------------------------------------
##Task at hand
----------------------------------------------------------------------------------------------------
## User Role
	Able to search for a book using Author or Title
	Able to filter book by book genre / category (ex: Technology, Business, Fiction,Management…..)
	View Book details like Author, Title, Thumbnail image, ISBN, Description
			Issue the book to self, depending on the availability
			Renew the book once for configured days
			Return read book and review & rate the same
			Notify the location of the book in the library while issued / returned
	Set favorite genres (category) for user and display personalized list of book based on favorite genre
	Display list of books with the user along with details like ‘Renew / Return by’ date-time
	There is a limit on no. of books which can be taken which is configurable
	Social features like
		Like & rate books
		Review & recommend books to friends
	Display user profile including picture, social ids, name, friends
----------------------------------------------------------------------------------------------------
## Admin Role
		Add / Update (including no. of copies) / Delete books
		Add using ISBN preferably by reading bar-code through mobile / tablet or entering the code manually
		Retrieve book details using ISBN through any public apis. Details include title, author, description, social rating through goodreads or google or any other sources
		When book details are not available through public, allow admin to enter the details manually
		Display the list of books taken by users and filter by book title, book author, user id, user name, issued date
		Sort the above list by issued date, book title, book author, user name
---------------------------------------------------------------------------------------------------
## How to start?
Initial Guide to create new app visit https://angular.io/guide/quickstart
Make sure to use SASS instead of normal CSS this can be achieved by using the below command while creating new app.
        ng new my-sassy-app --style=scss
## Already created a CSS app? dont worry follow the below guide to convert it to scss.
        https://scotch.io/tutorials/using-sass-with-the-angular-cli
## Need Material design from start? Use the below link for guidance on how to use it.
        https://coursetro.com/posts/code/113/How-to-Build-an-Angular-5-Material-App
----------------------------------------------------------------------------------------------------
## Database and Authentication
Firebase ofcourse. You can use Auth0 for authentencation or stick with Firebase for both.
Guides you say?
    Watch these 3 short videos :)
    https://www.youtube.com/watch?v=Ut0aU2gLJhM&t=0s&list=PL2Q8rFbm-4rvvKSBft5Jh5jP_OSQqiPMs&index=11
    https://www.youtube.com/watch?v=h9zArLD3VNU&list=PL2Q8rFbm-4rvvKSBft5Jh5jP_OSQqiPMs&index=13
    https://www.youtube.com/watch?v=tSLc3be_6cM&index=14&list=PL2Q8rFbm-4rvvKSBft5Jh5jP_OSQqiPMs

# Firebase 5 changelog just in case you were wondering why those methods from videos are not working :P
    https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md
----------------------------------------------------------------------------------------------------
## How to add Bootstrap? and why bootstrap?
    https://loiane.com/2017/08/how-to-add-bootstrap-to-an-angular-cli-project/
    Many components can be desgined easily using bootstrap classes. Additionally Material theme can be installed along side of bootstrap.
    Good of both :D
# For guide on how to install material theme 
    https://material.angular.io/guide/getting-started
# Further Guide on using components and creating the application. Video included :)
    https://coursetro.com/posts/code/113/How-to-Build-an-Angular-5-Material-App
----------------------------------------------------------------------------------------------------
## List of material icons
    https://material.io/icons/
----------------------------------------------------------------------------------------------------
## Sample Project similar to library
    GitHub: https://github.com/etrupja/BookNotes
    YouTube: https://www.youtube.com/playlist?list=PL2Q8rFbm-4rvvKSBft5Jh5jP_OSQqiPMs
----------------------------------------------------------------------------------------------------
## How to implement Routes?
    https://blog.thoughtram.io/angular/2016/07/18/guards-in-angular-2.html
----------------------------------------------------------------------------------------------------
## How to implement Search feature? 
    https://codeburst.io/create-a-search-pipe-to-dynamically-filter-results-with-angular-4-21fd3a5bec5c
----------------------------------------------------------------------------------------------------
