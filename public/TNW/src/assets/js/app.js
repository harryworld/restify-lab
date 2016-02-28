$(document).foundation();

$('form .callout').hide();

$(document).ready(function() {
  loadArticles();
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
      $('.article-' + index + ' h1').text(obj.title);
      $('.article-' + index + ' a').attr('href', obj.url);
      $('.article-' + index + ' a').attr('style', 'background-image:url(' + obj.image + ');');
    });
  });
}