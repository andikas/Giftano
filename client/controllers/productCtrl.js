var module = angular.module('productCtrl', ['ui.bootstrap']);
module.controller('ProductController',
['$location', '$scope', '$http', '$rootScope', 'ProductService', '$state', '$uibModal', 'CategoryService', '$compile', function($location, $scope, $http, $rootScope, ProductService, $state, $uibModal, CategoryService, $compile){
	
	$scope.product = {
		title : '',
		code : '',
		category: ''
	};
	$scope.viewParent = '';
	ProductService.getProduct().then(function(res) {
		console.log('res', res);
		$scope.products = res.data.allbooks;
	});

	$scope.openProductForm = function () {
		var modalInstance = $uibModal.open({
		    template: '<div class="row"><div class="col-md-12" style="padding:35px"><form ng-submit="product._id ? updateProduct() : saveProduct()"><div class="form-group"><label for="exampleInputTitle">Title</label><input type="text" class="form-control" id="exampleInputTitle" placeholder="Enter Title" ng-model="product.title"></div><div class="form-group"><label for="exampleInputCode">Code</label><input type="text" class="form-control" id="exampleInputCode" placeholder="Code" ng-model="product.code"></div><div ng-class="category.newParent != true? \'displayBlock\' : \'displayNone\'" id="listFormCategory"></div>'+$scope.List+'<div class="form-group"><label for="exampleInputParent">Parent</label><input type="text" class="form-control" id="exampleInputParent" placeholder="Select Parent Above" readonly="true" ng-model="viewParent"></div><button type="submit" class="btn btn-primary">Submit</button></div></div>',
		    controller: 'ProductFormController',
            scope: $scope
		});

		modalInstance.result.then(function (data) {
            $scope.products.push(data);
            $scope.product = {
				title : '',
				code : '',
				category: ''
			};
			$scope.viewParent = '';
		});
	};

	$scope.editProduct = function (data, index){
		$scope.product = data;
		$scope.viewParent = data.category.name
		var modalInstance = $uibModal.open({
		    template: '<div class="row"><div class="col-md-12" style="padding:35px"><form ng-submit="product._id ? updateProduct() : saveProduct()"><div class="form-group"><label for="exampleInputTitle">Title</label><input type="text" class="form-control" id="exampleInputTitle" placeholder="Enter Title" ng-model="product.title"></div><div class="form-group"><label for="exampleInputCode">Code</label><input type="text" class="form-control" id="exampleInputCode" placeholder="Code" ng-model="product.code"></div><div ng-class="category.newParent != true? \'displayBlock\' : \'displayNone\'" id="listFormCategory"></div>'+$scope.List+'<div class="form-group"><label for="exampleInputParent">Parent</label><input type="text" class="form-control" id="exampleInputParent" placeholder="Select Parent Above" readonly="true" ng-model="viewParent"></div><button type="submit" class="btn btn-primary">Submit</button></div></div>',
		    controller: 'ProductFormController',
            scope: $scope
		});

		modalInstance.result.then(function (data) {
			$scope.product = {
				title : '',
				code : '',
				category: ''
			};
			$scope.viewParent = '';
			$scope.products[index] = data;
		});
	}

	$scope.deleteProduct = function (data){
		$scope.product = data;
		var modalInstance = $uibModal.open({
		    templateUrl: 'productDeleteFormModal.html',
		    controller: 'ProductFormController',
            scope: $scope
		});

		modalInstance.result.then(function () {
			for(var i=0; i<$scope.products.length; i++){
				if ($scope.products[i]._id == $scope.product._id){
					$scope.products.splice(i, 1);
					break;
				}
			}
		});
	}

	$scope.assignParent = function(parent, name){
		$scope.product['category'] = parent;
		$scope.viewParent = name;
	}

	var el = document.getElementById('ullist');
	$scope.createCategory = false;
	CategoryService.getCategory().then(function(res) {
		console.log('res', res);
		generateHTMLList(res.data);
		
	});

	$scope.List = "";
	function makeList(array, root){
		console.log('array', array);
	    console.log('inside makelist', $scope.List);
	    // var ul = $("<ul></ul>");
	    // root.append(ul);
	    $scope.List += "<ul>"
	    for (var i = 0; i < array.length; i++) {
	    	$scope.List += "<li class=\"grab\">"
	        // var li = $("<li></li>");
	        // ul.append(li);
	        $scope.List += "<span class='capitalize' ng-click=\"assignParent('"+ array[i].id +"', '"+ array[i].name +"')\">" + array[i].name + "</span class='capitalize'>";
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
module.controller('ProductFormController', ['$scope', '$state', 'ProductService', '$modalInstance', '$compile', function($scope, $state, ProductService, $modalInstance, $compile) {
    
    $scope.saveProduct = function(){
        ProductService.save($scope.product).then(function(res){
        	$modalInstance.close(res.data)
        });
    }

    $scope.updateProduct = function(){
        ProductService.update($scope.product).then(function(res){
        	$modalInstance.close(res.data)
        });
    }

    $scope.deleteProduct = function(){
    	ProductService.deleteProduct($scope.product).then(function(res){
        	$modalInstance.close()
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    
    
}]);