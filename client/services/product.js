
	angular.module('productService', []).factory('ProductService', ['$http', function($http) {

		var getProduct = function() {
			console.log('inside service');
	      	return $http.get('api/book');
	    }

	    var save = function(data) {
        	return $http.post('/api/book', data);
    	}

    	var update = function(data) {
        	return $http.post('/api/book/update/' + data._id, data);
    	}

    	var deleteProduct = function(data) {
        	return $http.delete('/api/book/delete/' + data._id);
    	}

		return {
	     	getProduct: getProduct,
	     	save: save,
	     	update: update,
	     	deleteProduct: deleteProduct
	    };
	}]);

