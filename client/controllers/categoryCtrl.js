var module = angular.module('categoryCtrl', ['ui.bootstrap']);
module.controller('CategoryController',
['$location', '$scope', '$http', '$rootScope', 'CategoryService', '$state', '$uibModal', '$compile', function($location, $scope, $http, $rootScope, CategoryService, $state, $uibModal, $compile){

	$scope.newParentTrue = true;
	$scope.category = {
		name : '',
		newParent: true,
		path: null
	};
	$scope.viewParent = '';
	var el = document.getElementById('ullist');
	$scope.createCategory = false;
	CategoryService.getCategory().then(function(res) {
		console.log('res', res);
		generateHTMLList(res.data);
		
	});

	$scope.openCategoryForm = function () {
		$scope.createCategory = true;
		$scope.newParentTrue = $scope.category.newParent;
		var modalInstance = $uibModal.open({
		    templateUrl: 'categoryFormModal.html',
		    controller: 'CategoryFormController',
            scope: $scope
		});

		modalInstance.result.then(function (data) {
			generateHTMLList(data);
			$scope.category = {
				name : '',
				newParent: true,
				path: null,
				parent: null
			};
		}, function () {
	    	$scope.createCategory = false;
	    	$scope.category = {
				name : '',
				newParent: true,
				path: null,
				parent: null
			};
	   	});
	}

	$scope.editCategory = function (data){
		console.log('blalbalb');
		$scope.product = data;
		var modalInstance = $uibModal.open({
		    templateUrl: 'categoryFormModal.html',
		    controller: 'CategoryFormController',
            scope: $scope
		});

		modalInstance.result.then(function () {
		});
	}

	// $scope.deleteProduct = function (data){
	// 	$scope.product = data;
	// 	var modalInstance = $uibModal.open({
	// 	    templateUrl: 'productDeleteFormModal.html',
	// 	    controller: 'ProductFormController',
 //            scope: $scope
	// 	});

	// 	modalInstance.result.then(function () {
	// 		for(var i=0; i<$scope.products.length; i++){
	// 			if ($scope.products[i]._id == $scope.product._id){
	// 				$scope.products.splice(i, 1);
	// 				break;
	// 			}
	// 		}
	// 	});
	// }

	$scope.assignParent = function(parent, name){
		if($scope.createCategory){
			$scope.category['parent'] = parent;
			$scope.viewParent = name;
		}
	}


	$scope.List = "";
	function makeList(array, root){
	    // var ul = $("<ul></ul>");
	    // root.append(ul);
	    $scope.List += "<ul>"
	    for (var i = 0; i < array.length; i++) {
	    	$scope.List += "<li class=\"grab\">"
	        // var li = $("<li></li>");
	        // ul.append(li);
	        $scope.List += "<span class='capitalize' ng-click=\"assignParent('"+ array[i].id +"', '"+ array[i].name +"')\">" + array[i].name + "</span class='capitalize'>";
	        // $scope.List += "<span class='capitalize' ng-click=\"assignParent('"+ array[i].id +"', '"+ array[i].name +"')\">" + array[i].name + "</span class='capitalize'> <span><i class='glyphicon glyphicon-pencil' aria-hidden='true' style='margin-left:20px' ng-click=\"editCategory('"+array[i]+"')\"> Edit | </i></span><span><i class='glyphicon glyphicon-pencil' aria-hidden='true' ng-click=\"deleteProduct(prod)\"> Delete </i></span>";
	        // li.append(a);
	        if(array[i].comments.length > 0){
	             makeList(array[i].comments);
	        }
	        $scope.List += "</li>"
	    }
	    $scope.List += "</ul>"
	}

	function generateHTMLList(array){
		$scope.List = "";
		makeList(array);
		el = angular.element( document.querySelector( '#ullist' ) );
		el.empty()
		angular.element(el).append( $compile($scope.List)($scope) )
	}

}]);
module.controller('CategoryFormController', ['$scope', '$state', 'CategoryService', '$modalInstance', '$compile',function($scope, $state, CategoryService, $modalInstance, $compile) {
	
	$scope.setNewParent = function(value){
		$scope.category.newParent = value;

		var listcat = angular.element( document.querySelector( '#listFormCategory' ) );
		listcat.empty()
		angular.element(listcat).append( $compile($scope.List)($scope) )
	}
    
    $scope.saveCategory = function(){
		console.log($scope.category)
        CategoryService.save($scope.category).then(function(res){
        	console.log('res', res);
        	$modalInstance.close(res.data)
        });
    }

    // $scope.updateProduct = function(){
    //     ProductService.update($scope.product).then(function(res){
    //     	$modalInstance.close()
    //     });
    // }

    // $scope.deleteProduct = function(){
    // 	ProductService.deleteProduct($scope.product).then(function(res){
    //     	$modalInstance.close()
    //     });
    // }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
}]);