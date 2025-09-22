


09-19-2025 ~ Class Notes

Middleware basic things (remember there are 3 types of middleware) 
Difference between Frameworks and Libraries 


09-22-2025 ~ Class Notes

Request Response Lifecycle - The internet is built in Client request and Server response. Middleware 
is the middle man taking care of the request and responses to make sure requests are authenticated 
Middleware is essentially a chain of functions (arrow functions).


Templating EJS (Embedded Javascript) This is a Templating Engine
This is the way to write HTML with placeholders. 

EJS Templating Engine Cheatsheet
This cheatsheet provides a quick reference to common EJS templating syntax and their usage:

Syntax	Description
<%= %>	Outputs the value of the variable, escaped to prevent XSS (Cross-Site Scripting).
<%- %>	Outputs unescaped HTML (use with caution to avoid XSS).
<% %>	Executes JavaScript code without outputting anything.
<%# %>	Comment tag, does not output anything to the rendered HTML.
<%% %>	Outputs a literal <% in the rendered template.
<? ?>	Alternate syntax for <% %>, often used for compatibility with XML.

