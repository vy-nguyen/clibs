<%@ taglib prefix='c' uri='http://java.sun.com/jsp/jstl/core'%>
<%@ taglib prefix='spr' uri='http://www.springframework.org/tags'%>
<%@ taglib prefix='sec' uri='http://www.springframework.org/security/tags'%>
<%@ taglib prefix='fmt' uri='http://java.sun.com/jsp/jstl/fmt'%>
<%@ taglib prefix='form' uri='http://www.springframework.org/tags/form'%>
<fmt:setBundle basename='messages'/>
<%@ page session='true'%>
<!DOCTYPE html>
<html>
<head>
  <title>Vietnam Tu Do</title>
  <%@include file="top-page.jsp"%>
</head>
<body class='hold-transition skin-blue sidebar-mini'>
  <sec:authorize var="loggedIn" access="isAuthenticated()" />
  <div class='wrapper'>
    <header class='main-header'>
      <a href='/user' class='logo'>
        <span class='logo-lg'><b>Viet Nam</b> Tu Do</span>
        <span class='logo-mini'><b>VN</b></span>
      </a>
      <%@include file='fmt-topnav.jsp'%>
    </header>
    <%@include file='fmt-sidenav.jsp'%>
    <div class='content-wrapper'>
      <section class='content-header'> <%-- stat box --%>
        ${userStatBox}
      </section>
      <section class='content'>
        <div class='row'>
          <div class='col-md-3'>
            <div class='box box-primary'>
              <div class='box-body box-profile'>
                <%@include file='user-profile.jsp'%>
              <sec:authorize access="hasAuthority('OP-Rd')">
                <p>Heelo, you can read really well....</p>
              </sec:authorize>
              </div>

            </div>
            <div class='box box-primary'>
              <%@include file='user-specialty.jsp'%>
            </div>
          </div>
          <div class='col-md-9'>
            <c:set var='var_instance' scope='page' value='0'/>
            <%@include file='user-newsfeed.jsp'%>
          </div>
        </div>
        <div class='row'>
          <div class='col-md-3'>
            <div class='box box-primary'>
              <%@include file='user-specialty.jsp'%>
            </div>
          </div>
          <div class='col-md-9'>
            <c:set var='var_instance' scope='page' value='1'/>
            <%@include file='user-newsfeed.jsp'%>
          </div>
        </div>
        <c:if test='${not empty publicNews}'>
          <c:forEach items='${pubicNews.topicList}' varStatus='status' var='item'>
            <c:set var='topic' scope='page' value='${item}'/>
            <%@include file='fmt-topic.jsp'%>
            <c:remove var='topic'/>
          </c:forEach>
        </c:if>

        <%@include file='user-sample.jsp'%>
        <%@include file='test/advanced.jsp'%>
      </section>
    </div>
  </div>
  <%@include file='bottom-page.jsp'%>
  <%--@include file='test/extra-js.jsp'--%>
</body>
</html>
