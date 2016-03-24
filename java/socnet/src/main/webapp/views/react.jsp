<%@ taglib prefix='c' uri='http://java.sun.com/jsp/jstl/core'%>
<%@ taglib prefix='spr' uri='http://www.springframework.org/tags'%>
<%@ taglib prefix='sec' uri='http://www.springframework.org/security/tags'%>
<%@ taglib prefix='fmt' uri='http://java.sun.com/jsp/jstl/fmt'%>
<%@ taglib prefix='form' uri='http://www.springframework.org/tags/form'%>
<fmt:setBundle basename='messages'/>
<%@ page session='true'%>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Vietnam Tu Do</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <%-- #CSS Links --%>
    <link rel="stylesheet" type="text/css" media="screen" href="/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" media="screen" href="/css/font-awesome.min.css">

    <%-- SmartAdmin Styles : Caution! DO NOT change the order --%>
    <link rel="stylesheet" type="text/css" media="screen" href="/css/Admin/smartadmin-production-plugins.min.css">
    <link rel="stylesheet" type="text/css" media="screen" href="/css/Admin/smartadmin-production.min.css">
    <link rel="stylesheet" type="text/css" media="screen" href="/css/Admin/smartadmin-skins.min.css">

    <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon">

    <link rel="apple-touch-icon" href="/images/splash/sptouch-icon-iphone.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/images/splash/touch-icon-ipad.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/images/splash/touch-icon-iphone-retina.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/images/splash/touch-icon-ipad-retina.png">

    <!-- iOS web-app metas : hides Safari UI Components and Changes Status Bar Appearance -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

    <!-- Startup image for web apps -->
    <link rel="apple-touch-startup-image" href="/images/splash/ipad-landscape.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)">
    <link rel="apple-touch-startup-image" href="/images/splash/ipad-portrait.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)">
    <link rel="apple-touch-startup-image" href="/images/splash/iphone.png" media="screen and (max-device-width: 320px)">
</head>
<body>

<div id="tvntd-root">

</div>
<script src="/client/vendor-bundle.js"></script>
<script src="/client/app-bundle.js"></script>

</body>
</html>
