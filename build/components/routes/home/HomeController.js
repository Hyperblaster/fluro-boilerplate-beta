app.controller('HomeController', function($scope, $state, $sessionStorage, FluroContent, session) {


	//This will be the user
	$scope.user = session;

	/**
	$scope.session = $sessionStorage;

	//////////////////////////

	if(!$scope.session.search) {
		$scope.session.search = {};
	}

	if(!$scope.session.selection) {
		$scope.session.selection = [];
	}

	//////////////////////////
    
    $scope.$watch('session.search.terms', function(keywords) {
        
        $scope.facets = [];
         
        if(!keywords || keywords.length < 2) {
            return;
        }
        
        $scope.session.search.status = 'processing';
        
        FluroContent.endpoint('content/search/' + keywords).query({
        	//types:['family','contact']
        }).$promise.then(function(res) {
            
            $scope.facets = _.groupBy(res, function(item) {
            	return item._type;
            });

            $scope.session.search.status = 'ready';
        }, function(res) {
            $scope.session.search.status = 'ready';
        });
    }, true)


    //////////////////////////

	$scope.contains = function(contact) {
		var match = _.find($scope.session.selection, {_id:contact._id});
		if(match) {
			return true;
		}
	}


	//////////////////////////

	$scope.toggle = function(contact) {
		if($scope.contains(contact)) {
			$scope.deselect(contact);
		} else {
			$scope.select(contact);
		}
	}

	//////////////////////////

	$scope.deselect = function(contact) {
		
		var match = _.find($scope.session.selection, {_id:contact._id});
		if(match) {
			_.pull($scope.session.selection, match);
		}

	}

	//////////////////////////

	$scope.select = function(contact) {
		if(!$scope.contains(contact)) {
			$scope.session.selection.push(contact);
		}
	}


	//////////////////////////

	$scope.edit = function(item) {
		switch(item._type) {
			case 'family':
				$state.go('family_edit', {id:item._id})
			break;
			case 'contact':
				$state.go('contact_edit', {id:item._id})
			break;
		}
	}

	//////////////////////////

	$scope.view = function(item) {
		switch(item._type) {
			case 'family':
				$state.go('family_view', {id:item._id})
			break;
			case 'contact':
				$state.go('contact_view', {id:item._id})
			break;
		}
	}

	//////////////////////////
	//////////////////////////
	//////////////////////////
	/**/



});
