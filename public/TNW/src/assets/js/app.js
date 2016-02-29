$(document).foundation();

$('form .callout').hide();

$(document).ready(function() {
  loadArticles();
});

$('input[type=search]').keyup(function(event) {
  var searchParam = $(event.currentTarget).val();
  $.get('http://localhost:8080/search/' + searchParam, function(data) {
    console.log(data);

    if (data.length == 0) {
      $('.dropdown-pane').html('No result found.');
      return;
    }

    var content = '';
    $.each(data, function(index, value) {
      content += '<div class="row">' + value.title + '</div><hr/>';
    });
    $('.dropdown-pane').html(content);
  }).fail(function() {
    $('.dropdown-pane').html('Search results will show here.');
  });
});

$('form').submit(function(event) {
  event.preventDefault();

  if ( $('input[name=title]').val() === '' ) {
    $('form .alert').show();
    $('form .alert').html('Title cannot be empty.');
    return;
  }

  if ( $('input[name=url]').val().indexOf('http') < 0 ) {
    $('form .alert').show();
    $('form .alert').html('URL is invalid.');
    return;
  }

  if ( $('input[name=image]').val().indexOf('http') < 0 ) {
    $('form .alert').show();
    $('form .alert').html('Image Link is invalid.');
    return;
  }

  $.post('http://localhost:8080/articles', $('form').serialize(), function(data) {
    console.log(data);
    $('form .success').show();
    $('form')[0].reset();

    loadArticles();
  });
});

var loadArticles = function() {
  $.ajax({
    url: 'http://localhost:8080/articles'
  }).done(function( data ) {
    $.each(data, function(index, value) {
      var obj = data[index];
      var uxIndex = index + 1;
      $('.article-' + uxIndex + ' h1').text(obj.title);
      $('.article-' + uxIndex + ' a').attr('href', obj.url);
      $('.article-' + uxIndex + ' a').attr('style', 'background-image:url(' + obj.image + ');');
    });
  });
}