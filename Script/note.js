var app = angular.module('app',['ngRoute','firebase']);
var rootref= new Firebase("https://sweltering-inferno-721.firebaseio.com/");	
var login = false;		
		app.config(function($routeProvider) {
        $routeProvider

            // route untuk index
            .when('/', {
                templateUrl : 'views/login.html',
                controller  : 'authCtrl'
            })

            // route untuk crud page
            .when('/home', {
                templateUrl : 'views/home.html',
                controller  : 'crudCtrl'
            })
			
			.otherwise({redirectTo:'/'})

		});
		
		//controller untuk auth
		var controllers = {};
		controllers.authCtrl = function($scope,$firebaseAuth,$location){
			//auth
			var auth = $firebaseAuth(rootref);
			$scope.message="hello";
			$scope.signIn = function () {
				auth.$authWithPassword({
					email: $scope.username,
					password: $scope.password
				}).then(function() {
					//bila login sukses
					alert("succes");					
					$location.path('/home');
					login = true;
				}, function(err) {
					//bila login gagal
					alert(err.toString());
		
				});
				
			}
	
		}
		
		//controller untuk crud
		controllers.crudCtrl = function($scope,$firebaseArray,$firebaseAuth,$location){
			
			//jika belum login
			if(login == false){
				$location.path('/');
			}
			var ref = rootref.child("data");
			$scope.DB = $firebaseArray(ref);
			console.log($scope.DB);
			
			$scope.app={judul:'',catatan:'',time:''};
			
			$scope.add = function(){
				
				var currentdate = new Date(); 
				$scope.app.time=currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " || "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
				$scope.DB.$add($scope.app);
				$scope.app={judul:'',catatan:''};
			}
			
			$scope.edit=function(value){
				$scope.app=value
			}
			
			$scope.delete = function(item){			
				$scope.DB.$remove(item);
			}
			
		}
	
	app.controller(controllers);
		
		