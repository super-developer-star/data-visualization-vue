import Spinner from '../../vendor/spin.min.js'

export default {
  name: 'loader',
  template: require('components/layout/Loader.html'),
  data () {
    return {
      msg: 'data crunching in progress'
    }
  },
  mounted () {
    let opts = {
      lines: 17, // The number of lines to draw
      length: 0, // The length of each line
      width: 52, // The line thickness
      radius: 40, // The radius of the inner circle
      scale: 0.5, // Scales overall size of the spinner
      corners: 1, // Corner roundness (0..1)
      color: '#498fe1', // #rgb or #rrggbb or array of colors
      opacity: 0.1, // Opacity of the lines
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      speed: 0.7, // Rounds per second
      trail: 60, // Afterglow percentage
      fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      className: 'spinner', // The CSS class to assign to the spinner
      top: '45vh', // Top position relative to parent
      left: '50%', // Left position relative to parent
      shadow: true, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      position: 'absolute' // Element positioning
    }

    let target = document.getElementById('loader-target')
    new Spinner(opts).spin(target)
  }
}
