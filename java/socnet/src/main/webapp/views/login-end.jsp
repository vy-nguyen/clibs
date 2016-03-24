<%@include file="bottom-page.jsp"%>
<%@ taglib prefix='sec' uri='http://www.springframework.org/security/tags'%> 
<script type='text/javascript' src='plugins/iCheck/icheck.min.js'></script>
<script type='text/javascript'>
$(document).ready(function() {
  $('#form-reg-id').submit(function(event) {
    register(event);
  });
  $('#id-form-login').submit(function(event) {
    login(event);
  });
  $('#passVerify').keyup(function() {
    if ($('#password').val() != $('#passVerify').val()) {
      $('#id-error-box').show().html('<spr:message code="reg.password.not.match"/>');
    } else {
      $('#id-error-box').html("").hide();
    }
  });
});
$(function () {
  $('input').iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
      increaseArea: '20%' // optional
  });
});
function register(event) {
  event.preventDefault();
  $('.alert').hide();
  $('.error-list').html("");
  if ($('#password').val() != $('#passVerify').val()) {
    $('#id-error-box').show().html('<spr:message code="reg.password.not.match"/>');
    return;
  }
  var formData = $('#form-reg-id').serialize();
  $.post('<c:url value="/register"/>', formData, function(data) {
    if (data.message == "success") {
      <c:url value='login.do' var='redirectUrl'></c:url>
      window.location.href = "${redirectUrl}" + "?email=" + $('#email').val();
    }
  })
  .fail(function(data) {
    if (data.responseJSON.error.indexOf('MailError') > -1) {
      window.location.href = "<c:url value='email-error.do'></c:url>";
    } else if (data.responseJSON.error == 'UserAlreadyExists') {
      $('#emailError').show().html(data.responseJSON.message);
    } else {
      var errors = $.parseJSON(data.responseJSON.message);
      var errbox = $('#id-error-box');
      errbox.empty();
      $.each(errors, function(index, item) {
        $('#' + item.field + 'Error').show().html(item.defaultMessage.substring(0, 80));
        errbox.show().append(item.field + ': ' + item.defaultMessage + '<br>');
      });
    }
  });
};
function login(event) {
  <sec:authorize access="isAuthenticated()">
  </sec:authorize>

  $('.alert').hide();
  var $form = $(this);
  var $input = $form.find('input');
  var formData = $form.serialize();

  $input.prop('disabled', true);
  request = $.ajax({
      url: '/login',
      type: 'post',
      data: formData
  }).done(function (response, textStatus, jqXHR) {
  }).fail(function(jqXHR, textStatus, errors) {
    $('#id-error-box').show();
    $('#id-error-text').empty().html(textStatus + ": " + errors);
  });
  event.preventDefault();
};
</script>
