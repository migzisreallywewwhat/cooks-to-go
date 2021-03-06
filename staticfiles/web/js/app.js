(function () {
    'use strict';
    angular
        .module('app', ['ngRoute', 'ngMaterial', 'ngAnimate'])
        .config(function ($mdThemingProvider) {
            $mdThemingProvider
                .theme('default')
                .primaryPalette('green')
                .accentPalette('orange');
        })
        .config(['$mdIconProvider', function ($mdIconProvider) {
            $mdIconProvider
                .iconSet('action', '/static/web/icons/action.svg', 24)
                .iconSet('navigation', '/static/web/icons/navigation.svg', 24);
                /*
                .iconSet('action', 'svg/action-icons.svg')
                .iconSet('device', 'svg/device-icons.svg')
                .iconSet('content', 'svg/content-icons.svg')
                .iconSet('alert', 'svg/alert-icons.svg')
               .iconSet('image', 'svg/image-icons.svg');*/
        }])
        .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
                $routeProvider
                    .when('/Recipes', {
                        templateUrl: '/visit/recipe',
                        controller: 'RecipeCtrl',
                        controllerAs: 'Recipe'
                    })
                    .when('/Ingredients', {
                        templateUrl: '/visit/ingredients',
                        controller: 'IngridientsCtrl',
                        controllerAs: 'Ingridients'
                    })
                    .when('/Virtual-Basket', {
                        templateUrl: '/visit/virtual-basket',
                        controller: 'RecipeCtrl',
                        controllerAs: 'Recipe'
                    })
                    .when('/Settings', {
                        templateUrl: '/visit/settings',
                        controller: 'RecipeCtrl',
                        controllerAs: 'Recipe'
                    })
                    .otherwise({
                        redirectTo: '/recipes'
                    });
        }])
        .filter('truncate', function (){
            return function (text, length, end){
                if (text !== undefined){
                    if (isNaN(length)){
                        length = 10;
                    }

                    if (end === undefined){
                        end = "...";
                    }

                    if (text.length <= length || text.length - end.length <= length){
                        return text;
                    }else{
                        return String(text).substring(0, length - end.length) + end;
                    }
                }
            };
        })
        .controller('AppCtrl', ['$http', '$scope', '$mdSidenav', '$location', function ($http, $scope, $mdSidenav, $location) {
            // Functions
            $scope.toggleSidenav = function (menuId) {
                $mdSidenav(menuId).toggle();
            };
            $scope.getActive = function(){
                return $scope.active_template;
            };
            $scope.base_url = function(string){
                if (string !== undefined){
                    return $location.protocol() + '://'+ $location.host()+":"+ $location.port() + '/'+ string;
                }else{
                    return $location.protocol() + '://'+ $location.host()+":"+ $location.port();
                }
                
            }
            $scope.menus = [
                {
                    icon: 'action:home',
                    title: 'Recipes'
                },
                {
                    icon: 'action:home',
                    title: 'Ingredients'
                },
                {
                    icon: 'action:shopping_basket',
                    title: 'Virtual Basket'
                },
                {
                    icon: 'action:settings',
                    title: 'Settings'
                }
            ];
            $scope.active_template = $scope.menus[0];
            $scope.recipeDescriptionLimit = 50;
        
        }])
        .controller('SideBarCtrl', ['$scope', '$location', function($scope, $location){
            $scope.toogleTemplate = function(index){
                $scope.$parent.active_template = $scope.$parent.menus[index];
                $location.path($scope.$parent.active_template.title.replace(" ", "-"));
            }
        }])
        .controller('RecipeCtrl', ['$http', '$scope', function($http, $scope){
            $scope.recipetab = 1;
            $http.get($scope.$parent.base_url('api/recipe-types'))
                .success(function(response) {
                    $scope.recipe_types = response.results;
                })
                .error(function(response) {
                    alert("Error Upon Connecting To The Server!");
                    $scope.recipe_types = [];
                });
            $http.get($scope.$parent.base_url('api/recipes'))
                .success(function(response) {
                    $scope.recipes = response.results;
                })
                .error(function(response) {
                    alert("Error Upon Collecting Recipies");
                });
            // Returns the active tab for recipe types
            $scope.toggleRecipeTab = function(index){
                $scope.recipetab = index;
            };
            $scope.viewRecipe = {};
            $scope.isReading = false;
            // Returns the active recipe and set a reading mode
            $scope.toogleRecipe = function(recipeObject){
                $scope.id = recipeObject.pk;
                if(recipeObject.pk !== undefined){
                    $http.get($scope.$parent.base_url('api/recipes/' + $scope.id))
                        .success(function(response){
                            $scope.viewRecipe = response;
                        })
                        .error(function(response){
                            alert('Error Upon Connecting To The Recipe');
                        });
                }else{
                    console.log('Error Upon Collecting Information Of The Selected Recipe');
                }
                $scope.toogleRecipeView();
            };
            // Action for visiting Reading and listing mode
            $scope.toogleRecipeView = function(){
                $scope.isReading = !$scope.isReading;
                if (!$scope.isReading){
                    $scope.viewRecipe = {};
                }
            };
        }])
        .controller('IngridientsCtrl', ['$http', '$scope', function($http, $scope){
            $scope.ingredientstab = 1;
            // Get Ingridients with their corrisponding types
            $http.get($scope.$parent.base_url('api/ingredient-types/'))
                .success(function(response){
                    $scope.ingredient_types = response.results;
                })
                .error(function(response){
                    alert('Error Upon Collecting Ingredients');
                    $scope.ingredient_types = [];
                });
            $scope.toggleIngridientsTab = function(index){
                $scope.ingredientstab = index;
            };
        }]);
}());