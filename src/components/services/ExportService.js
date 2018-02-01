import saveSvgAsPng from 'save-svg-as-png'

export default class ExportService {
  constructor () {
  }

  toPNG(fileName, svgElement, width, height) {
    let index = 0
    let imgArray = []

    const period1 = nch.utils.getTimePeriodLabel( nch.model.period1 )
    const period2 = nch.utils.getTimePeriodLabel( nch.model.period2 )

    const segment = nch.model.selectedSegmentCode === 1 ? 'Food' : 'Non-Food'
    const sectorname = nch.model.selectedSector.sectorname
    const categoriesArray = nch.model.selectedCategories
    let categories = ''
    categoriesArray.forEach(function(item, i) {
      if(i > 0) categories += ', ' + item.categoryname
      else categories += item.categoryname
    })
    const result = 'Period 1: ' + period1 + ', Period 2: ' + period2 + ', Segment: ' + segment + ', Sector: ' + sectorname + ', Categories: ' + categories + '\n'

    let canvas = document.createElement('canvas')
    canvas.setAttribute('width', '' + width)
    canvas.setAttribute('height', '' + height)
    let ctx = canvas.getContext('2d')
    const additionHeight = this.wrapText(ctx, result, 20, 20, (width - 40))

    canvas.setAttribute('height', '' + parseFloat(height + additionHeight))
    ctx = canvas.getContext('2d')
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    this.wrapText(ctx, result, 20, 20, (width - 40))

    let DOMURL = window.URL || window.webkitURL || window
    for( let i = 0; i < svgElement.length; i++ ) {
      imgArray[i] = new Image()
      imgArray[i].src = DOMURL.createObjectURL(new Blob([svgElement[i].ele], {type: "image/svg+xml;charset=utf-8"}))
      imgArray[i].onload = function() {
        index++
        ctx.drawImage(imgArray[i], svgElement[i].posX, svgElement[i].posY + additionHeight, svgElement[i].width, svgElement[i].height)
        DOMURL.revokeObjectURL(DOMURL.createObjectURL(new Blob([svgElement[i].ele], {type: "image/svg+xml;charset=utf-8"})));
        if(index === svgElement.length) {
          saveSvgAsPng.download(fileName + '.png', canvas.toDataURL())
        }
      }
      console.log(canvas.toDataURL())
    }
  }

  toCSV(filename, args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data

    data = args || null
    if (data == null || !data.length) {
      return null
    }

    columnDelimiter = args.columnDelimiter || ','
    lineDelimiter = args.lineDelimiter || '\n'

    keys = Object.keys(data[0])

    const period1 = nch.utils.getTimePeriodLabel( nch.model.period1 )
    const period2 = nch.utils.getTimePeriodLabel( nch.model.period2 )
    const segment = nch.model.selectedSegmentCode === 1 ? 'Food' : 'Non-Food'
    const sectorname = nch.model.selectedSector.sectorname
    const categoriesArray = nch.model.selectedCategories
    let categories = ''
    categoriesArray.forEach(function(item, i) {
      if(i > 0) categories += ', ' + item.categoryname
      else categories += item.categoryname
    });

    result = 'Period 1: ' + period1 + ', Period 2: ' + period2 + ', Segment: ' + segment + ', Sector: ' + sectorname + ', Categories: ' + categories + '\n\n'
    result += "'" + keys.join("'" + columnDelimiter + "'")
    result += "'" + lineDelimiter

    data.forEach(function(item) {
      ctr = 0
      keys.forEach(function(key) {
        if (ctr > 0) result += "'" + columnDelimiter + "'"
        else result += "'"

        result += item[key]
        ctr++
      })
      result += "'" + lineDelimiter
    })
    const csvFile = new Blob([result], {type: "text/csv"});
    let downloadLink = document.createElement("a");
    downloadLink.download = filename + '.csv';
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  wrapText(context, text, x, y, maxWidth) {
    const words = text.split(' ')
    context.fillStyle = "black"
    let line = ''

    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y)
        line = words[n] + ' '
        y += 20
      }
      else {
        line = testLine
      }
    }
    context.fillText(line, x, y)
    return y
  }
}

