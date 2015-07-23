$(document).ready(function(){

  //Global variables
  var shifted = false

  //Top class
  var Charts = function() {
    this.oneSeries = [];
    this.seriesS = [];
  }

  Charts.prototype.getOneSeries = function(city,type) {
    this.oneSeries = [];
    var callBackFunction = function(response) {
      for (i = 0; i < response.list.length; i++) {
        this.oneSeries.push(
          {
            x: new Date(response.list[i].dt * 1000),
            y: response.list[i].main[type]
          }
        )
      }
    }
    $.ajax({
      context: this,
      async: false,
      type: 'GET',
      url: 'http://api.openweathermap.org/data/2.5/history/city?q=' + city + '&type=day',
      success: callBackFunction
    })
  }

  Charts.prototype.addToSeriesS = function(city,oneseries) {
    this.seriesS.push(
      {
        name: city,
        data: oneseries
      }
    )
  }

  Charts.prototype.generateChart = function(titleText,subtitleText,seriesS,domID) {
    var highchartConfig = {
      title: {
        text: titleText
      },
      subtitle: {
        text: subtitleText
      },
      xAxis: {
        type: 'datetime'
      },
      series: seriesS
    }
    $('#' + domID + '').highcharts(highchartConfig);
  }

  Charts.prototype.run = function(cityID,type,titleText,subtitleText,domID) {
    this.getOneSeries(cityID,type)
    this.addToSeriesS(cityID,this.oneSeries)
    this.generateChart(titleText,subtitleText,this.seriesS,domID)
  }

  var chartTemp      = new Charts
  var chartPressure  = new Charts
  var chartHumidity  = new Charts
  var chartTempMin   = new Charts
  var chartTempMax   = new Charts

  $('form').submit(function(){
    event.preventDefault();
    if (shifted === false) {
      $(".container").animate({
        top: "-=300px",
      },1000);
      shifted = true;
    }
    var typeInput = $('#typeSelect option:selected').val();
    var cityInput = $('#cityID').val().split(',');
      if        (typeInput === 'temp')     {chartTemp.run     (cityInput,'temp','Temperature','In Kelvin','chartTemp')}
      else if   (typeInput === 'pressure') {chartPressure.run (cityInput,'pressure','Pressure','In bar','chartPressure')}
      else if   (typeInput === 'humidity') {chartHumidity.run (cityInput,'humidity','Relative Humidity','In percentage','chartHumidity')}
      else if   (typeInput === 'tempMin')  {chartTempMin.run  (cityInput,'temp_min','Minimum temperature','In Kelvin','chartTempMin')}
      else if   (typeInput === 'tempMax')  {chartTempMax.run  (cityInput,'temp_max','Maximum temperature','In Kelvin','chartTempMax')}
  })
})
