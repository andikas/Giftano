angular.module('appRoutes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
	$urlRouterProvider.otherwise("/404");
	$stateProvider.state('product', {
		url: '/product',
		templateUrl: 'client/views/product.html',
		controller: 'ProductController',
		skipAuthentication: true
	}).state('createProduct', {
		url: '/create-product',
		templateUrl: 'client/views/create-product.html',
		controller: 'ProductController',
		skipAuthentication: true
	}).state('category', {
		url: '/category',
		templateUrl: 'client/views/category.html',
		controller: 'CategoryController',
		skipAuthentication: true
	});
	$locationProvider.html5Mode(true);
}]);
