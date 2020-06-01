$(function() {
    var native_width = 0;
    var native_height = 0;
    var mouse = {x: 0, y: 0};
    var magnify;
    var cur_img;
    var ui = {
      magniflier: $('.magniflier')
    };
  
    if (ui.magniflier.length) {
      var div = document.createElement('div');
      div.setAttribute('class', 'glass');
      ui.glass = $(div);
      $('body').append(div);
    }
  
    var mouseMove = function(e) {
      var $el = $(this);
  
      var magnify_offset = cur_img.offset();
  
      mouse.x = e.pageX - magnify_offset.left;
      mouse.y = e.pageY - magnify_offset.top;
  
      if (
        mouse.x < cur_img.width() &&
        mouse.y < cur_img.height() &&
        mouse.x > 0 &&
        mouse.y > 0
        ) {
        magnify(e);
      }
      else {
        ui.glass.fadeOut(100);
      }
      return;
    };
    var magnify = function(e) {
  
      var rx = Math.round(mouse.x/cur_img.width()*native_width - ui.glass.width()/2)*-1;
      var ry = Math.round(mouse.y/cur_img.height()*native_height - ui.glass.height()/2)*-1;
      var bg_pos = rx + "px " + ry + "px";
  
      var glass_left = e.pageX - ui.glass.width() / 2;
      var glass_top  = e.pageY - ui.glass.height() / 2;
      
      ui.glass.css({
        left: glass_left,
        top: glass_top,
        backgroundPosition: bg_pos
      });
      return;
    };
    $('.magniflier').on('mousemove', function() {
      ui.glass.fadeIn(100);
     
      cur_img = $(this);
      var large_img_loaded = cur_img.data('large-img-loaded');
      var src = cur_img.data('large') || cur_img.attr('src');
      // Set large-img-loaded to true
      // cur_img.data('large-img-loaded', true)
      if (src) {
        ui.glass.css({
          'background-image': 'url(' + src + ')',
          'background-repeat': 'no-repeat'
        });
      }
  
        if (!cur_img.data('native_width')) {
  
          var image_object = new Image();
          image_object.onload = function() {
    
            native_width = image_object.width;
            native_height = image_object.height;
            cur_img.data('native_width', native_width);
            cur_img.data('native_height', native_height);
     
            mouseMove.apply(this, arguments);
            ui.glass.on('mousemove', mouseMove);
          };
  
          image_object.src = src;
         
          return;
        } else {
          native_width = cur_img.data('native_width');
          native_height = cur_img.data('native_height');
        }
  
      mouseMove.apply(this, arguments);
      ui.glass.on('mousemove', mouseMove);
    });
    ui.glass.on('mouseout', function() {
      ui.glass.off('mousemove', mouseMove);
    });
  });