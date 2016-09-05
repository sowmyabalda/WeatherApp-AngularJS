var myApp = angular.module('myApp',['ngStorage']);
myApp.config(function($sceProvider) {
  // Completely disable SCE.  For demonstration purposes only!
  // Do not use in new projects.
  $sceProvider.enabled(false);
});

myApp.controller('mainController', function($scope,$http,$localStorage){
   
//$scope.hidetable = true;  
$scope.pressure = "NA";
$scope.humidity = "NA";
$scope.minTemp = "NA";
$scope.maxTemp = "NA";
$scope.weatherCity = "<h2>Fetching your Location</h2>";
    
    var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
var cordinates = pos.coords;
var getLat = cordinates.latitude;
var getLong = cordinates.longitude;

    var locURL =  "http://api.openweathermap.org/data/2.5/weather?APPID=f0f214baea5bdcd452b9beea8edce95c&lat="+getLat+"&lon="+getLong+"&units=metric";
$http.get(locURL).success (function(data){
           
            var location = data.main;
            $scope.pressure = location.pressure+ "in";
            $scope.humidity = location.humidity+ "%";
            $scope.minTemp = location.temp_min+'\xB0'+'C';
            $scope.maxTemp = location.temp_max+'\xB0'+'C';
            $scope.weatherCity = "<h2>Weather in the city of "+data.name+"</h2>";
            $scope.tempCity = "<img src=\"http://openweathermap.org/img/w/"+data.weather[0].icon+".png\">"+" "+location.temp+"\xB0"+"C";
    });
};
                               

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

navigator.geolocation.getCurrentPosition(success, error, options);
   
//    Button click
    
$scope.getLocation = function(city){

   
    
var url = "http://api.openweathermap.org/data/2.5/weather?APPID=f0f214baea5bdcd452b9beea8edce95c&q="+city+"&mode=json&units=metric";
    
$http.get(url).success (function(data){
           
            var firstURL = data.main;
            $scope.pressure = firstURL.pressure+ "in";
            $scope.humidity = firstURL.humidity+ "%";
            $scope.minTemp = firstURL.temp_min+'\xB0'+'C';
            $scope.maxTemp = firstURL.temp_max+'\xB0'+'C';
            $scope.weatherCity = "<h2>Weather in the city of "+data.name+"</h2>";
            $scope.city = data.name;
    
$scope.tempCity = "<img src=\"http://openweathermap.org/img/w/"+data.weather[0].icon+".png\">"+" "+firstURL.temp+"\xB0"+"C";
//            $scope.hideValue = false;
            getHourly(city);
            getDaily(city);  
    

//    $localStorage.message = city;
//    $scope.localCity = '<button class=\"btn btn-danger\">'+$localStorage.message+'</button>';
//    console.log($localStorage);
                
    
});
    }

 function getHourly(city){
        $scope.hourTable = "";
      
        var url = "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=8e7f53509f9979ea3be81371f0e09c40&units=metric";
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $http.get(url).success (function(data){
            for(i=0;i<data.list.length;i++){
                var milli = new Date(data.list[i].dt*1000);
                if(i%3==0) $scope.hourTable += "<tr>";
                $scope.hourTable += "<td id=\"td\">"+months[milli.getMonth()]+" "+milli.getDate()+" "+milli.getHours()+":00:00</td><td><img src=\"http://openweathermap.org/img/w/"+data.list[i].weather[0].icon+".png\"> "+data.list[i].main.temp+"\xB0"+"C"+"</td>";
                if(i%3==2) $scope.hourTable += "</tr>";
            }
        });  
    }
     function getDaily(city){
        $scope.dailyTable = "";
          
        var url = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+city+"&units=metric&appid=8e7f53509f9979ea3be81371f0e09c40";
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $http.get(url).success (function(data){
            for(i=0;i<data.list.length;i++){
                var milli = new Date(data.list[i].dt*1000);
                if(i%3==0) $scope.dailyTable += "<tr>";
                $scope.dailyTable += "<td id=\"td\">"+months[milli.getMonth()]+" "+milli.getDate()+" </td><td><img src=\"http://openweathermap.org/img/w/"+data.list[i].weather[0].icon+".png\"> "+data.list[i].temp.day+"\xB0"+"C"+"</td>";
                if(i%3==2) $scope.dailyTable += "</tr>";
            }
        });  
    }
});