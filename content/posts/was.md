---
title: "Web Application Server(WAS)"
date: 2023-08-12T20:50:32+09:00
draft: false
tags: ["server"]
---

### HTTP
all web broswers communicate through HTTP
client -> internet -> server


### Server vs WAS(web application server)
1. Web Server - HTTP, static content(HTML, CSS, JS, IMAGES, VIDEO), etc.... 
- in simple terms, it's a server that hosts and serves content to the client, used for simple tasks like servic static files, managing client connections, and handling basic request-response.
ex: NGINX, APACHE
2. WAS - Web Server + dynamic content, runs application logic code to provide dynamic HTML, API (JSON), SERVLET, JSP, SPRING MVC
- WAS provides an environment where developers can build, deploy, and run applications that process and generate dynamic content.
*KEY FEATUYRES*
- middleware services: security, transaction management, messaging, etc..
- Application Deployment: deploying and managing web applications.
- Scalability: load balancing and distributing application load across multiple instances.
- Database Connectivity: connect to databases to fetch and update data
ex: Apache Tomcat, Jetty, Undertow, Oracle WebLogic.

3. DIFFERENCE
- static (web server) vs dynamic(was)
- terminology is used interchangeably
*in java, we call something as WAS if it has a servelete container(although some modern exceptions exist)*


