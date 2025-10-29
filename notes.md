


09-19-2025 ~ Class Notes

Middleware basic things (remember there are 3 types of middleware) 
Difference between Frameworks and Libraries 


09-22-2025 ~ Class Notes

Request Response Lifecycle - The internet is built on Client request and Server response. Middleware
is the middleman taking care of the request and responses to make sure requests are authenticated.
Middleware is essentially a chain of functions (arrow functions).


Templating EJS (Embedded JavaScript) - This is a Templating Engine.
This is the way to write HTML with placeholders. 

EJS Templating Engine Cheatsheet
This cheatsheet provides a quick reference to common EJS templating syntax and their usage:

<!-- Syntax	Description
<%= %>	Outputs the value of the variable, escaped to prevent XSS (Cross-Site Scripting).
<%- %>	Outputs unescaped HTML (use with caution to avoid XSS).
<% %>	Executes JavaScript code without outputting anything.
<%# %>	Comment tag, does not output anything to the rendered HTML.
<%% %>	Outputs a literal < % in the rendered template.
<? ?>	Alternate syntax for <% %>, often used for compatibility with XML. -->
_______________________________________________________________________________________
Monday Class - 9/29/2025 

Error handling errors

_______________________________________________________________________________________
Monday Class - 10/06/2025 

We started class on MVP (Minimum Viable Product) which helps with refactoring code 

MVC Model View Controller can also be found as MVR Model, View, Routes. 


M - cares about data (usually database)
V - cares about the HTML and CSS 
C - cares about the routes (JavaScript)


_______________________________________________________________________________________
Wednesday Class - 10/08/2025

Node and nodemode when using both env sometimes process can be left running and there can have some abandoned process or orphan. 

Code Review
Code smell

_______________________________________________________________________________________
Wednesday Class - 10/15/2025


Slug = unique ID, kinda like 


Green field - projects are projects that start from the very beginning 
Brown field - projects that already started 


_______________________________________________________________________________________
Monday Class - 10/20/2025

This week we have a routes challenge, where we are going to work on a website to book the train routes

we are going to add registration and authentication in the page now (so please lock in and fix the code)


Droplet Digital Ocean - ssh database set up $6 per month
            name cheap 

_______________________________________________________________________________________
Wednesday Class - 10/22/2025

difference between snake_case and camelCase

M C V logic to fix the problem above


Servers 
DNS 

Example:

    West    |    Central     |    East
            |                |
            |                |
    FB  DB  |      FB  DB    |          KING
            |                |   FB DB
            |                |
         ID |                |


_______________________________________________________________________________________
Monday Class - 10/27/2025

Talking about Web Socket VS HTTP Request Response Lifecycle (flash message system is the resolution of redirecting POST validation)

_______________________________________________________________________________________
Wednesday Class - 10/29/2025

Access control - Unit 4 stuff

final project 