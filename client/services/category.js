
	angular.module('categoryService', []).factory('CategoryService', ['$http', function($http) {
		var getCategory = function() {
	      	return $http.get('api/category');
	    }

	    var save = function(data) {
        	return $http.post('/api/category', data);
    	}

    	// var update = function(data) {
     //    	return $http.post('/api/book/update/' + data._id, data);
    	// }

    	// var deleteCategory = function(data) {
     //    	return $http.delete('/api/book/delete/' + data._id);
    	// }

		return {
	     	getCategory: getCategory,
	     	save: save
	     	// update: update,
	     	// deleteCategory: deleteCategory
	    };
	}]);

